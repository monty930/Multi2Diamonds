using Microsoft.AspNetCore.Mvc.RazorPages;
using Multi2Diamonds.Models.Bridge;
using Multi2Diamonds.Models.DbModels;
using Multi2Diamonds.Scenarios.Models.CompilerSettings;

namespace Multi2Diamonds.Polls.Models;

public class PollsModel : PageModel
{
    public PollSet PollSet { get; set; } = null!;

    public bool IsCorrectDeal { get; set; }
}
