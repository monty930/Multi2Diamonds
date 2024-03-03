using BridgeScenarios.Models;
using BridgeScenarios.Models.DbModels;
using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Redeal;

public static class RedealResultExtractor
{
    public static RedealScriptResult Extract(RedealScriptOutput output)
    {
        var rawOutput = output.RawOutput;

        // Extracting the tries part
        var start = rawOutput.IndexOf("Tries:", StringComparison.Ordinal) + "Tries:".Length;
        var tries = rawOutput[start..].Trim();

        if (rawOutput.Length < 20)
            return new RedealScriptResult
            {
                Tries = tries
            };


        start = rawOutput.IndexOf('"') + 1;
        var end = rawOutput.IndexOf('"', start);
        var handsPart = rawOutput.Substring(start, end - start);

        // Split the hands for N, E, S, W
        var hands = handsPart.Split(' ');
        hands[0] = hands[0].Remove(0, 2);

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

    public static void RemoveHarmfulChars(this RedealScriptOutput output)
    {
        output.RawOutput = output.RawOutput.Replace("`", "'");
    }
}