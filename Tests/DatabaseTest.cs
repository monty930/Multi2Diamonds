using System.Text;
using BridgeScenarios.Database;
using BridgeScenarios.Models.DbModels;
using Microsoft.AspNetCore.Identity;

namespace BridgeScenarios.Tests;

public class DatabaseTest
{
    public static void Run()
    {
        var context = new MyDbContext();
        context.Database.EnsureCreated();

        if (context.Users.Any()) return;

        var hasher = new PasswordHasher<User>();
        var user = new User
        {
            Username = "admin",
            Password = "admin123xd"
        };
        user.Password = hasher.HashPassword(user, user.Password);

        context.Users.Add(user);
        context.SaveChanges();
    }

    public static void Get()
    {
        var context = new MyDbContext();

        var user = context.Users.FirstOrDefault();
        Console.WriteLine(user?.Username + "  " + user?.Password);
    }
}