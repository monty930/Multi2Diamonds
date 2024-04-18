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
        var username = "admin"; // should be: User.Identity.Name;
        var savedContents = _userRepository.GetSavedContents(username);
        if (savedContents == null) return NotFound();
        return Json(new { savedContents });
    }
    
    [HttpPost]
    [Route("ProfileData/DeleteSavedContent")]
    public ActionResult DeleteSavedContent([FromBody] SavedContent content)
    {
        var username = "admin"; // should be: User.Identity.Name;
        var savedContents = _userRepository.RemoveSavedContent(username, content.SavedContentId, content.SavedContentType);
        if (savedContents == null) return NotFound();
        return Ok(savedContents);
    }
}