using BridgeScenarios.Models.DbModels;
using Microsoft.EntityFrameworkCore;

namespace BridgeScenarios.Database;

public class MyDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<DealSet> DealSets { get; set; }
    public DbSet<Deal> Deals { get; set; }
    public DbSet<UsersSavedContent> SavedContents { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseNpgsql("Host=localhost;Database=Multi3Diamonds;Username=postgres;Password=multi2diamonds");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}