using BridgeScenarios.Models;
using BridgeScenarios.Redeal.Models;
using System.Text.RegularExpressions;

namespace BridgeScenarios.Redeal;

public static class RedealResultExtractor
{
    public static RedealScriptResult Extract(string rawOutput, int whichDeal = 1)
    {
        // Extracting the tries part
        var triesStart = rawOutput.IndexOf("Tries:", StringComparison.Ordinal) + "Tries:".Length;
        var tries = rawOutput[triesStart..].Trim();

        // Split the input into individual deals
        var dealMatches = Regex.Matches(rawOutput, @"\[Deal ""[^""]+""\]")
            .Cast<Match>()
            .Select(m => m.Value)
            .ToList();

        if (!dealMatches.Any() || dealMatches.Count < whichDeal)
        {
            return new RedealScriptResult
            {
                Tries = tries
            };
        }

        // Adjust for 1-indexed input
        var selectedDealRaw = dealMatches[whichDeal - 1];

        // Extract the hands part from the selected deal
        var start = selectedDealRaw.IndexOf('"') + 1;
        var end = selectedDealRaw.LastIndexOf('"');
        var handsPart = selectedDealRaw.Substring(start, end - start);

        // Split the hands for N, E, S, W
        var hands = handsPart.Split(' ');
        hands[0] = hands[0].Remove(0, 2); // Remove the leading "N:"

        var splitHands = hands.Select(h => h.Split('.')).ToArray();

        var deal = new Deal
        {
            North = new Hand(splitHands[0]),
            East = new Hand(splitHands[1]),
            South = new Hand(splitHands[2]),
            West = new Hand(splitHands[3])
        };

        return new RedealScriptResult
        {
            Tries = tries,
            Deal = deal
        };
    }
    
    public static RedealScriptResult Extract(RedealScriptOutput output, int whichDeal = 1)
    {
        var rawOutput = output.RawOutput;
        return Extract(rawOutput, whichDeal);
    }

    public static void RemoveHarmfulChars(this RedealScriptOutput output)
    {
        output.RawOutput = output.RawOutput.Replace("`", "'");
    }
}
