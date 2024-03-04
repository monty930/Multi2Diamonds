using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BridgeScenarios.Models.DbModels;

public class Deal
{
    [Key]
    public int DbDealId { get; set; }
    
    [ForeignKey("DealSet")]
    public int DealSetId { get; set; }
    
    public Position Dealer { get; set; }
    public int Number { get; set; }
    public Vul Vul { get; set; }
    
    [StringLength(17)]
    public string West { get; set; } = string.Empty;
    
    [StringLength(17)]
    public string North { get; set; } = string.Empty;
    
    [StringLength(17)]
    public string East { get; set; } = string.Empty;
    
    [StringLength(17)]
    public string South { get; set; } = string.Empty;
    
    public DateTime CreationDate { get; set; } = DateTime.Now;
    
    
    public override string ToString()
    {
        return $"N:{North} {East} {South} {West}";
    }
}