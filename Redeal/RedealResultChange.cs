using BridgeScenarios.Models;
using BridgeScenarios.Redeal.Models;
using System.Text.RegularExpressions;

namespace BridgeScenarios.Redeal;

public class RedealResultChange
{
    public static RedealChangedOutput Remove(string rawOutput, int whichDeal)
    {
        var splitOutput = Regex.Split(rawOutput, @"Tries");
        var tries = splitOutput[1];
        string[] deals = splitOutput[0].Split(new string[] { "[Deal \"" }, StringSplitOptions.RemoveEmptyEntries);

        RedealChangedOutput output = new RedealChangedOutput();

        if (whichDeal < 1 || whichDeal > deals.Length)
        {
            throw new ArgumentOutOfRangeException(nameof(whichDeal), "The deal number is out of range.");
        }

        deals = deals.Where((deal, index) => index != whichDeal - 1).ToArray();

        output.Output = string.Join("[Deal \"", deals);
        // add tries back
        output.Output += "\n\nTries" + tries;
        if (deals.Length > 0 && !output.Output.StartsWith("[Deal \""))
        {
            output.Output = "[Deal \"" + output.Output;
        }

        output.NumberOfDeals = deals.Length;

        return output;
    }
    
    public static RedealChangedOutput ReplaceOne(string rawOutput, string deal, int whichDeal)
    {
        var dealMatch = Regex.Match(deal, @"\[Deal ""(.+?)""\]");
        if (!dealMatch.Success)
        {
            throw new ArgumentException("Invalid deal format.", nameof(deal));
        }
        string dealContent = dealMatch.Groups[1].Value;
        
        var splitOutput = Regex.Split(rawOutput, @"Tries");
        var tries = splitOutput[1];

        string normalizedRawOutput = splitOutput[0].Replace("\r\n", "\n").Trim(); // Normalize to Unix-style newlines and trim whitespace
        
        
        string[] deals = Regex.Split(normalizedRawOutput, @"(?=\[Deal "")").Where(s => !string.IsNullOrWhiteSpace(s)).ToArray();

        if (whichDeal < 1 || whichDeal > deals.Length)
        {
            throw new ArgumentOutOfRangeException(nameof(whichDeal), "The deal number is out of range.");
        }

        string replacementDeal = $"[Deal \"{dealContent}\"]\n";
        deals[whichDeal - 1] = replacementDeal;
        string outputString = string.Join("", deals);
        outputString += "\n\nTries" + tries;

        RedealChangedOutput output = new RedealChangedOutput
        {
            Output = outputString,
            NumberOfDeals = deals.Length
        };

        return output;
    }
    
    public static RedealChangedOutput AddDeal (string rawOutput, string deal)
    {
        var dealSplit = Regex.Split(deal, @"\n\nTries");
        deal = dealSplit[0];
        
        Console.WriteLine(deal);
        
        var splitOutput = Regex.Split(rawOutput, @"\nTries");
        var tries = splitOutput[1];
        
        // remove last character from splitOutput[0] to remove the last newline
        splitOutput[0] = splitOutput[0].Substring(0, splitOutput[0].Length - 1);
        
        RedealChangedOutput output = new RedealChangedOutput();
        
        output.Output = splitOutput[0] + deal + "\n\nTries" + tries;
        output.NumberOfDeals = output.Output.Split(new string[] { "[Deal \"" }, StringSplitOptions.RemoveEmptyEntries).Length;

        return output;
    }
}