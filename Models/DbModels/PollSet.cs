using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Multi2Diamonds.Models.Bridge;

namespace Multi2Diamonds.Models.DbModels;

public class PollSet
{
    [Key] public int PollSetId { get; set; }

    [ForeignKey("User")] public int UserId { get; set; }

    public User User { get; set; } = null!;

    [StringLength(40)] public string Name { get; set; } = string.Empty;

    public DateTime CreationDate { get; init; } = DateTime.UtcNow;

    public List<Poll> Polls { get; set; } = [];

    public Bidding Bidding { get; set; } = null!;

    public string KeyBinds { get; set; } = "";

    public string OutputRaw { get; set; } = "";
}
