using BridgeScenarios.Database;
using BridgeScenarios.Models.DbModels;

namespace BridgeScenarios.Repositories;

public class UserRepository
{
    private readonly MyDbContext _context = new();
    
    public User? GetByUsernameAndPassword(string username, byte[] password)
    {
        return _context.Users.FirstOrDefault(u => u.Username==username & u.Password==password);
    }
}