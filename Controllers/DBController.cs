using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Multi2Diamonds.Database;
using Multi2Diamonds.Models.DbModels;

namespace Multi2Diamonds.Controllers
{
    [ApiController]
    [Route("DB")]
    public class DBController : Controller
    {
        private readonly MyDbContext context = new();

        [HttpGet]
        [Route("ShowDB")]
        public async Task<IActionResult> ShowDB()
        {
            var users = await context.Users
                .Include(u => u.DealSets)
                .ThenInclude(ds => ds.Deals)
                .Include(u => u.PollSets)
                .ThenInclude(ps => ps.Polls)
                .Include(u => u.Scenarios)
                .ToListAsync();

            var result = users.Select(u => new
            {
                u.UserId,
                u.Username,
                u.Password,
                u.ProfilePicturePath,
                u.Email,
                u.IsAdmin,
                u.CreationDate,
                DealSets = u.DealSets.Select(ds => new
                {
                    ds.DealSetId,
                    ds.Name,
                    Deals = ds.Deals.Select(d => new
                    {
                        d.DealId,
                        d.Number,
                        d.Dealer,
                        d.North,
                        d.East,
                        d.South,
                        d.West
                    })
                }),
                PollSets = u.PollSets.Select(ps => new
                {
                    ps.PollSetId,
                    ps.Name,
                    Polls = ps.Polls.Select(p => new
                    {
                        p.PollId,
                        p.Number,
                        p.Dealer,
                        p.Cards,
                        p.Vul
                    })
                }),
                Scenarios = u.Scenarios.Select(s => new
                {
                    s.ScenarioId,
                    s.Name,
                    s.ScenarioContent
                })
            });

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteAllPollSets")]
        public async Task<IActionResult> DeleteAllPollSets() {
            var pollSets = await context.PollSets.ToListAsync();
            context.PollSets.RemoveRange(pollSets);
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Route("DeleteAllDealSets")]
        public async Task<IActionResult> DeleteAllDealSets() {
            var dealSets = await context.DealSets.ToListAsync();
            context.DealSets.RemoveRange(dealSets);
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Route("DeleteAllScenarios")]
        public async Task<IActionResult> DeleteAllScenarios()
        {
            var scenarios = await context.Scenarios.ToListAsync();
            context.Scenarios.RemoveRange(scenarios);
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
