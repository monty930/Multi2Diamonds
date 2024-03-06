namespace BridgeScenarios.Redeal;

public class LatteCompilerSettings : CompilerSettings
{
    public LatteCompilerSettings(int numberOfDeals)
    {
        CompilerPath = Path.Combine(BasePath, "Latte", DefaultScriptName);
        NumberOfDeals = numberOfDeals == 0 ? DefaultNumberOfDeals : numberOfDeals;
    }
    
    public LatteCompilerSettings(SettingsArgs compilerSettings)
    {
        Console.WriteLine("LatteCompilerSettings");
        CompilerPath = Path.Combine(BasePath, "Latte", DefaultScriptName);
        NumberOfDeals = compilerSettings.NumberOfDeals == 0 ? DefaultNumberOfDeals : compilerSettings.NumberOfDeals;
    }

    public sealed override string CompilerPath { get; set; }
    public sealed override int NumberOfDeals { get; set; }
}