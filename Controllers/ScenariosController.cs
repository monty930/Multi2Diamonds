using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Multi2Diamonds.Managers;
using Multi2Diamonds.Models;
using Multi2Diamonds.Repositories;
using Multi2Diamonds.Scenarios;
using Multi2Diamonds.Scenarios.Models;

namespace Multi2Diamonds.Controllers;

[Authorize]
public partial class ScenariosController : Controller
{
    private readonly ScenariosManager _scenariosManager = new();
    private readonly UserRepository _userRepository = new();
    private readonly DealSetRepository _dealSetRepository = new();
    private readonly ConstraintsRepository _constraintsRepository = new();

    [EnableCors]
    [HttpPost]
    [Route("Scenarios/GenerateDeals")]
    public async Task<IActionResult> GenerateDeals([FromBody] SettingsArgs compilerSettings)
    {
        if (compilerSettings.Constraints.Length == 0)
            compilerSettings.Constraints = _constraintsRepository.GetConstraints(compilerSettings.ConstraintsNames, "admin"); // should be: User.Identity.Name;

        int sum = 0; // TODO These lines will be moved to frontend side
        for (int i = 0; i < compilerSettings.Constraints.Length; i++)
        {
            if (i != compilerSettings.Constraints.Length - 1)
                sum += compilerSettings.Percentages[i];
            else
                compilerSettings.Percentages[i] = 100 - sum;
        }

        var model = await _scenariosManager.GenerateDeals(new ScenariosModel
            { CompilerRunner = new CompilerRunner(compilerSettings) });
        return Json(model);
    }

    [HttpGet]
    [Route("Scenarios/GetDealSetDetails")]
    public async Task<IActionResult> GetDealSetDetails([FromQuery] string dealSetId)
    {
        var id = int.Parse(dealSetId);
        var dealSet = _dealSetRepository.GetDealSetDetails(id);
        if (dealSet == null) return NotFound();
        return Ok(new { dealSet });
    }

    [HttpPost]
    [Route("Scenarios/GetSavedContent")]
    public ActionResult GetSavedContent()
    {
        var savedContents = _userRepository.GetSavedContents(User.Identity.Name);
        if (savedContents == null) return NotFound();
        return Json(new { savedContents });
    }

    [HttpPost]
    [Route("Scenarios/DeleteSavedContent")]
    public ActionResult DeleteSavedContent([FromBody] SavedContent content)
    {
        _userRepository.RemoveSavedContent("admin", content.SavedContentId, content.SavedContentType); // should be: User.Identity.Name;
        return Ok();
    }

    [HttpGet]
    [Route("Scenarios/GetConstraints")]
    public ActionResult GetConstraints()
    {
        var constraints = _userRepository.GetConstraintsNames(User.Identity.Name);
        if (constraints == null) return NotFound();
        return Json(new { constraints });
    }

    [HttpPost]
    [Route("Scenarios/SaveScenario")]
    public ActionResult SaveScenario([FromBody] ScenarioToSave scenario)
    {
        Console.WriteLine("SaveScenario");
        var resultName = _userRepository.SaveScenario(User.Identity.Name, scenario);
        if (resultName == null) return BadRequest();
        return Json(new { scenarioName = resultName });
    }

    [HttpPost]
    [Route("Scenarios/OverwriteScenario")]
    public ActionResult OverwriteScenario([FromBody] ScenarioToSave scenario)
    {
        var res = _userRepository.OverwriteScenario(User.Identity.Name, scenario);
        return res;
    }

    [HttpPost]
    [Route("Scenarios/GetSavedScenario")]
    public ActionResult GetSavedScenario([FromBody] SavedContent content)
    {
        var scenario = _userRepository.GetSavedScenario(User.Identity.Name, content.SavedContentId);
        if (scenario == null) return NotFound();
        return Json(new { scenarioName = scenario.Name, scenarioContent = scenario.ScenarioContent });
    }
}
