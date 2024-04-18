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
        var hands = s[2..].Split(' ');
        var first = PosDecoder.FromChar(s[0]);
        var start = 0;
        while (first != Position.North)
        {
            start++;
            first = first.Next();
        }

        return new Deal
        {
            North = hands[start],
            East = hands[start % 4],
            South = hands[start % 4],
            West = hands[start % 4]
        };
    }

    public override string ToString()
    {
        return $"N:{North} {East} {South} {West}";
    }
}