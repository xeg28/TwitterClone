namespace TwitterClone.Models.PostModels
{
    public class Post
    {
        public int Id {  get; set; }

        public int? RootId { get; set; }
        public int? ParentId { get; set; } 
        public int Likes { get; set; }
        public int Views { get; set; }
        public int Reposts { get; set; }
        public int Replies { get; set; }
        public Post? Repost { get; set; }
        public string? Text { get; set; }
        public string? MediaPath { get; set; }
        public required int OwnerId { get; set; }
        public User? Owner { get; set; }
        public DateTime? DatePosted { get; set; }
    }
}
