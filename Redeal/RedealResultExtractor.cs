using BridgeScenarios.Models;
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
        hands[0] = hands[0].Remove(0,2);

        string[][] splitHands = hands.Select(h => h.Split('.')).ToArray();

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
    
    public static void RemoveHarmfulChars(this RedealScriptOutput output) {
        output.RawOutput = output.RawOutput.Replace("`", "'");
    }
}