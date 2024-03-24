using BridgeScenarios.Database;
using BridgeScenarios.Models.DbModels;

namespace BridgeScenarios.Repositories;

public class DealRepository
{
    private readonly MyDbContext _context = new();

    public int AddDeal(Deal deal)
    {
        _context.Deals.Add(deal);
        _context.SaveChanges();
        return deal.DealId;
    }

    public bool RemoveDeal(int dealId)
    {
        var deal = _context.Deals.Find(dealId);
        if (deal is null)
            return false;

        _context.Deals.Remove(deal);
        return _context.SaveChanges() >= 1;
    }

    public IEnumerable<Deal> GetByDealsetId(int dealSetId)
    {
        return _context.Deals.Where(d => d.DealSetId == dealSetId);
    }

    public IEnumerable<Deal> GetByUserId(int userId)
    {
        return from deal in _context.Deals
            join dealSet in _context.DealSets on deal.DealSetId equals dealSet.DealSetId
            where dealSet.UserId == userId
            select deal;
    }
}