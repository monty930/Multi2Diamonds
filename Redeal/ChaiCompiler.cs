using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Redeal;

public class ChaiCompiler : CompilerSettings
{
    public override string CompilerPath { get; set; }
    public override int NumberOfDeals { get; set; }
    public ChaiCompiler(int numberOfDeals)
    {
        CompilerPath = Path.Combine(BasePath, "Chai", DefaultScriptName);
        NumberOfDeals = numberOfDeals == 0 ? DefaultNumberOfDeals : numberOfDeals;
    }
}