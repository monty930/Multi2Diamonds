using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace BridgeScenarios.Models.DbModels;

public class DbDeal
{
    [Key]
    public int DbDealId { get; set; }
    
    public int DealSetId { get; set; }
    
    public Position Dealer { get; set; }
    public int Number { get; set; }
    public Vul Vul { get; set; }
    public string West { get; set; } = string.Empty;
    public string North { get; set; } = string.Empty;
    public string East { get; set; } = string.Empty;
    public string South { get; set; } = string.Empty;
}