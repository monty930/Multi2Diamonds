using System.Text;
using BridgeScenarios.Database;
using BridgeScenarios.Models.DbModels;
using BridgeScenarios.Repositories;
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

    public static void DbTest()
    {
        var userRepo = new UserRepository();
        var dealsetRepo = new DealSetRepository();
        var dealRepo = new DealRepository();

        var user = new User
        {
            Username = "test",
            Password = "test123"
        }; 
        userRepo.AddUser(user);
        
        var dealSet1 = new DealSet
        {
            Name = "DealSet1",
            UserId = user.UserId,
            Deals =
            {
                Deal.FromString("N:AKQJT9876..AKQ.A 5432.AKQJT9876.J. .5432.T98765432. ..T98765432.5432"),
                Deal.FromString("N:KQJT98765..AKQ.A A432.AKQJT9876.J. .5432.T98765432. ..T98765432.5432")
            }
        };
        dealsetRepo.AddDealSet(dealSet1);

        var deal = Deal.FromString("N:QJT987654..AKQ.A AK32.AKQJT9876.J. .5432.T98765432. ..T98765432.5432");
        deal.DealSetId = dealSet1.DealSetId;
        dealRepo.AddDeal(deal);
    }

    public static void ClearTestRecords()
    {
        var userRepo = new UserRepository();

        var testuser = userRepo.GetByName("test");
        if (testuser is null)
            return;
        
        userRepo.RemoveUser(testuser);
    }
}