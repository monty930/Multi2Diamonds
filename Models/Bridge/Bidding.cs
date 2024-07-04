namespace Multi2Diamonds.Models.Bridge;

public class Bidding
{
    public static Bidding FromString(string s)
    {
        Position[] dealerPositions = [Position.South, Position.West, Position.North, Position.East];

        // Determine the dealer based on the number of '-' in the string
        int dashCount = s.Count(c => c == '-');
        Position dealer = dealerPositions[dashCount % 4];

        string[] bidStrings = s.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        bidStrings = bidStrings.Where(b => b != "-").ToArray();

        Bid[] bids = bidStrings.Select(BidDecoder.FromString).ToArray();

        return new Bidding
        {
            Bids = bids,
            Dealer = dealer
        };
    }

    public Bid[] Bids { get; set; } = Array.Empty<Bid>();

    public Position Dealer { get; set; } = Position.South;
}
