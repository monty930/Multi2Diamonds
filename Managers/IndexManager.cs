using BridgeScenarios.DealSetTools;
using BridgeScenarios.DealSetTools.Models;
using BridgeScenarios.Models;
using BridgeScenarios.Models.ViewModels;

namespace BridgeScenarios.Managers;

public class IndexManager
{ 
    public async Task<IndexViewModel> GenerateDeals(IndexViewModel model)
    {
        // The compiler settings (and compiler itself)
        // are defined in the CompilerSettings.
        try
        {
            var scriptOut = await model.CompilerRunner.Run();
            return new IndexViewModel
            {
                RightDisplay = model.RightDisplay,
                ScriptOutputRaw = scriptOut,
            };
        } 
        catch (CompilerException e)
        {
            return new IndexViewModel
            {
                ScriptOutputRaw = e.Message + "\n",
                RightDisplay = RightViewDisplay.Error
            };
        }
    }

    public async Task<RawScriptOutput> ConvertToLin(ConverterRunner converterRunner)
    {
        try
        {
            var scriptOut = await converterRunner.Run();
            return new RawScriptOutput { ScriptOutputRaw = scriptOut };
        } 
        catch (CompilerException e)
        {
            return new RawScriptOutput { ScriptOutputRaw = e.Message + "\n"};
        }
    }
}