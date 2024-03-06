using BridgeScenarios.Models.DbModels;
using BridgeScenarios.Redeal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BridgeScenarios.Models.ViewModels;

public class IndexViewModel : PageModel
{
    [BindProperty] public string TextInput { get; set; } = string.Empty;
    
    public string ScriptOutputRaw { get; set; } = string.Empty;
    
    public CompilerSettings Compiler { get; set; } = new ChaiCompilerSettings(0);
    
    // Indicated what should be displayed in the right view.
    // May be: Example, Error, DealSet or Entry.
    public RightViewDisplay RightDisplay { get; set; } = RightViewDisplay.Entry;
}