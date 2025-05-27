using Microsoft.EntityFrameworkCore;
using TwitterClone.Models;

namespace TwitterClone.Data
{
    public class TwitterCloneContext : DbContext
    {
        public TwitterCloneContext(DbContextOptions<TwitterCloneContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Post> Posts {  get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<EmailVerification> EmailVerifications { get; set; }
    }
}
