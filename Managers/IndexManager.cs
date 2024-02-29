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

        // Generate one deal, no matter what the compiler settings are.
        var scriptOut = model.Compiler.Run(tempFilePath, 1);

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
        await File.WriteAllTextAsync(tempFilePath, model.TextInput);

        // Generate as many deals, as compiler settings indicates (default: 0).
        var scriptOut = model.Compiler.Run(tempFilePath, 0);

        File.Delete(tempFilePath);

        if (scriptOut.ExitCode != 0)
        {
            scriptOut.RawOutput = "An error occured. Try to generate example deal.\n";
            return new IndexViewModel
            {
                ScriptOutput = scriptOut.RawOutput,
                IsErrorInput = true
            };
        }

        var byteArray = Encoding.UTF8.GetBytes(scriptOut.RawOutput);
        var stream = new MemoryStream(byteArray);
        return new IndexViewModel
        {
            ScriptOutput = scriptOut.RawOutput,
            OutputStream = stream
        };
    }
}