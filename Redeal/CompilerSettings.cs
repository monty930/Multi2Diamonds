using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Redeal;

public abstract class CompilerSettings
{
    protected const int DefaultNumberOfDeals = 10;
    protected readonly string BasePath = Path.Combine("BridgeTools");
    protected readonly string DefaultScriptName = Path.Combine("get_scenarios.sh");
    public abstract string CompilerPath { get; set; }
    public abstract int NumberOfDeals { get; set; }

    public RedealScriptOutput Run(string tempFilePath, int numberOfDeals)
    {
        var scriptRunner = new RedealScriptRunner();
        numberOfDeals = numberOfDeals == 0 ? NumberOfDeals : numberOfDeals;
        var scriptOut = scriptRunner.RunScript(tempFilePath, numberOfDeals);
        return scriptOut;
    }
}