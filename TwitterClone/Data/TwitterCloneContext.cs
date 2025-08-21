using Microsoft.EntityFrameworkCore;
using TwitterClone.Models;
using TwitterClone.Models.PasswordReset;

namespace TwitterClone.Data
{
    public class TwitterCloneContext : DbContext
    {
        public TwitterCloneContext(DbContextOptions<TwitterCloneContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .Property(u => u.RefreshToken)
                .IsRequired(false);
        }

        public DbSet<Post> Posts { get; set; } = null!;

        public DbSet<User> Users { get; set; } = null!;

        public DbSet<EmailVerification> EmailVerifications { get; set; } = null!;

        public DbSet<PasswordReset> PasswordResets { get; set; } = null!;
    }
}
