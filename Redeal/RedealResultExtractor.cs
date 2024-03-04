using BridgeScenarios.Models;
using BridgeScenarios.Models.DbModels;
using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Redeal;

public static class RedealResultExtractor
{
    public static RedealScriptResult Extract(RedealScriptOutput output)
    {
        string rawOutput = output.RawOutput;

        // Extracting the tries part
        int start = rawOutput.IndexOf("Tries:", StringComparison.Ordinal) + "Tries:".Length;
        string tries = rawOutput[start..].Trim();

        if (rawOutput.Length < 20)
            return new RedealScriptResult
            {
                Tries = tries
            };


        start = rawOutput.IndexOf('"') + 1;
        int end = rawOutput.IndexOf('"', start);
        string handsPart = rawOutput.Substring(start, end - start);

        // Split the hands for N, E, S, W
        string[] hands = handsPart.Split(' ');
        hands[0] = hands[0].Remove(0, 2);

        var deal = new Deal
        {
            North = hands[0],
            East = hands[1],
            South = hands[2],
            West = hands[3]
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