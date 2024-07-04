using Multi2Diamonds.Scenarios.Models.CompilerSettings;

namespace Multi2Diamonds.Polls.Models;

public class PollsSettingsArgs
{
    public int NumberOfDeals { get; set; } = 30;
    public string Bidding { get; set; } = "";
    public string KeyBinds { get; set; } = "";
    public VulChoice Vul { get; set; } = VulChoice.All;
    public string Constraint { get; set; } = "NoConstraint";
}
