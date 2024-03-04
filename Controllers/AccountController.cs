using System.Security.Claims;
using System.Text;
using BridgeScenarios.Models.DbModels;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BridgeScenarios.Controllers;

public class AccountController : Controller
{
    private readonly UserRepository _userRepository = new();
    private readonly PasswordHasher<User> _hasher = new ();

    public async Task<IActionResult> Login()
    {
        return View();
    }
    
    [HttpPost]
    public async Task<ActionResult> Login(User user)
    {
        string? storedPassword = _userRepository.GetPassword(user.Username);
        if (storedPassword is null) 
            return View();
        
        var result = _hasher.VerifyHashedPassword(user, storedPassword, user.Password);
        if (result == PasswordVerificationResult.Failed)
            return View();
        
        var claims = new List<Claim>
        {
            new (ClaimTypes.Name, user.Username),
        };

        var claimsIdentity = new ClaimsIdentity(
            claims, CookieAuthenticationDefaults.AuthenticationScheme);

        var authProperties = new AuthenticationProperties
        {
            AllowRefresh = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
            IsPersistent = true,
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            authProperties
        );
        
        return RedirectToAction("Index", "Index", new { area = "" });
    }

    // public ActionResult Logout()
    // {
    //     FormsAuthentication.SignOut();
    //     return RedirectToAction("Index", "Home");
    // }
}