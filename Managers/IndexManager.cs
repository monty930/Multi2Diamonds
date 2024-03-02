using System.Text;
using BridgeScenarios.Models;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Redeal;

namespace BridgeScenarios.Managers;

public class IndexManager
{
    public async Task<IndexViewModel> GenerateExample(IndexViewModel model)
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
                RightDisplay = RightViewDisplay.Error
            };
        }

        var scriptResults = RedealResultExtractor.Extract(scriptOut);
        return new IndexViewModel
        {
            ScriptOutput = scriptOut.RawOutput,
            RightDisplay = RightViewDisplay.Example,
            Deal = scriptResults.Deal,
            Tries = scriptResults.Tries
        };
    }

    public async Task<IndexViewModel> GenerateDealSet(IndexViewModel model)
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
                RightDisplay = RightViewDisplay.Error
            };
        }

        var byteArray = Encoding.UTF8.GetBytes(scriptOut.RawOutput);
        var stream = new MemoryStream(byteArray);
        var scriptResults = RedealResultExtractor.Extract(scriptOut);
        return new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet,
            ScriptOutput = scriptOut.RawOutput,
            OutputStream = stream,
            Deal = scriptResults.Deal,
            Tries = scriptResults.Tries,
            ScriptOutputInfo = new ScriptOutputInfo(scriptOut.RawOutput, 10, 1)
        };
    }
    
    public async Task<IndexViewModel> MoveDeal(IndexViewModel model, int direction)
    {
        model.ScriptOutputInfo.DealNumber += direction;
        var scriptResults = RedealResultExtractor.Extract(model.ScriptOutputInfo.Output, model.ScriptOutputInfo.DealNumber);
        model.ScriptOutputInfo.NumberOfDeals = scriptResults.NumberOfDeals;
        return new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet,
            ScriptOutputInfo = model.ScriptOutputInfo,
            Deal = scriptResults.Deal,
            Tries = scriptResults.Tries
        };
    }
    
    public async Task<IndexViewModel> Trash(IndexViewModel model)
    {
        var dealNum = model.ScriptOutputInfo.DealNumber;
        var removed = RedealResultChange.Remove(model.ScriptOutputInfo.Output, dealNum);
        var newNumberOfDeals = removed.NumberOfDeals;
        var newScriptOutput = removed.Output;
        if (newNumberOfDeals == 0)
        {
            return new IndexViewModel
            {
                RightDisplay = RightViewDisplay.Entry
            };
        }

        model.ScriptOutputInfo.NumberOfDeals = newNumberOfDeals;
        model.ScriptOutputInfo.Output = newScriptOutput;
        if (dealNum == 1)
        {
            var scriptResults = RedealResultExtractor.Extract(model.ScriptOutputInfo.Output, model.ScriptOutputInfo.DealNumber);
            return new IndexViewModel
            {
                RightDisplay = RightViewDisplay.DealSet,
                ScriptOutputInfo = model.ScriptOutputInfo,
                Deal = scriptResults.Deal,
                Tries = scriptResults.Tries
            };
        }
        else // display previous deal
        {
            model.ScriptOutputInfo.DealNumber--;
            var scriptResults = RedealResultExtractor.Extract(model.ScriptOutputInfo.Output, model.ScriptOutputInfo.DealNumber);
            return new IndexViewModel
            {
                RightDisplay = RightViewDisplay.DealSet,
                ScriptOutputInfo = model.ScriptOutputInfo,
                Deal = scriptResults.Deal,
                Tries = scriptResults.Tries
            };
        }
    }

    public async Task<IndexViewModel> RegenerateOne(IndexViewModel model)
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
                RightDisplay = RightViewDisplay.Error
            };
        }

        var oneDeal = scriptOut.RawOutput;
        
        var regenerated = RedealResultChange.ReplaceOne(model.ScriptOutputInfo.Output, oneDeal, model.ScriptOutputInfo.DealNumber);
        model.ScriptOutputInfo.Output = regenerated.Output;
        model.ScriptOutputInfo.NumberOfDeals = regenerated.NumberOfDeals;
        var scriptResults = RedealResultExtractor.Extract(model.ScriptOutputInfo.Output, model.ScriptOutputInfo.DealNumber);
        
        return new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet,
            ScriptOutputInfo = model.ScriptOutputInfo,
            Deal = scriptResults.Deal,
            Tries = scriptResults.Tries
        };
    }
    
    public async Task<IndexViewModel> AddDeal(IndexViewModel model)
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
                RightDisplay = RightViewDisplay.Error
            };
        }

        var oneDeal = scriptOut.RawOutput;
        
        var regenerated = RedealResultChange.AddDeal(model.ScriptOutputInfo.Output, oneDeal);
        model.ScriptOutputInfo.Output = regenerated.Output;
        model.ScriptOutputInfo.NumberOfDeals = regenerated.NumberOfDeals;
        var scriptResults = RedealResultExtractor.Extract(model.ScriptOutputInfo.Output, model.ScriptOutputInfo.DealNumber + 1);
        model.ScriptOutputInfo.DealNumber = scriptResults.NumberOfDeals;
        return new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet,
            ScriptOutputInfo = model.ScriptOutputInfo,
            Deal = scriptResults.Deal,
            Tries = scriptResults.Tries
        };
    }
}