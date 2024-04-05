using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Multi2Diamonds.Scenarios.Models;

public class ScenariosModel : PageModel
{
    public string ScriptOutputRaw { get; set; } = string.Empty;

    public CompilerRunner CompilerRunner { get; set; } = new(new SettingsArgs());
    
    public bool IsCorrectDeal { get; set; }
}