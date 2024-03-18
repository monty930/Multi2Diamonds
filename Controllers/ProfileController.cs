using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BridgeScenarios.Controllers;

[Authorize]
public class ProfileController : Controller
{
    private readonly UserRepository _userRepository = new();

    public async Task<IActionResult> SavedContent()
    {
        var user = _userRepository.GetByName(User.Identity.Name);
        if (user == null) return NotFound();

        var savedContents = _userRepository.GetSavedContents(user);

        var viewModel = new SavedContentViewModel
        {
            SavedContents = savedContents
        };

        return View(viewModel);
    }


    public async Task<IActionResult> Profile()
    {
        var user = _userRepository.GetByName(User.Identity.Name);
        if (user == null) return NotFound();

        var viewModel = new ProfileViewModel
        {
            Username = user.Username,
            Email = user.Email
        };

        return View(viewModel);
    }
    
    [HttpPost]
    public async Task<IActionResult> DeleteSavedContent(int savedContentId)
    {
        var user = _userRepository.GetByName(User.Identity.Name);
        if (user == null) return NotFound();

        var savedContent =
            _userRepository.GetSavedContents(user).FirstOrDefault
                (c => c.SavedContentId == savedContentId);
        if (savedContent == null) return NotFound();

        _userRepository.RemoveSavedContent(savedContent);

        return RedirectToAction("SavedContent");
    }
}