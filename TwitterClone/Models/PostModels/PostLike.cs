using System;
namespace TwitterClone.Models.PostModels
{
    public class PostLike
    {
        public int UserId { get; set; }
        public int PostId { get; set; }
        public DateTime LikedAt { get; set; }

        // Navigation
        public User? User { get; set; }
        public Post? Post { get; set; }
    }
}