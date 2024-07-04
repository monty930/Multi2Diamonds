using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Multi2Diamonds.Managers;
using Multi2Diamonds.Models.DbModels;
using Multi2Diamonds.Polls.Models;
using Multi2Diamonds.Repositories;
using Multi2Diamonds.Scenarios.Models;

namespace Multi2Diamonds.Controllers;

// [Authorize]
public partial class PollsController : Controller
{
    private readonly PollsManager _pollsManager = new();
    private readonly UserRepository _userRepository = new();
    private readonly ConstraintsRepository _constraintsRepository = new();

    [EnableCors]
    [HttpPost]
    [Route("Polls/GeneratePolls")]
    public async Task<IActionResult> GenerateDeals([FromBody] PollsSettingsArgs pollsSettings)
    {
        var constraints = new[] { pollsSettings.Constraint };
        var settings = new SettingsArgs
        {
            ConstraintsNames = constraints,
            Constraints = _constraintsRepository.GetConstraints(constraints, "admin") // should be: User.Identity.Name;
        };

        var polls = await _pollsManager.GeneratePolls(pollsSettings, settings);

        if (!polls.IsCorrectDeal)
        {
            return Json(new { Error = polls.PollSet.OutputRaw });
        }
        _userRepository.AddPollSet("admin", polls.PollSet); // should be: User.Identity.Name;

        return Json(_pollsManager.SerializePolls(polls.PollSet));
    }

    [EnableCors]
    [HttpPost]
    [Route("Polls/FetchPollSet")]
    public async Task<IActionResult> FetchPollSet([FromBody] PollSet pollSet)
    {
        var pollset = _userRepository.GetPollSet("admin", pollSet.PollSetId); // should be: User.Identity.Name;
        return Json(_pollsManager.SerializePolls(pollset));
    }
}
