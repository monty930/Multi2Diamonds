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
        return Json(new { user.Username, user.Email, user.CreationDate });
    }
}
