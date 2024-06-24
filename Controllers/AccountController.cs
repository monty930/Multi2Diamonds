using System.Security.Claims;
using Multi2Diamonds.Models.DbModels;
using Multi2Diamonds.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Multi2Diamonds.Controllers;

public class AccountController : Controller
{
    private readonly PasswordHasher<User> _hasher = new();
    private readonly UserRepository _userRepository = new();

    [HttpPost]
    [Route("Account/Login")]
    public async Task<ActionResult> Login([FromBody] User user)
    {
        var storedPassword = _userRepository.GetPassword(user.Username);
        if (storedPassword is null)
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var result = _hasher.VerifyHashedPassword(user, storedPassword, user.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Username)
        };

        var claimsIdentity = new ClaimsIdentity(
            claims, CookieAuthenticationDefaults.AuthenticationScheme);

        var authProperties = new AuthenticationProperties
        {
            AllowRefresh = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
            IsPersistent = true
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            authProperties
        );

        HttpContext.Session.SetString("user", user.Username);
        return Ok(new { message = "Login successful!" });
    }

    [HttpPost]
    [Route("Account/Signup")]
    public async Task<ActionResult> Signup([FromBody] User user)
    {
        if (_userRepository.IsUsernameRegistered(user.Username))
        {
            return Conflict(new { message = "Username already exists!" });
        }

        _userRepository.AddUser(user);
        return Ok(new { message = "Signup successful." });
    }

    [HttpPost]
    [Route("Account/Logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        HttpContext.Session.Clear();
        Response.Cookies.Delete(".AspNetCore.Cookies");

        Console.WriteLine("Logged out");
        return Ok(new { message = "Logout successful!" });
    }
    
    [HttpGet]
    [Route("Account/ValidateSession")]
    public ActionResult ValidateSession()
    {
        if (User.Identity.IsAuthenticated)
        {
            Console.WriteLine("(1) Session is valid.");
            return Ok(new { message = "Session is valid." });
        }
        else
        {
            Console.WriteLine("(2) Session is not valid.");
            return Unauthorized(new { message = "Session is not valid." });
        }
    }
}
