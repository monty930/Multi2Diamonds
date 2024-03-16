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
    
        Console.WriteLine("HERE" + savedContents.Count);
    
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
            SavedContentType = SavedContentType.DealSet,
            Name = input.Name,
            Content = input.Content
        };
    
        _userRepository.AddSavedContent(input);
        
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
            SavedContentType = SavedContentType.Constraint,
            Name = input.Name,
            Content = input.Content
        };
    
        _userRepository.AddSavedContent(input);
        
        return Json(new { success = true, message = "Constraint added successfully" });
    }
    
    // [HttpPost]
    // public async Task<IActionResult> DeleteDealSet(int dealSetId)
    // {
    //     var dealSet = _context.DealSets.Find(dealSetId);
    //     if (dealSet == null)
    //     {
    //         return NotFound();
    //     }
    //
    //     _context.DealSets.Remove(dealSet);
    //     await _context.SaveChangesAsync();
    //
    //     return RedirectToAction("SavedContent"); // Or return JSON if using AJAX
    // }
}
