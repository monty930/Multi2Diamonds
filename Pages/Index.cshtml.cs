using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace BridgeScenarios.Pages;

public class IndexModel : PageModel
{
    [BindProperty]
    public string TextInput { get; set; } // The property to bind the input text from the textbox

    public string ScriptOutput { get; set; } // Property to hold the script's output

    public async Task<IActionResult> OnPostAsync()
    {
        if (!string.IsNullOrWhiteSpace(TextInput))
        {
            // Create a temporary file and write the input text into it
            var tempFilePath = Path.GetTempFileName();
            await System.IO.File.WriteAllTextAsync(tempFilePath, TextInput);

            // Run the script with the temporary file as an argument
            ScriptOutput = RunScript(tempFilePath);

            // Clean up the temporary file
            System.IO.File.Delete(tempFilePath);
        }

        return Page(); // Return to the same page to display the output
    }

    private string RunScript(string filePath)
    {
        // Assuming your script is located in the "backend" folder and named "gen_scenarios.sh"
        string scriptPath = Path.Combine("backend", "get_scenarios.sh");

        // Execute the script with the temporary file as an argument
        var processStartInfo = new ProcessStartInfo
        {
            FileName = "/bin/bash", // or "cmd.exe" on Windows
            Arguments = $"{scriptPath} {filePath}",
            RedirectStandardOutput = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        };

        using (var process = Process.Start(processStartInfo))
        {
            var result = process.StandardOutput.ReadToEnd();
            process.WaitForExit();
            return result;
        }
    }
}
