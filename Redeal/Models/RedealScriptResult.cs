using BridgeScenarios.Models;

namespace BridgeScenarios.Redeal.Models;

public class RedealScriptResult
{
    public string Tries { get; set; } = string.Empty;
    public Deal Deal { get; set; } = new();
}