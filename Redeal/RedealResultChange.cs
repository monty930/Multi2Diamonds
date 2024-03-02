using BridgeScenarios.Models;
using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Redeal;

public class RedealResultChange
{
    public static RedealChangedOutput Remove(string rawOutput, int whichDeal)
    {
        string[] deals = rawOutput.Split(new string[] { "[Deal \"" }, StringSplitOptions.RemoveEmptyEntries);

        RedealChangedOutput output = new RedealChangedOutput();

        if (whichDeal < 1 || whichDeal > deals.Length)
        {
            throw new ArgumentOutOfRangeException(nameof(whichDeal), "The deal number is out of range.");
        }

        deals = deals.Where((deal, index) => index != whichDeal - 1).ToArray();

        output.Output = string.Join("[Deal \"", deals);
        if (deals.Length > 0 && !output.Output.StartsWith("[Deal \""))
        {
            output.Output = "[Deal \"" + output.Output;
        }

        output.NumberOfDeals = deals.Length;

        return output;
    }
}