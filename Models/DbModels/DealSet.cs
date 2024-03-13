using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BridgeScenarios.Models.DbModels;

public class DealSet
{
    [Key]
    public int DealSetId { get; set; }
    
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    [StringLength(40)]
    public string Name { get; set; } = string.Empty;
    
    public string Constraints { get; set; } = string.Empty;
    
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    
    public List<Deal> Deals { get; set; } = [];
}