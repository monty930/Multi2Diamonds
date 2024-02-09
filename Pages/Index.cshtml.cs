using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace BridgeScenarios.Pages;

public class IndexModel : PageModel
{
    [BindProperty]
    public string TextInput { get; set; } // The property to bind the input text from the textbox

    // N: S,H,D,C, E:...
    public string[] HandSuits { get; set; }

    public string Tries { get; set; }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!string.IsNullOrWhiteSpace(TextInput))
        {
            // Create a temporary file and write the input text into it
            var tempFilePath = Path.GetTempFileName();
            await System.IO.File.WriteAllTextAsync(tempFilePath, TextInput);

            // Run the script with the temporary file as an argument
            var scriptOutput = RunScript(tempFilePath);

            // Clean up the temporary file
            System.IO.File.Delete(tempFilePath);

            getHands(scriptOutput);
        }

        return Page(); // Return to the same page to display the output
    }

    private void getHands(string input) {
        Console.WriteLine(input);
        // return ("-", "-", "-", "-", "ERROR");
        if (input.Contains("failed", StringComparison.OrdinalIgnoreCase)) {
            return;
        }
        // Extracting the tries part
        int start = input.IndexOf("Tries:") + "Tries:".Length;
        string tries = input.Substring(start).Trim();
        Tries = tries;
        if (input.Length < 20) {
            return;
        }
        start = input.IndexOf('"') + 1;
        int end = input.IndexOf('"', start);
        string handsPart = input.Substring(start, end - start);

        // Split the hands for N, E, S, W
        string[] hands = handsPart.Split(' ');

        // var imagePath = urlHelper.Content("~/assets/arrow.png");

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

        // // Lambda to format a single hand
        // Func<string, string> formatHand = hand => {
        //     var suits = hand.Split('.').Select(s => string.IsNullOrEmpty(s) ? "-" : s).ToArray();
    
        //     // string[] suits = (hand.Remove(0,2)).Split('.');
        //     // suits = suits.Select(s => string.IsNullOrEmpty(s) ? "-" : s).ToArray();
        //     // Console.WriteLine(suits.Length);
        //     return (
        //         $"<img id=\"suit-img\" src=\"{imagePath}\"/>" + suits[0] + "<br>" +
        //         "H: " + suits[1] + "<br>" +
        //         "D: " + suits[2] + "<br>" +
        //         "C: " + suits[3] + "<br>");
        // };

        // formatHand(hands[0])

        // for (int i = 0; i <= 4; i++) {
            
        // }

        // // Format each hand
        // string north = formatHand(hands[0]);
        // string east = formatHand(hands[1]);
        // string south = formatHand(hands[2]);
        // string west = formatHand(hands[3]);

        // return (north, east, south, west, tries);
    }

    private string RunScript(string filePath)
    {
        // Assuming your script is located in the "backend" folder and named "gen_scenarios.sh"
        string scriptPath = Path.Combine("backend", "get_scenarios.sh");

        // Execute the script with the temporary file as an argument
        var processStartInfo = new ProcessStartInfo
        {
            FileName = "/bin/bash", // or "cmd.exe" on Windows
            Arguments = $"{scriptPath} {filePath}",
            RedirectStandardOutput = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        };

        using (var process = Process.Start(processStartInfo))
        {
            var result = process.StandardOutput.ReadToEnd();
            process.WaitForExit();
            return result;
        }
    }
}
