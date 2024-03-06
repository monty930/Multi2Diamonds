namespace BridgeScenarios.Models;

public class ScriptOutputInfo
{
    public ScriptOutputInfo(string output, int numberOfDeals, int dealNumber)
    {
        Output = output;
        NumberOfDeals = numberOfDeals;
        DealNumber = dealNumber;
    }
    
    public string Output { get; set; }
    public int NumberOfDeals { get; set; }
    
    // This property is used to display the correct deal from the deal set.
    // If DealNumber is n, the n-th deal from the deal set is displayed.
    public int DealNumber { get; set; }
}