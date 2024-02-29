using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using BridgeScenarios.Redeal;

namespace BridgeScenarios.Models.ViewModels;

public class IndexViewModel : PageModel
{
    [BindProperty] public string TextInput { get; set; } = string.Empty;
    public string ScriptOutput { get; set; } = string.Empty;
    public Deal Deal { get; set; } = new();
    public string Tries { get; set; } = string.Empty;
    public bool IsErrorInput { get; set; }
    public bool IsCorrectDeal { get; set; }
    public MemoryStream? OutputStream { get; set; }
    public CompilerSettings Compiler { get; set; } = new ChaiCompiler(0);
}