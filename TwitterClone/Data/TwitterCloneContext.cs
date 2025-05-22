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
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    LegalName = "Emmanuel Gonzalez",
                    Username = "xeg28",
                    Email = "eg2895@gmail.com",
                    Followers = 2,
                    Biography = "I am currently learning how to build a REST API in ASP.NET."
                }
            );

            modelBuilder.Entity<Post>().HasData(
                new Post
                {
                    Id = 1,
                    Likes = 10,
                    Reposts = 2,
                    Text = "This is my first tweet.",
                    OwnerId = 1,
                },
                new Post
                {
                    Id = 2,
                    Likes = 40,
                    Reposts = 10,
                    Text = "This is my second tweet.",
                    MediaPath = "./media/image.png",
                    OwnerId = 1,
                }
            );
        }

        public DbSet<Post> Posts {  get; set; }

        public DbSet<User> Users { get; set; }
    }
}
