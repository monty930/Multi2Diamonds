namespace BridgeScenarios.Redeal;

public class LatteCompilerSettings : CompilerSettings
{
    public override string CompilerPath { get; set; }
    public override int NumberOfDeals { get; set; }
    public LatteCompilerSettings(int numberOfDeals)
    {
        CompilerPath = Path.Combine(BasePath, "Latte", DefaultScriptName);
        NumberOfDeals = numberOfDeals == 0 ? DefaultNumberOfDeals : numberOfDeals;
    }
}