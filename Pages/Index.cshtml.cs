using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace BridgeScenarios.Pages;

public class IndexModel : PageModel
{

    public IndexModel() {
        error_input = false;
        TextInput = "";
    }

    [BindProperty]
    public string TextInput { get; set; }

    public string ScriptOutput { get; set; }

    // N: S,H,D,C, E:...
    public string[] HandSuits { get; set; }

    public string Tries { get; set; }

    public bool error_input { get; set; }

    public string ToSave { get; set; }

    public async Task<IActionResult> OnPostAsync(string action)
    {
        Console.WriteLine("---");
        Console.WriteLine("action:");
        Console.WriteLine(action);
        Console.WriteLine("---");
        var tempFilePath = Path.GetTempFileName();
        await System.IO.File.WriteAllTextAsync(tempFilePath, TextInput);

        if (action == "save") {
            ToSave = RunScript(tempFilePath, 10);
            if (error_input) {
                ToSave = "An error occured. Try to generate example deal.\n";
            }
        }

        ScriptOutput = RunScript(tempFilePath, 1);

        System.IO.File.Delete(tempFilePath);

        if (!error_input) {
            getHands(ScriptOutput);
        } else {
            removeHarmfulChars();
            ScriptOutput += " ";
        }

        return Page();
    }

    private void removeHarmfulChars() {
        ScriptOutput = ScriptOutput.Replace("`", "'");
    }

    private void getHands(string input) {
        // Extracting the tries part
        int start = input.IndexOf("Tries:") + "Tries:".Length;
        string tries = input.Substring(start).Trim();
        Tries = tries;
        error_input = false;
        if (input.Length < 20) {
            return;
        }
        start = input.IndexOf('"') + 1;
        int end = input.IndexOf('"', start);
        string handsPart = input.Substring(start, end - start);

        // Split the hands for N, E, S, W
        string[] hands = handsPart.Split(' ');

        if (HandSuits == null) {
            HandSuits = new string[16];
        }

        hands[0] = hands[0].Remove(0,2);

        string hand;
        string[] suits;
        for (int i = 0;i < 4; i++) {
            hand = hands[i];
            suits = hand.Split('.').Select(s => string.IsNullOrEmpty(s) ? "-" : s).ToArray();
            for (int j = 0; j < 4; j++) {
               HandSuits[i * 4 + j] = suits[j];
            }
        }
    }

    private string RunScript(string filePath, int deals_num)
    {
        Console.WriteLine($"Generating deals for : {deals_num}");
        string scriptPath = Path.Combine("Latte", "get_scenarios.sh");

        var processStartInfo = new ProcessStartInfo
        {
            FileName = "/bin/bash",
            Arguments = $"{scriptPath} {filePath} {deals_num}",
            RedirectStandardOutput = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        };

        using (var process = Process.Start(processStartInfo))
        {
            var result = process.StandardOutput.ReadToEnd();
            process.WaitForExit();
            var exitCode = process.ExitCode;
            if (exitCode != 0) {
                error_input = true;
            }
            return result;
        }
    }

    public IActionResult OnGetLogView()
    {
        return Partial("Shared/_LogView");
    }
}
