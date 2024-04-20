using Multi2Diamonds.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Multi2Diamonds.Models;
using Multi2Diamonds.Models.DbModels;

namespace Multi2Diamonds.Controllers;

// [Authorize]
public class ProfileDataController : Controller
{
    private readonly UserRepository _userRepository = new();
    
    [HttpGet]
    [Route("ProfileData/GetProfile")]
    public ActionResult GetProfile()
    {
        var user = _userRepository.GetUserByUsername("admin"); // should be: User.Identity.Name;
        if (user == null) return NotFound();
        return Ok(new
        {
            Username = user.Username,
            DealSetsCount = 0,
            ScenariosCount = 0
        });
    }
    
    [HttpPost]
    [Route("ProfileData/GetSavedContent")]
    public ActionResult GetSavedContent()
    {
        var savedContents = _userRepository.GetSavedContents("admin"); // should be: User.Identity.Name;
        if (savedContents == null) return NotFound();
        return Json(new { savedContents });
    }
    
    [HttpPost]
    [Route("ProfileData/DeleteSavedContent")]
    public ActionResult DeleteSavedContent([FromBody] SavedContent content)
    {
        _userRepository.RemoveSavedContent("admin", content.SavedContentId, content.SavedContentType); // should be: User.Identity.Name;
        return Ok();
    }
    
    [HttpGet]
    [Route("ProfileData/GetConstraints")]
    public ActionResult GetConstraints()
    {
        var constraints = _userRepository.GetConstraintsNames("admin"); // should be: User.Identity.Name;
        if (constraints == null) return NotFound();
        return Json(new { constraints });
    }
    
    [HttpPost]
    [Route("ProfileData/SaveScenario")]
    public ActionResult SaveScenario([FromBody] ScenarioToSave scenario)
    {
        var resultName = _userRepository.SaveScenario("admin", scenario); // should be: User.Identity.Name;
        if (resultName == null) return BadRequest();
        return Json(new { scenarioName = resultName });
    }

    [HttpPost]
    [Route("ProfileData/OverwriteScenario")]
    public ActionResult OverwriteScenario([FromBody] ScenarioToSave scenario)
    {
        var res = _userRepository.OverwriteScenario("admin", scenario); // should be: User.Identity.Name;
        return res;
    }
    
    [HttpPost]
    [Route("ProfileData/GetSavedScenario")]
    public ActionResult GetSavedScenario([FromBody] SavedContent content)
    {
        var scenario = _userRepository.GetSavedScenario("admin", content.SavedContentId); // should be: User.Identity.Name;
        if (scenario == null) return NotFound();
        return Json(new { scenarioName = scenario.Name, scenarioContent = scenario.ScenarioContent });
    }
}