using BridgeScenarios.Models;
using BridgeScenarios.Models.DbModels;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BridgeScenarios.Controllers;

[Authorize]
public class ProfileController : Controller
{
    private readonly UserRepository _userRepository = new();
    
    public async Task<IActionResult> SavedContent()
    {
        var user = _userRepository.GetByName(User.Identity.Name);
        if (user == null)
        {
            return NotFound();
        }
        
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
        if (user == null)
        {
            return NotFound();
        }

        var viewModel = new ProfileViewModel
        {
            Username = user.Username,
            Email = user.Email
        };

        return View(viewModel);
    }
    
    [HttpPost]
    public async Task<JsonResult> AddDealSet([FromBody]UsersSavedContent input)
    {
        var user = _userRepository.GetByName(User.Identity.Name);
        if (user == null)
        {
            return Json(new { success = false, message = "User not found" });
        }
    
        var newSavedContent = new UsersSavedContent
        {
            UserId = user.UserId,
            User = user,
            SavedContentType = SavedContentType.DealSet,
            Name = input.Name,
            Content = input.Content
        };
    
        _userRepository.AddSavedContent(newSavedContent);
        
        return Json(new { success = true, message = "Deal set added successfully" });
    }
    
    [HttpPost]
    public async Task<JsonResult> AddConstraint([FromBody]UsersSavedContent input)
    {
        var user = _userRepository.GetByName(User.Identity.Name);
        if (user == null)
        {
            return Json(new { success = false, message = "User not found" });
        }
    
        var newSavedContent = new UsersSavedContent
        {
            UserId = user.UserId,
            User = user,
            SavedContentType = SavedContentType.Constraint,
            Name = input.Name,
            Content = input.Content
        };
    
        _userRepository.AddSavedContent(newSavedContent);
        
        return Json(new { success = true, message = "Constraint added successfully" });
    }
    
    [HttpPost]
    public async Task<IActionResult> DeleteSavedContent(int savedContentId)
    {
        var user = _userRepository.GetByName(User.Identity.Name);
        if (user == null)
        {
            return NotFound();
        }
    
        var savedContent = 
            _userRepository.GetSavedContents(user).FirstOrDefault
                (c => c.SavedContentId == savedContentId);
        if (savedContent == null)
        {
            return NotFound();
        }
    
        _userRepository.RemoveSavedContent(savedContent);
    
        return RedirectToAction("SavedContent");
    }
}
