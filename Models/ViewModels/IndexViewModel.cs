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

    // This property is used to display the correct deal from the deal set.
    // If DealNumber is n, the n-th deal from the deal set is displayed.
    // If DealNumber is 0, the SetDealEntry is displayed.
    public int DealNumber { get; set; } // Default: 0.
}