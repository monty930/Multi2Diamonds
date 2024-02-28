using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using System.Text;
using BridgeScenarios.Redeal;

namespace BridgeScenarios.Pages;

public class IndexModel : PageModel
{
    public IndexModel() {
        error_input = false;
        TextInput = "";
    }

    [BindProperty]
    public string TextInput { get; set; }

    public string? ScriptOutput { get; set; }

    // N: S,H,D,C, E:...
    public string[] HandSuits { get; set; }

    public string Tries { get; set; }

    public bool error_input { get; set; }

    public string ToSave { get; set; }

    public async Task<IActionResult> OnPostAsync(string action)
    {
        var tempFilePath = Path.GetTempFileName();
        await System.IO.File.WriteAllTextAsync(tempFilePath, TextInput);

        if (action == "save") {
            var scriptOutput = await RunScriptSaveAsync(tempFilePath, 10);
            var byteArray = Encoding.UTF8.GetBytes(scriptOutput);
            var stream = new MemoryStream(byteArray);
            return File(stream, "text/plain", "file.txt");
        }

        var scriptRunner = new RedealScriptRunner();
        var scriptOut = scriptRunner.RunScript(tempFilePath, 1);

        System.IO.File.Delete(tempFilePath);

        if (scriptOut.ExitCode != 0)
        {
            scriptOut.RemoveHarmfulChars();
            ScriptOutput = scriptOut.RawOutput + " ";
        }
        else
        {
            var scriptResults = RedealResultExtractor.Extract(scriptOut);
            HandSuits = scriptResults.HandSuits;
            Tries = scriptResults.Tries;
        }

        return Page();
    }

    private async Task<string> RunScriptSaveAsync(string filePath, int deals_num)
    {

        var scriptRunner = new RedealScriptRunner();
        var output = scriptRunner.RunScript(filePath, 10);
        if (output.ExitCode != 0) {
            output.RawOutput = "An error occured. Try to generate example deal.\n";

        }
        return output.RawOutput;
    }
    
    

    public IActionResult OnGetLogView()
    {
        return Partial("Shared/_LogView");
    }
}
