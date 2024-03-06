using BridgeScenarios.Models;
using BridgeScenarios.Models.ViewModels;

namespace BridgeScenarios.Managers;

public class IndexManager
{ 
    public async Task<IndexViewModel> GenerateDeals(IndexViewModel model)
    {
        var tempFilePath = Path.GetTempFileName();
        await File.WriteAllTextAsync(tempFilePath, model.TextInput);

        // Generate as many deals, as compiler settings indicates (default: 0).
        var scriptOut = model.Compiler.Run(tempFilePath);

        File.Delete(tempFilePath);

        if (scriptOut.ExitCode != 0)
        {
            return new IndexViewModel
            {
                ScriptOutputRaw = scriptOut.RawOutput + "\n",
                RightDisplay = RightViewDisplay.Error
            };
        }
        
        return new IndexViewModel
        {
            RightDisplay = model.RightDisplay,
            ScriptOutputRaw = scriptOut.RawOutput,
        };
    }
}