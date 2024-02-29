namespace BridgeScenarios.Redeal;

public class LatteCompiler : CompilerSettings
{
    public override string CompilerPath { get; set; }
    public override int NumberOfDeals { get; set; }
    public LatteCompiler(int numberOfDeals)
    {
        CompilerPath = Path.Combine(BasePath, "Latte", DefaultScriptName);
        NumberOfDeals = numberOfDeals == 0 ? DefaultNumberOfDeals : numberOfDeals;
    }
}