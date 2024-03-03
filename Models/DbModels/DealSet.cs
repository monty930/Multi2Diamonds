namespace BridgeScenarios.Models.DbModels;

public class DealSet
{
    public int DealSetId { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    
    public List<DbDeal> Deals { get; set; } = [];
}