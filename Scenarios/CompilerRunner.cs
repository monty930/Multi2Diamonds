using System.Diagnostics;
using System.Text.RegularExpressions;
using Multi2Diamonds.Scenarios.Models;

namespace Multi2Diamonds.Scenarios;

public class CompilerRunner
{
    private readonly string _basePath = Path.Combine("BridgeTools");
    private readonly string _defaultScriptName = Path.Combine("get_scenarios.sh");
    private string CompilerPath { get; }
    private SettingsArgs CompilerSettings { get; }

    public CompilerRunner(SettingsArgs args)
    {
        CompilerPath = Path.Combine("./", _basePath, _defaultScriptName);
        CompilerSettings = args;
    }

    // Method chooses the constraints by percentage and runs the compiler for each constraint.
    public async Task<string> RunAll()
    {
        var results = new List<string>();
        var selectionCounts = new Dictionary<string, int>();
        for (int i = 0; i < CompilerSettings.NumberOfDeals; i++)
        {
            string selectedConstraint = ChooseRandomConstraintByPercentage();
            if (!selectionCounts.TryAdd(selectedConstraint, 1))
                selectionCounts[selectedConstraint]++;
        }

        foreach (var selection in selectionCounts)
        {
            var output = await Run(selection.Key, selection.Value);
            results.Add(output);
        }

        return JoinDeals(results);
    }

    // Method used to start the compiler process.
    private readonly ProcessStartInfo _processStartInfo = new()
    {
        FileName = "/bin/bash",
        RedirectStandardOutput = true,
        UseShellExecute = false,
        CreateNoWindow = true
    };

    // Method chooses a random constraint with probability based on the percentage.
    private string ChooseRandomConstraintByPercentage()
    {
        int randomValue = new Random().Next(0, 100);
        int cumulative = 0;

        for (int i = 0; i < CompilerSettings.Percentages.Length; i++)
        {
            cumulative += CompilerSettings.Percentages[i];
            if (randomValue < cumulative)
                return CompilerSettings.Constraints[i];
        }

        throw new Exception("No constraints were selected");
    }

    // Method joins the results of the compiler into a single string.
    private static string JoinDeals(List<string> results)
    {
        if (results == null || results.Count == 0)
        {
            throw new ArgumentException("Input list cannot be null or empty.", nameof(results));
        }

        // Extract the date line from the first string
        string dateLine = Regex.Match(results[0], @"\[Date ""[^""]*""\]").Value;

        // Extract the compiler and other information, except for the number of deals and constraints
        string lastInfo = results[^1];
        string compilerInfo = Regex.Match(lastInfo, @"\[Compiler ""[^""]*""\]").Value;
        string endingInfo = Regex.Match(lastInfo, @"(Vulnerability:.*?Flip:.*?Scoring:.*?Tries:\s*\d+)", RegexOptions.Singleline).Value;

        List<string> boardDetails = new List<string>();
        List<string> allConstraints = new List<string>();

        foreach (string result in results)
        {
            // Extract board details
            MatchCollection boardMatches = Regex.Matches(result, @"\[Board ""\d+""\][\s\S]*?\[Deal ""[^""]*""\]");
            foreach (Match match in boardMatches)
            {
                boardDetails.Add(match.Value);
            }

            // Extract constraints
            string constraints = Regex.Match(result, @"Constraints:.*", RegexOptions.Singleline).Value;
            if (!string.IsNullOrEmpty(constraints))
            {
                allConstraints.Add(constraints);
            }
        }

        // Randomize the order of board details
        Random rng = new Random();
        List<string> randomizedBoards = boardDetails.OrderBy(a => rng.Next()).ToList();

        // Update board numbers sequentially
        List<string> consolidatedBoards = new List<string>();
        int boardNumber = 1;
        foreach (string board in randomizedBoards)
        {
            string newBoardDetail = Regex.Replace(board, @"\[Board ""\d+""\]", $"[Board \"{boardNumber}\"]");
            consolidatedBoards.Add(newBoardDetail);
            boardNumber++;
        }

        // Build the final result string
        string finalResult = $"{dateLine}\n\n{string.Join("\n\n", consolidatedBoards)}\n\n" +
                             $"Number of deals: {boardNumber - 1}\n{compilerInfo}\n{endingInfo}\n" +
                             string.Join("\n", allConstraints);

        return finalResult;
    }

    // Method runs the compiler with the given constraint code and number of deals.
    private async Task<string> Run(string constraintCode, int numOfDeals)
    {
        Console.WriteLine($"Running compiler with constraint code: {constraintCode} and number of deals: {numOfDeals}"
                          + $" for compiler: {CompilerSettings.Compiler} and vul: {CompilerSettings.Vul} and dealer: {CompilerSettings.Dealer}");

        var tempFilePath = Path.GetTempFileName();
        await File.WriteAllTextAsync(tempFilePath, constraintCode);

        _processStartInfo.Arguments =
            $"{CompilerPath} " +
            $"-c {CompilerSettings.Compiler} " +
            $"-f {tempFilePath} " +
            $"-n {numOfDeals} " +
            $"-v {CompilerSettings.Vul} " +
            $"-d {CompilerSettings.Dealer} " +
            $"-i {CompilerSettings.Flip} " +
            $"-s {CompilerSettings.Scoring}";

        using var process = Process.Start(_processStartInfo) ?? throw new NullReferenceException();

        var output = await process.StandardOutput.ReadToEndAsync();
        await process.WaitForExitAsync();

        // check if the process exited with an error
        if (process.ExitCode != 0) throw new CompilerException(output);

        return output;
    }
}
