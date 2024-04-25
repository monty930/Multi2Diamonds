using Multi2Diamonds.Scenarios.Models.CompilerSettings;

namespace Multi2Diamonds.Scenarios.Models;

public class SettingsArgs
{
    public string[] ConstraintsNames { get; set; } = Array.Empty<string>();

    public string[] Constraints { get; set; } = Array.Empty<string>();

    public int[] Percentages { get; set; } = Array.Empty<int>();

    public CompilerChoice Compiler { get; set; }

    public int NumberOfDeals { get; set; }

    public VulChoice Vul { get; set; }

    public DealerChoice Dealer { get; set; }

    public FlipChoice Flip { get; set; }

    public ScoringChoice Scoring { get; set; }
}
