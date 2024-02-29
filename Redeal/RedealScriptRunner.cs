using System.Diagnostics;
using System.Runtime.InteropServices;
using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Redeal;

public class RedealScriptRunner
{
    private readonly string _scriptPath = Path.Combine("BridgeTools", "Chai", "get_scenarios.sh");
    private readonly string _parserPath;

    private readonly ProcessStartInfo _processStartInfo = new()
    {
        FileName = "sh",
        RedirectStandardOutput = true,
        UseShellExecute = false,
        CreateNoWindow = true
    };

    public RedealScriptRunner()
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            _parserPath = Path.Combine("chai_py");
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            // You windows whore
            // You still need CygWin to run the .sh script
            _parserPath = Path.Combine("chai_py.exe");
        else
            throw new NotSupportedException(RuntimeInformation.OSDescription);
    }

    public RedealScriptOutput RunScript(string filePath, int nDeals)
    {
        _processStartInfo.Arguments = $"{_scriptPath} {_parserPath} {filePath} {nDeals}";
        
        using var process = Process.Start(_processStartInfo) ?? throw new NullReferenceException();
        string output = process.StandardOutput.ReadToEnd();
        process.WaitForExit();
        
        return new RedealScriptOutput
        {
            RawOutput = output,
            ExitCode = process.ExitCode
        };
    }
}