using System.Text;
using BridgeScenarios.Database;
using BridgeScenarios.Models.DbModels;

namespace BridgeScenarios.Tests;

public class DatabaseTest
{
    public static void Run()
    {
        var context = new MyDbContext();
        context.Database.EnsureCreated();

        if (context.Users.Any()) return;
        
        context.Users.Add(new User
        {
            Username = "admin",
            Password = "admin123xd"u8.ToArray()
        });
        context.SaveChanges();
    }

    public static void Get()
    {
        var context = new MyDbContext();

        var user = context.Users.FirstOrDefault();
        Console.WriteLine(user?.Username + "  " + Encoding.UTF8.GetString(user?.Password ?? throw new InvalidOperationException()));
    }
}