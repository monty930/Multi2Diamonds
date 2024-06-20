using Microsoft.AspNetCore.Mvc.RazorPages;
using Multi2Diamonds.Models.DbModels;

namespace Multi2Diamonds.Scenarios.Models;

public class ScenariosModel : PageModel
{
    public string ScriptOutputRaw { get; set; } = string.Empty;

    public CompilerRunner CompilerRunner { get; set; } = new(new SettingsArgs());
    
    public DealSet DealSet { get; set; } = new();
    
    public bool IsCorrectDeal { get; set; }
}