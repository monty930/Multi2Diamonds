using BridgeScenarios.DealSetTools;
using BridgeScenarios.DealSetTools.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BridgeScenarios.Models.ViewModels;

public class IndexViewModel : PageModel
{
    public string ScriptOutputRaw { get; set; } = string.Empty;

    public CompilerRunner CompilerRunner { get; set; } = new(new SettingsArgs());

    // Indicated what should be displayed in the right view.
    // May be: Example, Error, DealSet or Entry.
    public RightViewDisplay RightDisplay { get; set; } = RightViewDisplay.Entry;
}