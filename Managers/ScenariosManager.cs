using Multi2Diamonds.Models.DbModels;
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
                ScriptOutputRaw = scriptOut,
                DealSet = DealSet.FromString(scriptOut),
                IsCorrectDeal = true
            };
        }
        catch (CompilerException e)
        {
            return new ScenariosModel
            {
                ScriptOutputRaw = e.Message + "\n",
                IsCorrectDeal = false
            };
        }
    }
}