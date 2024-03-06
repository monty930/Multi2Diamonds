namespace BridgeScenarios.Redeal;

public abstract class CompilerSettings
{
    protected const int DefaultNumberOfDeals = 10;
    protected readonly string BasePath = Path.Combine("BridgeTools");
    protected readonly string DefaultScriptName = Path.Combine("get_scenarios.sh");
    public abstract string CompilerPath { get; set; }
    public abstract int NumberOfDeals { get; set; }

    public async Task<string> Run(string textInput, int? numberOfDeals = null)
    {
        var tempFilePath = Path.GetTempFileName();
        await File.WriteAllTextAsync(tempFilePath, textInput);
        // print content of temp file
        Console.WriteLine($"Temp file content: {await File.ReadAllTextAsync(tempFilePath)}");
        // var scriptRunner = new RedealScriptRunner();
        var numberOfDealsToRun = numberOfDeals ?? NumberOfDeals;
        //var scriptOut = scriptRunner.RunScript(tempFilePath, numberOfDealsToRun);
        //return scriptOut;
        Console.WriteLine($"Temp file path: {tempFilePath}");
        Console.WriteLine($"Running script with {numberOfDealsToRun} deals");
        Console.WriteLine($"Input text: {textInput}");
        Console.WriteLine($"Compiler path: {CompilerPath}");
        // File.Delete(tempFilePath);
        return "";
    }
}