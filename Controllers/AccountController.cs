using System.Security.Claims;
using System.Text;
using BridgeScenarios.Models.DbModels;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace BridgeScenarios.Controllers;

public class AccountController : Controller
{
    private readonly UserRepository _userRepository = new();

    public async Task<IActionResult> Login()
    {
        return View();
    }
    
    [HttpPost]
    public async Task<ActionResult> Login(LoginData loginData)
    {
        Console.WriteLine(loginData.Username + "   " + string.Join("", loginData.Password));
        var authenticatedUser = _userRepository.GetByUsernameAndPassword(loginData.Username, Encoding.UTF8.GetBytes(loginData.Password));
        if (authenticatedUser == null)
        {
            return View();
        }

        var claims = new List<Claim>
        {
            new (ClaimTypes.Name, loginData.Username),
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
            
        Console.WriteLine("ok");
        return RedirectToAction("Index", "Index", new { area = "" });
    }

    // public ActionResult Logout()
    // {
    //     FormsAuthentication.SignOut();
    //     return RedirectToAction("Index", "Home");
    // }
}