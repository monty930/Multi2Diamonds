using Multi2Diamonds.Database;
using Multi2Diamonds.Models.DbModels;

namespace Multi2Diamonds.Repositories;

public class UserRepository
{
    private readonly MyDbContext _context = new();

    public int AddUser(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
        return user.UserId;
    }

    public void RemoveUser(User user)
    {
        _context.Users.Remove(user);
        _context.SaveChanges();
    }

    public User? GetUserByUsername(string name)
    {
        return _context.Users.FirstOrDefault(u => u.Username == name);
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
    
    public void RemoveSavedScenarioOfUsername(string username, int scenarioId)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return;
        
        var savedScenario = _context.Scenarios.FirstOrDefault(s => s.ScenarioId == scenarioId);
        if (savedScenario == null) return;
        _context.Scenarios.Remove(savedScenario);
        _context.SaveChanges();
    }

    public (List<Scenario>, List<DealSet>)? GetSavedContents(string username)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return null;
        
        var scenarios =  _context.Scenarios.Where(s => s.UserId == user.UserId).ToList();
        var dealsets = _context.DealSets.Where(d => d.UserId == user.UserId).ToList();
        return (scenarios, dealsets);
    }
}