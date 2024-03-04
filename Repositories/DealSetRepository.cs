using BridgeScenarios.Database;
using BridgeScenarios.Models.DbModels;
using Microsoft.EntityFrameworkCore;

namespace BridgeScenarios.Repositories;

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
}