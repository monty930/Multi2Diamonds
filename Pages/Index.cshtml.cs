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
    [BindProperty] public string TextInput { get; set; } = string.Empty;

    public string ScriptOutput { get; set; } = string.Empty;

    // N: S,H,D,C, E:...
    public string[] HandSuits { get; set; }

    public string Tries { get; set; }

    public bool error_input { get; set; } = false;

    public string ToSave { get; set; } = string.Empty;

    public async Task<IActionResult> OnPostAsync(string action)
    {
        var tempFilePath = Path.GetTempFileName();
        await System.IO.File.WriteAllTextAsync(tempFilePath, TextInput);
        
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
            Tries = scriptResults.Tries;
        }

        return Page();
    }
    
    public IActionResult OnGetLogView()
    {
        return Partial("Shared/_LogView");
    }
}
