using Multi2Diamonds.Database;

namespace Multi2Diamonds.Repositories;

public class ConstraintsRepository
{
    private readonly MyDbContext _context = new();

    public string[] GetConstraints(string[] constraintsNames, string username)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);
        if (user is null)
            return Array.Empty<string>();

        var constraints = _context.Scenarios.Where(s => s.UserId == user.UserId && constraintsNames.Contains(s.Name));
        var result = constraints.Select(c => c.ScenarioContent).ToArray();

        if (constraintsNames.Contains("NoConstraint"))
            result = result.Append("# no constraints").ToArray();
        return result;
    }
}
