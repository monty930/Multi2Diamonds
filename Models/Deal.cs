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
}