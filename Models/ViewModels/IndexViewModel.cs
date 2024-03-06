using BridgeScenarios.Models.DbModels;
using BridgeScenarios.Redeal;
using BridgeScenarios.Redeal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BridgeScenarios.Models.ViewModels;

public class IndexViewModel : PageModel
{
    public string ScriptOutputRaw { get; set; } = string.Empty;
    
    public RedealRunner RedealRunner { get; set; } = new (new SettingsArgs());
    
    // Indicated what should be displayed in the right view.
    // May be: Example, Error, DealSet or Entry.
    public RightViewDisplay RightDisplay { get; set; } = RightViewDisplay.Entry;
}