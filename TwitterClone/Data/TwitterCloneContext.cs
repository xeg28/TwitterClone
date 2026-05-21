using Microsoft.EntityFrameworkCore;
using TwitterClone.Models;
using TwitterClone.Models.PasswordReset;
using TwitterClone.Models.PostModels;

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
      
            modelBuilder.Entity<PostLike>()
                .HasKey(pl => new { pl.UserId, pl.PostId });

            modelBuilder.Entity<PostLike>()
                .HasOne(pl => pl.User)
                .WithMany() 
                .HasForeignKey(pl => pl.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PostLike>()
                .HasOne(pl => pl.Post)
                .WithMany() 
                .HasForeignKey(pl => pl.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PostLike>()
                .HasIndex(pl => pl.UserId);
        }

        public DbSet<PostLike> PostLikes { get; set; } = null!;
        public DbSet<Post> Posts { get; set; } = null!;

        public DbSet<User> Users { get; set; } = null!;

        public DbSet<EmailVerification> EmailVerifications { get; set; } = null!;

        public DbSet<PasswordReset> PasswordResets { get; set; } = null!;
    }
}
