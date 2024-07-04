namespace Multi2Diamonds.Models.Bridge;

public enum Bid
{
    Pass,
    Double,
    Redouble,
    OneClub,
    OneDiamond,
    OneHeart,
    OneSpade,
    OneNt,
    TwoClubs,
    TwoDiamonds,
    TwoHearts,
    TwoSpades,
    TwoNt,
    ThreeClubs,
    ThreeDiamonds,
    ThreeHearts,
    ThreeSpades,
    ThreeNt,
    FourClubs,
    FourDiamonds,
    FourHearts,
    FourSpades,
    FourNt,
    FiveClubs,
    FiveDiamonds,
    FiveHearts,
    FiveSpades,
    FiveNt,
    SixClubs,
    SixDiamonds,
    SixHearts,
    SixSpades,
    SixNt,
    SevenClubs,
    SevenDiamonds,
    SevenHearts,
    SevenSpades,
    SevenNt
}

public static class BidDecoder
{
    public static Bid FromString(string bid)
    {
        switch (bid)
        {
            case "P":
                return Bid.Pass;
            case "X":
                return Bid.Double;
            case "XX":
                return Bid.Redouble;
            case "1C":
                return Bid.OneClub;
            case "1D":
                return Bid.OneDiamond;
            case "1H":
                return Bid.OneHeart;
            case "1S":
                return Bid.OneSpade;
            case "1NT":
                return Bid.OneNt;
            case "2C":
                return Bid.TwoClubs;
            case "2D":
                return Bid.TwoDiamonds;
            case "2H":
                return Bid.TwoHearts;
            case "2S":
                return Bid.TwoSpades;
            case "2NT":
                return Bid.TwoNt;
            case "3C":
                return Bid.ThreeClubs;
            case "3D":
                return Bid.ThreeDiamonds;
            case "3H":
                return Bid.ThreeHearts;
            case "3S":
                return Bid.ThreeSpades;
            case "3NT":
                return Bid.ThreeNt;
            case "4C":
                return Bid.FourClubs;
            case "4D":
                return Bid.FourDiamonds;
            case "4H":
                return Bid.FourHearts;
            case "4S":
                return Bid.FourSpades;
            case "4NT":
                return Bid.FourNt;
            case "5C":
                return Bid.FiveClubs;
            case "5D":
                return Bid.FiveDiamonds;
            case "5H":
                return Bid.FiveHearts;
            case "5S":
                return Bid.FiveSpades;
            case "5NT":
                return Bid.FiveNt;
            case "6C":
                return Bid.SixClubs;
            case "6D":
                return Bid.SixDiamonds;
            case "6H":
                return Bid.SixHearts;
            case "6S":
                return Bid.SixSpades;
            case "6NT":
                return Bid.SixNt;
            case "7C":
                return Bid.SevenClubs;
            case "7D":
                return Bid.SevenDiamonds;
            case "7H":
                return Bid.SevenHearts;
            case "7S":
                return Bid.SevenSpades;
            case "7NT":
                return Bid.SevenNt;
            default:
                throw new ArgumentException("Invalid bid");
        }
    }
}
