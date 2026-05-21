using System;
using System.Linq.Expressions;
using TwitterClone.Models.PostModels;

namespace TwitterClone.Mappings
{
    public static class PostLikeMapper
    {
        // Project a PostLike -> PostDto (includes LikedAt)
        public static readonly Expression<Func<PostLike, PostDto>> ToDtoExpr = pl => new PostDto
        {
            Id = pl.Post.Id,
            Likes = pl.Post.Likes,
            Views = pl.Post.Views,
            Reposts = pl.Post.Reposts,
            Replies = pl.Post.Replies,
            RepostId = pl.Post.Repost != null ? pl.Post.Repost.Id : (int?)null,
            MediaPath = pl.Post.MediaPath,
            Text = pl.Post.Text,
            DatePosted = pl.Post.DatePosted,
            RootId = pl.Post.RootId,
            ParentId = pl.Post.ParentId,
            Owner = pl.Post.Owner == null ? null : new UserDto
            {
                Id = pl.Post.Owner.Id,
                LegalName = pl.Post.Owner.LegalName,
                Username = pl.Post.Owner.Username,
                Biography = pl.Post.Owner.Biography,
                Followers = pl.Post.Owner.Followers,
                Following = pl.Post.Owner.Following,
                DateJoined = pl.Post.Owner.DateJoined,
                ProfilePicUrl = pl.Post.Owner.ProfilePicUrl
            },
            LikedAt = pl.LikedAt,
            IsLiked = true
        };
    }
}