namespace BridgeScenarios.Models;

public class Hand
{
    public string Spades { get; set; } = string.Empty;
    public string Hearts { get; set; } = string.Empty;
    public string Diamonds { get; set; } = string.Empty;
    public string Clubs { get; set; } = string.Empty;

    public Hand() {}

    public Hand(IReadOnlyList<string> suits)
    {
        if (suits.Count != 4)
            throw new ApplicationException("Ivalid hand declaration");
        
        Spades = suits[0];
        Hearts = suits[1];
        Diamonds = suits[2];
        Clubs = suits[3];
    }
    
    public IEnumerable<string> Suits => new List<string> { Spades, Hearts, Diamonds, Clubs };
    
    
}

public static class HandExtensions
{
    public static int Evaluate(this Hand hand, IEvaluator evaluator)
    {
        return hand.Suits.Select(evaluator.Apply).Sum();
    }

    public static int Hcp(this Hand hand)
    {
        return hand.Suits.Select(Evaluator.Hcp.Apply).Sum();
    }
} 
