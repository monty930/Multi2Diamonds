using Multi2Diamonds.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Multi2Diamonds.Models;

namespace Multi2Diamonds.Controllers;

[Authorize]
public class ProfileDataController : Controller
{
    private readonly UserRepository _userRepository = new();

    [HttpGet]
    [Route("ProfileData/GetProfile")]
    public ActionResult GetProfile()
    {
        var user = _userRepository.GetUserByUsername(User.Identity.Name);
        if (user == null) return NotFound();
        return Json(new { user.Username, user.Email, user.CreationDate, user.ProfilePicturePath });
    }

    [HttpPost]
    [Route("ProfileData/ChangeEmail")]
    public ActionResult ChangeEmail([FromBody] ProfileModel model)
    {
        _userRepository.UpdateUsersEmail(User.Identity.Name, model.Email);
        return Ok();
    }

    [HttpPost]
    [Route("ProfileData/UploadProfilePicture")]
    public async Task<IActionResult> UploadProfilePicture(IFormFile? file)
    {
        var user = _userRepository.GetUserByUsername(User.Identity.Name);
        if (user == null) return NotFound();

        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "frontend", "public", "uploads");
        if (!Directory.Exists(uploadsFolderPath))
            Directory.CreateDirectory(uploadsFolderPath);

        var uniqueFileName = $"{user.UserId}" + Path.GetExtension(file.FileName);

        var files = Directory.GetFiles(uploadsFolderPath, $"{user.UserId}.*");
        foreach (var f in files)
        {
            if (f != Path.Combine(uploadsFolderPath, uniqueFileName))
            {
                System.IO.File.Delete(f);
            }
        }

        var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

        await using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        var relativeFilePath = $"/uploads/{uniqueFileName}";
        _userRepository.UpdateAvatar(user, relativeFilePath);

        return Ok(new { filePath = relativeFilePath });
    }

    [HttpGet]
    [Route("ProfileData/CheckAdmin")]
    public ActionResult CheckAdmin()
    {
        var user = _userRepository.GetUserByUsername("admin"); // should be User.Identity.Name
        if (user == null) return NotFound();
        if (user.IsAdmin) return Ok();
        return Unauthorized();
    }
}
