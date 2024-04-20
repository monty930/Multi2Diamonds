
using Multi2Diamonds.Database;
using Multi2Diamonds.Models;
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

    public void AddDummyData() // to be deleted
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == "admin");
        if (user == null) return;
        var constraints = new List<Scenario>
        {
            new() {Name = "constr1", User = user, ScenarioContent = "content1"},
            new() {Name = "constr2", User = user, ScenarioContent = "content2"},
            new() {Name = "constr3", User = user, ScenarioContent = "content3"},
        };
        var dealsets = new List<DealSet>
        {
            new() {Name = "dealset1", User = user, Deals = new List<Deal>()},
            new() {Name = "dealset2", User = user, Deals = new List<Deal>()},
            new() {Name = "dealset3", User = user, Deals = new List<Deal>()},
        };
        user.Scenarios = constraints;
        user.DealSets = dealsets;
        _context.SaveChanges();
    }

    public void RemoveSavedContent(string username, int contentId, SavedContentType contentType)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return;
        
        if (contentType == SavedContentType.Constraint)
        {
            var savedScenario = _context.Scenarios.FirstOrDefault(s => s.ScenarioId == contentId);
            if (savedScenario == null) return;
            _context.Scenarios.Remove(savedScenario);
        }
        else if (contentType == SavedContentType.DealSet)
        {
            var savedDealSet = _context.DealSets.FirstOrDefault(d => d.DealSetId == contentId);
            if (savedDealSet == null) return;
            _context.DealSets.Remove(savedDealSet);
        }
        else
        {
            return;
        }
        _context.SaveChanges();
    }

    public List<SavedContent>? GetSavedContents(string username)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return null;
        
        var scenarios =  _context.Scenarios.Where(s => s.UserId == user.UserId).ToList();
        var dealsets = _context.DealSets.Where(d => d.UserId == user.UserId).ToList();
        var savedContents = new List<SavedContent>();
        foreach (var scenario in scenarios)
        {
            savedContents.Add(new SavedContent
            {
                SavedContentId = scenario.ScenarioId,
                SavedContentType = SavedContentType.Constraint,
                Name = scenario.Name
            });
        }
        foreach (var dealset in dealsets)
        {
            savedContents.Add(new SavedContent
            {
                SavedContentId = dealset.DealSetId,
                SavedContentType = SavedContentType.DealSet,
                Name = dealset.Name
            });
        }
        return savedContents;
    }
    
    public List<String>? GetConstraintsNames(string username)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return null;
        // create list of constraints' names
        var constraints = _context.Scenarios.Where(s => s.UserId == user.UserId).ToList();
        var list = new List<String>();
        foreach (var constraint in constraints)
        {
            list.Add(constraint.Name);
        }
        return list;
    }
}