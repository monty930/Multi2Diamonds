using BridgeScenarios.Database;
using BridgeScenarios.Models.DbModels;

namespace BridgeScenarios.Repositories;

public class UserRepository
{
    private readonly MyDbContext _context = new();
    
    public User? GetByUsernameAndPassword(string username, string password)
    {
        return _context.Users.FirstOrDefault(u => u.Username==username & u.Password==password);
    }

    public string? GetPassword(string username)
    {
        return _context.Users.Where(u => u.Username == username).Select(u => u.Password).FirstOrDefault();
    }
}