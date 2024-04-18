using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Multi2Diamonds.Models.Bridge;

namespace Multi2Diamonds.Models.DbModels;

public class DealSet
{
    [Key] public int DealSetId { get; set; }

    [ForeignKey("User")] public int UserId { get; set; }

    public User User { get; set; } = null!;

    [StringLength(40)] public string Name { get; set; } = string.Empty;

    public DateTime CreationDate { get; set; } = DateTime.UtcNow;

    public List<Deal> Deals { get; set; } = [];
    
    public static DealSet FromString(string raw)
    {
        var dealSet = new DealSet
        {
            Name = "Imported DealSet",
            CreationDate = DateTime.UtcNow
        };

        var lines = raw.Split('\n');
        var currentDeal = new Deal();
        bool inDeal = false;

        foreach (var line in lines)
        {
            if (line.StartsWith("[Board"))
            {
                if (inDeal)
                {
                    dealSet.Deals.Add(currentDeal);
                    currentDeal = new Deal();
                }
                inDeal = true;
            }
            else if (line.StartsWith("[Dealer"))
            {
                currentDeal.Dealer = PosDecoder.FromChar(line.Split('"')[1][0]);
            }
            else if (line.StartsWith("[Vulnerable"))
            {
                currentDeal.Vul = VulDecoder.FromString(line.Split('"')[1]);
            }
            else if (line.StartsWith("[Deal"))
            {
                var dealPart = line.Split('"')[1];
                currentDeal = Deal.FromString(dealPart);
            }
        }
        if (inDeal)
        {
            dealSet.Deals.Add(currentDeal);
        }

        return dealSet;
    }
}