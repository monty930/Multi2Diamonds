using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Multi2Diamonds.Models.DbModels;

public class Scenario
{
    [Key] public int ScenarioId { get; set; }

    [ForeignKey("User")] public int UserId { get; set; }

    public User User { get; set; } = null!;

    [StringLength(40)] public string Name { get; set; } = string.Empty;

    public DateTime CreationDate { get; set; } = DateTime.UtcNow;

    public string ScenarioContent { get; set; } = string.Empty;
}