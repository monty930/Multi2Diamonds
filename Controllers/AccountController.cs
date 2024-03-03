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
    public ActionResult Login(LoginData loginData)
    {
        Console.WriteLine(loginData.Username + "   " + string.Join("", loginData.Password));
        var authenticatedUser = _userRepository.GetByUsernameAndPassword(loginData.Username, Encoding.UTF8.GetBytes(loginData.Password));
        if (authenticatedUser != null)
        {
            var claims = new[] { new Claim(ClaimTypes.Name, loginData.Username),
                new Claim(ClaimTypes.Role, "SomeRoleName") };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme, 
                new ClaimsPrincipal(identity));
            
            Console.WriteLine("ok");
            return RedirectToAction("Index", "Index");
        }

        ModelState.AddModelError("","Login failed. Please check Username and/or password");
        return View();
    }

    // public ActionResult Logout()
    // {
    //     FormsAuthentication.SignOut();
    //     return RedirectToAction("Index", "Home");
    // }
}