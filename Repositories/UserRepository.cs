using BridgeScenarios.Database;
using BridgeScenarios.Models.DbModels;

namespace BridgeScenarios.Repositories;

public class UserRepository
{
    private readonly MyDbContext _context = new();

    public bool AddUser(User user)
    {
        _context.Users.Add(user);
        return _context.SaveChanges() == 1;
    }
    
    public string? GetPassword(string username)
    {
        return _context.Users.Where(u => u.Username == username).Select(u => u.Password).FirstOrDefault();
    }

    public bool IsEmailRegistered(string email)
    {
        return _context.Users.Any(u => u.Email == email);
    }

    public bool IsUsernameRegistered(string username)
    {
        return _context.Users.Any(u => u.Username == username);
    }
}