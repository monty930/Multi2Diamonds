using System.Diagnostics;
using BridgeScenarios.DealSetTools.Models;

namespace BridgeScenarios.DealSetTools;

public class ConverterRunner
{
    private readonly string _basePath = Path.Combine("BridgeTools", "Lin");
    private readonly string _defaultScriptName = Path.Combine("convert_pbn_to_lin.sh");
    private string CompilerPath { get; }
    private string PbnString { get; }
    
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
        await File.WriteAllTextAsync(tempFilePath, PbnString);
        
        _processStartInfo.Arguments = $"{CompilerPath} {tempFilePath}";
        
        using var process = Process.Start(_processStartInfo) ?? throw new NullReferenceException();
        
        var output = await process.StandardOutput.ReadToEndAsync();
        await process.WaitForExitAsync();
        
        // cehck if the process exited with an error
        if (process.ExitCode != 0)
        {
            throw new ConverterException(output);
        }
        return output;
    }
    
    public ConverterRunner(RawScriptOutput pbnScriptOutput)
    {
        CompilerPath = Path.Combine("./", _basePath, _defaultScriptName);
        PbnString = pbnScriptOutput.ScriptOutputRaw;
    }
}