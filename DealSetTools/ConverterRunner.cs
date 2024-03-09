using System.Diagnostics;
using System.Xml.Schema;
using BridgeScenarios.DealSetTools.Models;
using BridgeScenarios.Models;

namespace BridgeScenarios.DealSetTools;

public class ConverterRunner
{
    private readonly string _basePath = Path.Combine("BridgeTools", "ExtensionConverter"); 
    private string CompilerPath { get; }
    private string DsiString { get; }
    
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
        await File.WriteAllTextAsync(tempFilePath, DsiString);
        
        _processStartInfo.Arguments = $"{CompilerPath} {tempFilePath}";
        
        using var process = Process.Start(_processStartInfo) ?? throw new NullReferenceException();
        
        var output = await process.StandardOutput.ReadToEndAsync();
        await process.WaitForExitAsync();
        
        // check if the process exited with an error
        if (process.ExitCode != 0)
        {
            throw new ConverterException(output);
        }
        return output;
    }
    
    public ConverterRunner(RawScriptOutput dsiScriptOutput, Extension extention)
    {
        var scriptName = extention switch
        {
            Extension.Lin => Path.Combine("dsi2lin.sh"),
            Extension.Pbn => Path.Combine("dsi2pbn.sh"),
            _ => throw new ArgumentOutOfRangeException(nameof(extention), extention, null)
        };
        CompilerPath = Path.Combine("./", _basePath, scriptName);
        DsiString = dsiScriptOutput.ScriptOutputRaw;
    }
}