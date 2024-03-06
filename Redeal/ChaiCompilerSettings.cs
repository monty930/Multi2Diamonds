namespace BridgeScenarios.Redeal;

public class ChaiCompilerSettings : CompilerSettings
{
    public ChaiCompilerSettings(int numberOfDeals)
    {
        CompilerPath = Path.Combine(BasePath, "Chai", DefaultScriptName);
        NumberOfDeals = numberOfDeals == 0 ? DefaultNumberOfDeals : numberOfDeals;
    }

    public sealed override string CompilerPath { get; set; }
    public sealed override int NumberOfDeals { get; set; }

    public ChaiCompilerSettings(SettingsArgs args)
    {
        CompilerPath = Path.Combine(BasePath, "Chai", DefaultScriptName);
        NumberOfDeals = args.NumberOfDeals == 0 ? DefaultNumberOfDeals : args.NumberOfDeals;
    }
}