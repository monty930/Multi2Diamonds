using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Multi2Diamonds.Models.Bridge;

namespace Multi2Diamonds.Models.DbModels;

public class Deal
{
    [Key] public int DealId { get; set; }

    [ForeignKey("DealSet")] public int DealSetId { get; set; }

    public Position Dealer { get; set; }
    public int Number { get; set; }
    public Vul Vul { get; set; }

    [StringLength(17)] public string West { get; set; } = string.Empty;

    [StringLength(17)] public string North { get; set; } = string.Empty;

    [StringLength(17)] public string East { get; set; } = string.Empty;

    [StringLength(17)] public string South { get; set; } = string.Empty;

    public DateTime CreationDate { get; set; } = DateTime.UtcNow;


    public static Deal FromString(string s)
    {
        var parts = s.Split(':');
        var hands = parts[1].Split(' ');

        return new Deal
        {
            North = hands[0],
            East = hands[1],
            South = hands[2],
            West = hands[3]
        };
    }


    public override string ToString()
    {
        return $"N:{North} {East} {South} {West}";
    }
}