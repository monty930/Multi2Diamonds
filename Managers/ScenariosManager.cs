using Multi2Diamonds.Scenarios.Models;
using Multi2Diamonds.Scenarios;

namespace Multi2Diamonds.Managers;

public class ScenariosManager
{
    public async Task<ScenariosModel> GenerateDeals(ScenariosModel model)
    {
        // The compiler settings (and compiler itself)
        // are defined in the CompilerSettings.
        try
        {
            var scriptOut = await model.CompilerRunner.Run();
            return new ScenariosModel
            {
                RightDisplay = model.RightDisplay,
                ScriptOutputRaw = scriptOut
            };
        }
        catch (CompilerException e)
        {
            return new ScenariosModel
            {
                ScriptOutputRaw = e.Message + "\n",
                RightDisplay = RightViewDisplay.Error
            };
        }
    }
}