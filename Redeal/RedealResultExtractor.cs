using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Redeal;

public static class RedealResultExtractor
{
    public static RedealScriptResult Extract(RedealScriptOutput output)
    {
        string rawOutput = output.RawOutput;
        var result = new RedealScriptResult();
        
        // Extracting the tries part
        int start = rawOutput.IndexOf("Tries:", StringComparison.Ordinal) + "Tries:".Length;
        string tries = rawOutput[start..].Trim();
        result.Tries = tries;
        
        if (rawOutput.Length < 20)
            return result;
        
        
        start = rawOutput.IndexOf('"') + 1;
        int end = rawOutput.IndexOf('"', start);
        string handsPart = rawOutput.Substring(start, end - start);

        // Split the hands for N, E, S, W
        string[] hands = handsPart.Split(' ');
        
        hands[0] = hands[0].Remove(0,2);
        for (var i = 0; i < 4; i++) {
            string hand = hands[i];
            string[] suits = hand.Split('.').Select(s => string.IsNullOrEmpty(s) ? "-" : s).ToArray();
            for (var j = 0; j < 4; j++) {
                result.HandSuits[i * 4 + j] = suits[j];
            }
        }

        return result;
    }
    
    public static void RemoveHarmfulChars(this RedealScriptOutput output) {
        output.RawOutput = output.RawOutput.Replace("`", "'");
    }
}