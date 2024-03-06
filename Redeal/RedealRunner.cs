using System.Diagnostics;
using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Redeal;

public class RedealRunner
{
    private readonly string _basePath = Path.Combine("BridgeTools");
    private readonly string _defaultScriptName = Path.Combine("get_scenarios.sh");
    private string CompilerPath { get; }
    
    SettingsArgs CompilerSettings { get; }
    
    private readonly ProcessStartInfo _processStartInfo = new()
    {
        FileName = "/bin/bash",
        RedirectStandardOutput = true,
        UseShellExecute = false,
        CreateNoWindow = true
    };

    public async Task<string> Run()
    {
        var tempFilePath = Path.GetTempFileName();
        await File.WriteAllTextAsync(tempFilePath, CompilerSettings.InputText);
        
        _processStartInfo.Arguments = $"{CompilerPath} {CompilerSettings.Compiler} {tempFilePath} {CompilerSettings.NumberOfDeals}";
        
        using var process = Process.Start(_processStartInfo) ?? throw new NullReferenceException();
        
        var output = await process.StandardOutput.ReadToEndAsync();
        await process.WaitForExitAsync();
        
        // cehck if the process exited with an error
        if (process.ExitCode != 0)
        {
            throw new RedealException(output);
        }
        return output;
    }
    
    public RedealRunner(SettingsArgs args)
    {
        CompilerPath = Path.Combine("./", _basePath, _defaultScriptName);
        CompilerSettings = args;
    }
}