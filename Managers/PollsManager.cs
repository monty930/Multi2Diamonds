using Multi2Diamonds.Models.Bridge;
using Multi2Diamonds.Models.DbModels;
using Multi2Diamonds.Polls.Models;
using Multi2Diamonds.Scenarios;
using Multi2Diamonds.Scenarios.Models;
using Multi2Diamonds.Scenarios.Models.CompilerSettings;

namespace Multi2Diamonds.Managers;

public class PollsManager
{
    public async Task<PollsModel> GeneratePolls(PollsSettingsArgs model, SettingsArgs settings)
    {
        settings.Compiler = CompilerChoice.Chai;
        settings.NumberOfDeals = model.NumberOfDeals;
        settings.Vul = model.Vul;
        settings.Dealer = DealerChoice.Random;
        settings.Flip = FlipChoice.NoFlip;
        settings.Scoring = ScoringChoice.Imp;
        settings.Percentages = [100];

        var scenariosModel = new ScenariosModel() { CompilerRunner = new CompilerRunner(settings) };

        try
        {
            var scriptOut = await scenariosModel.CompilerRunner.RunAll();
            var pollSet = new PollSet
            {
                OutputRaw = scriptOut,
                Bidding = Bidding.FromString(model.Bidding),
                KeyBinds = model.KeyBinds,
            };
            pollSet.Polls = GetPolls(scriptOut);
            var pollModel = new PollsModel
            {
                IsCorrectDeal = true,
                PollSet = pollSet
            };
            return pollModel;
        }
        catch (CompilerException e)
        {
            return new PollsModel
            {
                PollSet = new PollSet
                {
                    OutputRaw = e.Message
                },
                IsCorrectDeal = false
            };
        }
    }

    // TODO this should be somewhere else...
    private List<Poll> GetPolls(string scriptOut)
    {
        // TODO ...and implemented in another way...
        DealSet DS = DealSet.FromString(scriptOut);
        var polls = DS.Deals.Select(deal => new Poll
        {
            Dealer = deal.Dealer,
            Vul = deal.Vul,
            Cards = deal.South,
        }).ToList();

        return polls;
    }

    public object? SerializePolls(PollSet pollSet)
    {
        return new
        {
            pollSet.PollSetId,
            pollSet.Name,
            pollSet.OutputRaw,
            pollSet.UserId,
            pollSet.Bidding,
            pollSet.KeyBinds,
            Polls = pollSet.Polls.Select(poll => new
            {
                poll.PollId,
                poll.PollSetId,
                poll.Dealer,
                poll.Vul,
                poll.Cards,
                poll.Answer
            }).ToList()
        };
    }
}
