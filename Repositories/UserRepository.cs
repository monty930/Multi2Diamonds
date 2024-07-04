using Microsoft.AspNetCore.Mvc;
using Multi2Diamonds.Database;
using Multi2Diamonds.Models;
using Multi2Diamonds.Models.DbModels;
using Multi2Diamonds.Polls.Models;

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

    // public void AddDummyData() // to be deleted
    // {
    //     var user = _context.Users.FirstOrDefault(u => u.Username == "admin");
    //     if (user == null) return;
    //     var constraints = new List<Scenario>
    //     {
    //         new() {Name = "constr1", User = user, ScenarioContent = "content1"},
    //         new() {Name = "constr2", User = user, ScenarioContent = "content2"},
    //         new() {Name = "constr3", User = user, ScenarioContent = "content3"},
    //     };
    //     var dealsets = new List<DealSet>
    //     {
    //         new() {Name = "dealset1", User = user, Deals = new List<Deal>()},
    //         new() {Name = "dealset2", User = user, Deals = new List<Deal>()},
    //         new() {Name = "dealset3", User = user, Deals = new List<Deal>()},
    //     };
    //     user.Scenarios = constraints;
    //     user.DealSets = dealsets;
    //     _context.SaveChanges();
    // }

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
        var pollsets = _context.PollSets.Where(p => p.UserId == user.UserId).ToList();
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
        foreach (var pollset in pollsets)
        {
            savedContents.Add(new SavedContent
            {
                SavedContentId = pollset.PollSetId,
                SavedContentType = SavedContentType.PollSet,
                Name = pollset.Name
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
    
    private void PrintDataBaseScenarios()
    {
        var scenarios = _context.Scenarios.ToList();
        foreach (var scenario in scenarios)
        {
            Console.WriteLine("printDataBaseScenarios: " + scenario.Name + " " + scenario.ScenarioId + " " + scenario.ScenarioContent);
        }
    }
    
    private string FindSpareName(string name, User user)
    {
        var scenarios = _context.Scenarios.Where(s => s.UserId == user.UserId).ToList();
        var names = new List<string>();
        foreach (var scenario in scenarios)
        {
            names.Add(scenario.Name);
        }
        if (!names.Contains(name)) return name;
        return FindSpareName(name + " new", user);
    }
    
    public String? SaveScenario(string username, ScenarioToSave scenarioToSave)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return null;
        var newName = FindSpareName(scenarioToSave.ScenarioName, user);
        var scenario = new Scenario
        {
            Name = newName,
            ScenarioContent = scenarioToSave.ScenarioContent,
            UserId = user.UserId,
            User = user
        };
        Console.WriteLine("SaveScenario: " + scenario.Name + " " + scenario.ScenarioId + " " + scenario.ScenarioContent);
        _context.Scenarios.Add(scenario);
        _context.SaveChanges();
        return newName;
    }
    
    public ActionResult OverwriteScenario(string username, ScenarioToSave scenarioToSave)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return new NotFoundResult();
        var scenario = _context.Scenarios.FirstOrDefault(s => s.Name == scenarioToSave.ScenarioName);
        if (scenario == null) return new NotFoundResult();
        scenario.ScenarioContent = scenarioToSave.ScenarioContent;
        _context.SaveChanges();
        return new OkResult();
    }
    
    public Scenario? GetSavedScenario(string username, int scenarioId)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return null;
        var scenario = _context.Scenarios.FirstOrDefault(s => s.ScenarioId == scenarioId);
        return scenario;
    }

    public void UpdateUsersEmail(string username, string email)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return;
        user.Email = email;
        _context.SaveChanges();
    }

    public void UpdateUser(User user)
    {
        _context.Users.Update(user);
        _context.SaveChanges();
    }

    public void UpdateAvatar(User user, string? filePath)
    {
        user.ProfilePicturePath = filePath;
        _context.SaveChanges();
    }

    public void AddPollSet(string username, PollSet polls)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return;

        // set name to random string with 10 chars TODO change this to be set by user
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        var name = new string(Enumerable.Repeat(chars, 10).Select(s => s[random.Next(s.Length)]).ToArray());
        polls.Name = name;

        polls.UserId = user.UserId;

        // DEBUG
        // Console.WriteLine("AddPollSet: " + polls.Name + " " + polls.PollSetId + " " + polls.OutputRaw + " " + polls.UserId + " " + polls.Bidding + " " + polls.KeyBinds);
        // // print polls one by one
        // foreach (var poll in polls.Polls)
        // {
        //     Console.WriteLine("Poll: ");
        //     Console.WriteLine("pollset id: " + poll.PollSetId);
        //     Console.WriteLine("Dealer: " + poll.Dealer);
        //     Console.WriteLine("Vul: " + poll.Vul);
        //     Console.WriteLine("Cards: " + poll.Cards);
        // }

        _context.PollSets.Add(polls);
        _context.SaveChanges();
    }

    // GetPollSet based on username and poll set id
    public PollSet? GetPollSet(string username, int pollSetId)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user == null) return null;
        var pollSet = _context.PollSets.FirstOrDefault(p => p.PollSetId == pollSetId);
        return pollSet;
    }
}
