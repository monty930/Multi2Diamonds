using System.Diagnostics;
using BridgeScenarios.DealSetTools.Models;

namespace BridgeScenarios.DealSetTools;

public class CompilerRunner
{
    private readonly string _basePath = Path.Combine("BridgeTools");
    private readonly string _defaultScriptName = Path.Combine("get_scenarios.sh");

    private readonly ProcessStartInfo _processStartInfo = new()
    {
        FileName = "/bin/bash",
        RedirectStandardOutput = true,
        UseShellExecute = false,
        CreateNoWindow = true
    };

    public CompilerRunner(SettingsArgs args)
    {
        CompilerPath = Path.Combine("./", _basePath, _defaultScriptName);
        CompilerSettings = args;
    }

    private string CompilerPath { get; }

    private SettingsArgs CompilerSettings { get; }

    public async Task<string> Run()
    {
        var tempFilePath = Path.GetTempFileName();
        await File.WriteAllTextAsync(tempFilePath, CompilerSettings.InputText);

        _processStartInfo.Arguments =
            $"{CompilerPath} " +
            $"-c {CompilerSettings.Compiler} " +
            $"-f {tempFilePath} " +
            $"-n {CompilerSettings.NumberOfDeals} " +
            $"-v {CompilerSettings.Vul} " +
            $"-d {CompilerSettings.Dealer} " +
            $"-i {CompilerSettings.Flip} " +
            $"-s {CompilerSettings.Scoring}";

        using var process = Process.Start(_processStartInfo) ?? throw new NullReferenceException();

        var output = await process.StandardOutput.ReadToEndAsync();
        await process.WaitForExitAsync();

        // cehck if the process exited with an error
        if (process.ExitCode != 0) throw new CompilerException(output);
        return output;
    }
}