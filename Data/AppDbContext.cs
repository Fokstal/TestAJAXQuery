using Microsoft.EntityFrameworkCore;

namespace TestAJAXQuery.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Models.User>? User { get; set; }
    }
}
