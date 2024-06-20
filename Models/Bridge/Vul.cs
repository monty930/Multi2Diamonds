namespace Multi2Diamonds.Models.Bridge;

public enum Vul
{
    None,
    NS,
    EW,
    All
}

public static class VulDecoder
{
    public static Vul FromString(string vulnerability)
    {
        switch (vulnerability)
        {
            case "None":
                return Vul.None;
            case "NS":
                return Vul.NS;
            case "EW":
                return Vul.EW;
            case "All":
                return Vul.All;
            default:
                throw new ArgumentException("Invalid vulnerability");
        }
    }
}