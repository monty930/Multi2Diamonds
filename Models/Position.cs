namespace BridgeScenarios.Models;

public enum Position
{
    West,
    North,
    East,
    South
}

public static class PosDecoder
{
    public static Position FromChar(char c)
    {
        return char.ToLower(c) switch
        {
            'n' => Position.North,
            'e' => Position.East,
            's' => Position.South,
            'w' => Position.West,
            _ => throw new ArgumentException($"Invalid position: {c}")
        };
    }

    public static Position Next(this Position pos)
    {
        return pos switch
        {
            Position.West => Position.North,
            Position.North => Position.East,
            Position.East => Position.South,
            Position.South => Position.West,
            _ => throw new ArgumentOutOfRangeException(nameof(pos), pos, null)
        };
    }
}