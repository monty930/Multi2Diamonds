using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Multi2Diamonds.Models.Bridge;

namespace Multi2Diamonds.Models.DbModels;

public class Poll
{
    [Key] public int PollId { get; set; }

    [ForeignKey("PollSet")] public int PollSetId { get; set; }

    public Position Dealer { get; set; }

    public int Number { get; set; }

    public Vul Vul { get; set; }

    public Bid? Answer { get; set; } = null;

    [StringLength(17)] public string Cards { get; set; } = string.Empty;

    public DateTime CreationDate { get; set; } = DateTime.UtcNow;


    public static Poll FromString(string s)
    {
        var parts = s.Split(':');
        var hands = parts[1].Split(' ');

        return new Poll
        {
            // south cards
            Cards = hands[2],
        };
    }
}
