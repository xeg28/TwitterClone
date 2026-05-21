using System.Linq;
using System.Linq.Expressions;
using TwitterClone.Models.PostModels;
namespace TwitterClone.Mappings
{
    public static class PostMapper
    {

        // Projection factory that marks IsLiked when post id exists in likedPostIds.
        // Call with a collection of postIds liked by the current user.
        public static Expression<Func<Post, PostDto>> ToDtoExpr(IEnumerable<int>? likedPostIds = null)
        {
            // capture an array constant so EF can translate .Contains(...) to SQL IN(...)
            var ids = (likedPostIds ?? Enumerable.Empty<int>()).ToArray();
            return p => new PostDto
            {
                Id = p.Id,
                Likes = p.Likes,
                Views = p.Views,
                Reposts = p.Reposts,
                Replies = p.Replies,
                RepostId = p.Repost != null ? p.Repost.Id : (int?)null,
                MediaPath = p.MediaPath,
                Text = p.Text,
                DatePosted = p.DatePosted,
                RootId = p.RootId,
                ParentId = p.ParentId,
                Owner = p.Owner == null ? null : UserMapper.ToDto(p.Owner),
                IsLiked = ids.Contains(p.Id)
            };
        }

     
        public static PostDto ToDto(this Post p, IEnumerable<int>? likedPostIds = null)
        {
            if (p == null) return null!;
            var likedSet = likedPostIds != null ? new HashSet<int>(likedPostIds) : null;
            return new PostDto
            {
                Id = p.Id,
                Likes = p.Likes,
                Views = p.Views,
                Reposts = p.Reposts,
                RepostId = p.Repost?.Id,
                MediaPath = p.MediaPath,
                Text = p.Text,
                DatePosted = p.DatePosted,
                RootId = p.RootId,
                ParentId = p.ParentId,
                Replies = p.Replies,
                Owner = p.Owner == null ? null : UserMapper.ToDto(p.Owner),
                IsLiked = likedSet != null && likedSet.Contains(p.Id)
            };
        }
    }
}