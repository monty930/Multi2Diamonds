using BridgeScenarios.Database;

namespace BridgeScenarios.Repositories;

public abstract class Repository
{
    protected MyDbContext DbContext = new();
}