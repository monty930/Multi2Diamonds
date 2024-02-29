using System.Text;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Redeal;

namespace BridgeScenarios.Managers;

public class IndexManager
{
    public async Task<IndexViewModel> Play(IndexViewModel model)
    {
        var tempFilePath = Path.GetTempFileName();
        await File.WriteAllTextAsync(tempFilePath, model.TextInput);

        var scriptRunner = new RedealScriptRunner();
        var scriptOut = scriptRunner.RunScript(tempFilePath, 1);

        File.Delete(tempFilePath);

        if (scriptOut.ExitCode != 0)
        {
            scriptOut.RemoveHarmfulChars();
            return new IndexViewModel
            {
                ScriptOutput = scriptOut.RawOutput + " ",
                IsErrorInput = true
            };
        }

        var scriptResults = RedealResultExtractor.Extract(scriptOut);
        return new IndexViewModel
        {
            ScriptOutput = scriptOut.RawOutput,
            IsErrorInput = false,
            Deal = scriptResults.Deal,
            IsCorrectDeal = true,
            Tries = scriptResults.Tries
        };
    }

    public async Task<IndexViewModel> Save(IndexViewModel model)
    {
        var tempFilePath = Path.GetTempFileName();
        await System.IO.File.WriteAllTextAsync(tempFilePath, model.TextInput);

        var scriptRunner = new RedealScriptRunner();
        var output = scriptRunner.RunScript(tempFilePath, 10);
        if (output.ExitCode != 0)
        {
            output.RawOutput = "An error occured. Try to generate example deal.\n";
            return new IndexViewModel
            {
                ScriptOutput = output.RawOutput,
                IsErrorInput = true
            };
        }

        var byteArray = Encoding.UTF8.GetBytes(output.RawOutput);
        var stream = new MemoryStream(byteArray);
        return new IndexViewModel
        {
            ScriptOutput = output.RawOutput,
            IsErrorInput = false,
            OutputStream = stream
        };
    }
}