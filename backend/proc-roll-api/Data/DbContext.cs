using Microsoft.EntityFrameworkCore;
using proc_roll_api.Models;

namespace proc_roll_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Cosmetic> Cosmetics { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Cosmetics)
                .WithMany(c => c.Users)
                .UsingEntity(j => j.ToTable("User_Cosmetic"));
        }
    }
}
