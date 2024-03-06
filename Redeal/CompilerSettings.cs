using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Redeal;

public abstract class CompilerSettings
{
    protected const int DefaultNumberOfDeals = 10;
    protected readonly string BasePath = Path.Combine("BridgeTools");
    protected readonly string DefaultScriptName = Path.Combine("get_scenarios.sh");
    public abstract string CompilerPath { get; set; }
    public abstract int NumberOfDeals { get; set; }

    public RedealScriptOutput Run(string tempFilePath, int? numberOfDeals = null)
    {
        var scriptRunner = new RedealScriptRunner();
        var numberOfDealsToRun = numberOfDeals ?? NumberOfDeals;
        var scriptOut = scriptRunner.RunScript(tempFilePath, numberOfDealsToRun);
        return scriptOut;
    }
}