using BridgeScenarios.Database;
using BridgeScenarios.Models.DbModels;

namespace BridgeScenarios.Repositories;

public class UserRepository : Repository
{
    public bool AddUser(User user)
    {
        DbContext.Users.Add(user);
        return DbContext.SaveChanges() == 1;
    }
    
    public string? GetPassword(string username)
    {
        return DbContext.Users.Where(u => u.Username == username).Select(u => u.Password).FirstOrDefault();
    }

    public bool IsEmailRegistered(string email)
    {
        return DbContext.Users.Any(u => u.Email == email);
    }

    public bool IsUsernameRegistered(string username)
    {
        return DbContext.Users.Any(u => u.Username == username);
    }
}