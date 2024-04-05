using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Multi2Diamonds.Scenarios.Models;

public class ScenariosModel : PageModel
{
    public string ScriptOutputRaw { get; set; } = string.Empty;

    public CompilerRunner CompilerRunner { get; set; } = new(new SettingsArgs());

    // Indicated what should be displayed in the right view.
    // May be: Example, Error, DealSet or Entry.
    public RightViewDisplay RightDisplay { get; set; } = RightViewDisplay.Entry;
}