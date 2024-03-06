using BridgeScenarios.Models;

namespace BridgeScenarios.Redeal.Models;

public class SettingsArgs
{
    public string InputText { get; set; } = "";
    
    public CompilerChoice Compiler { get; set; }
    
    public int NumberOfDeals { get; set; }
    
    public VulChoice Vul { get; set; }
    
    public DealerChoice Dealer { get; set; }
    
    public FlipChoice Flip { get; set; }
}