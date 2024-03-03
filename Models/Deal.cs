namespace BridgeScenarios.Models;

public class Deal
{
    public Position Dealer;
    public int Number;
    public Vul Vul;
    public Hand West { get; set; } = new();
    public Hand North { get; set; } = new();
    public Hand East { get; set; } = new();
    public Hand South { get; set; } = new();

    public override string ToString()
    {
        return $"N:{North} {East} {South} {West}";
    }

    public static Deal FromString(string s)
    {
        string[] hands = s[2..].Split(" ");

        return new Deal
        {
            North = Hand.FromString(hands[0]),
            East = Hand.FromString(hands[1]),
            South = Hand.FromString(hands[2]),
            West = Hand.FromString(hands[3])
        };
    }
}