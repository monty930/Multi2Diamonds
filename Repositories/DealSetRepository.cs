using Multi2Diamonds.Database;
using Multi2Diamonds.Models.DbModels;

namespace Multi2Diamonds.Repositories;

public class DealSetRepository
{
    private readonly MyDbContext _context = new();

    public int AddDealSet(DealSet dealSet)
    {
        _context.DealSets.Add(dealSet);
        _context.SaveChanges();
        return dealSet.DealSetId;
    }

    public bool RemoveDealSet(int dealSetId)
    {
        var dealSet = _context.DealSets.Find(dealSetId);
        if (dealSet is null)
            return false;

        _context.DealSets.Remove(dealSet);
        _context.SaveChanges();
        return true;
    }

    public IEnumerable<DealSet> GetByUserId(int userId)
    {
        return _context.DealSets.Where(ds => ds.UserId == userId);
    }
    
    public DealSet? GetDealSetDetails(int dealSetId)
    {
        return _context.DealSets.Find(dealSetId);
    }
    
    public String? GetDealSetRaw(int dealSetId)
    {
        var DealSet = _context.DealSets.Find(dealSetId);
        if (DealSet is null)
            return null;
        return convertToRaw(DealSet);
    }

    private String convertToRaw(DealSet dealSet)
    {
        return "abc";
    }
}