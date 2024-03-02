using BridgeScenarios.Redeal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BridgeScenarios.Models.ViewModels;

public class IndexViewModel : PageModel
{
    [BindProperty] public string TextInput { get; set; } = string.Empty;
    public string ScriptOutput { get; set; } = string.Empty;
    public Deal Deal { get; set; } = new();
    public string Tries { get; set; } = string.Empty;
    public MemoryStream? OutputStream { get; set; }
    public CompilerSettings Compiler { get; set; } = new ChaiCompilerSettings(0);

    // Indicated what should be displayed in the right view.
    // May be: Example, Error, DealSet or Entry.
    public RightViewDisplay RightDisplay { get; set; } = RightViewDisplay.Entry;
    
    public ScriptOutputInfo ScriptOutputInfo { get; set; } = new("", 1, 1);
}