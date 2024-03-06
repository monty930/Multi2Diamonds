using BridgeScenarios.Models;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Redeal;

namespace BridgeScenarios.Managers;

public class IndexManager
{ 
    public async Task<IndexViewModel> GenerateDeals(IndexViewModel model)
    {
        // The compiler settings (and compiler itself)
        // are defined in the CompilerSettings.
        try
        {
            var scriptOut = await model.RedealRunner.Run();
            return new IndexViewModel
            {
                RightDisplay = model.RightDisplay,
                ScriptOutputRaw = scriptOut,
            };
        } 
        catch (RedealException e)
        {
            return new IndexViewModel
            {
                ScriptOutputRaw = e.Message + "\n",
                RightDisplay = RightViewDisplay.Error
            };
        }
    }
}