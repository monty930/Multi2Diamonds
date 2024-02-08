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

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {

    }

    public string Message { get; set; }

    public async Task<IActionResult> OnPostAsync(IFormFile configFile)
    {
        if (configFile != null)
        {
            var filePath = Path.GetTempFileName();

            using (var stream = System.IO.File.Create(filePath))
            {
                await configFile.CopyToAsync(stream);
            }

            var output = RunPythonScript(filePath);
            // Optionally, delete the temp file after use
            System.IO.File.Delete(filePath);

            ViewData["PythonOutput"] = output;

            Message = output; // Assuming output is the variable holding the script's result
            //Console.WriteLine(Message); // Temporary log to verify output

        }

        return Page();
    }

    public static string RunPythonScript(string configFilePath)
    {
        // The path to the python executable
        var pythonExecutable = "python";
        
        // The command to execute, including any necessary command line arguments
        var scriptCommand = $"-mredeal \"{configFilePath}\"";

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

