using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System.Diagnostics;

namespace BridgeScenarios.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    // Properties to store the inputs from the textboxes
    [BindProperty]
    public string TextBox1 { get; set; }
    [BindProperty]
    public string TextBox2 { get; set; }
    [BindProperty]
    public string TextBox3 { get; set; }
    [BindProperty]
    public string TextBox4 { get; set; }

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {

    }

    public string Message { get; set; }

    public async Task<IActionResult> OnPostAsync()
    {
        // Generate the content for the temporary file based on the textbox inputs
        //var fileContent = $"1: {TextBox1}\n2: {TextBox2}\n3: {TextBox3}\n4: {TextBox4}";
        // var fileContent = $"def accept(deal):\n\tif len(deal.north.spades) >= 5 and deal.north.hcp >= 12:\n\t\treturn True";
        var fileContent =
            "from redeal import *\n\n" +
            "def accept(deal):\n" +
            $"\treturn deal.north.hcp >= {TextBox1} and deal.north.hcp <= {TextBox2} " +
            $"and len(deal.north.spades) >= {TextBox3} and len(deal.north.spades) <= {TextBox4}\n";

        // Create a temporary file path with .py extension
        var tempFileDirectory = Path.GetTempPath();
        var tempFileName = Path.GetRandomFileName().Replace(".tmp", ".py"); // Ensure the file has a .py extension
        var filePath = Path.Combine(tempFileDirectory, tempFileName);

        await System.IO.File.WriteAllTextAsync(filePath, fileContent);

        var output = RunPythonScript(filePath);
        // Optionally, delete the temp file after use
        System.IO.File.Delete(filePath);

        ViewData["PythonOutput"] = output;

        Message = output; // Assuming output is the variable holding the script's result

        return Page(); // Ensures textboxes remain filled out
    }

    public static string RunPythonScript(string configFilePath)
    {
        // The path to the python executable
        var pythonExecutable = "python";
        
        // The command to execute, including any necessary command line arguments
        var scriptCommand = $"-mredeal {configFilePath}";

        // Set up the process start information
        var processStartInfo = new ProcessStartInfo(pythonExecutable, scriptCommand)
        {
            RedirectStandardOutput = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        };

        // Execute the process
        using (var process = Process.Start(processStartInfo))
        {
            // Read the output of the Python script
            var result = process.StandardOutput.ReadToEnd();
            
            // Wait for the process to exit
            process.WaitForExit();
            
            return result;
        }
    }
}
