using Multi2Diamonds.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Multi2Diamonds.Models;

namespace Multi2Diamonds.Controllers;

// [Authorize]
public class ProfileDataController : Controller
{
    private readonly UserRepository _userRepository = new();
    
    // [Authorize]
    [HttpGet]
    [Route("ProfileData/GetProfile")]
    public ActionResult GetProfile()
    {
        Console.WriteLine("Profile1<---------------");
        var user = _userRepository.GetUserByUsername(User.Identity.Name);
        var username = User.Identity.Name;
        Console.WriteLine("Profile2<--- username: " + username);
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
        Console.WriteLine("GetSavedContent1<---------------");
        var savedContents = _userRepository.GetSavedContents(User.Identity.Name);
        if (savedContents == null) return NotFound();
        return Ok(savedContents);
    }
    
    [HttpGet]
    [Route("ProfileData/DeleteSavedScenario")]
    public ActionResult DeleteSavedConstraint(int savedConstraintId)
    {
        _userRepository.RemoveSavedScenarioOfUsername(User.Identity.Name, savedConstraintId);
        return Ok();
    }
    
    [HttpGet]
    [Route("ProfileData/DeleteSavedDealSet")]
    public ActionResult DeleteSavedDealSet(int savedDealSetId)
    {
        _userRepository.RemoveSavedScenarioOfUsername(User.Identity.Name, savedDealSetId);
        return Ok();
    }
}