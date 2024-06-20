using Multi2Diamonds.Models.DbModels;
using Microsoft.EntityFrameworkCore;

namespace Multi2Diamonds.Database;

public class MyDbContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<DealSet> DealSets { get; set; } = null!;
    public DbSet<Deal> Deals { get; set; } = null!;
    public DbSet<Scenario> Scenarios { get; set; } = null!;

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