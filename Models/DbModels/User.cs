namespace BridgeScenarios.Models.DbModels;

public class User
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public byte[] Password { get; set; } = [];
    public string Email { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }

    public List<DealSet> DealSets { get; set; } = [];
}