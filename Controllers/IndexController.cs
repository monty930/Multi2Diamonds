using BridgeScenarios.Managers;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Redeal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BridgeScenarios.Controllers;

public class IndexController : Controller
{
    private IndexManager _indexManager = new();
    
    [Route("play")]
    public async Task<IActionResult> Play([BindRequired] IndexViewModel model)
    {
        

        return Page("Index");
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