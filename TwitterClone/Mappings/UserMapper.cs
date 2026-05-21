using System.Linq.Expressions;
using TwitterClone.Models;

namespace TwitterClone.Mappings
{
    public static class UserMapper
    {
        // Use this in EF queries: .Select(PostMapper.ToDtoExpr)
        public static readonly Expression<Func<User, UserDto>> ToDtoExpr = u => new UserDto
        {
            Id = u.Id,
            LegalName = u.LegalName,
            Username = u.Username,
            Biography = u.Biography,
            Followers = u.Followers,
            Following = u.Following,
            DateJoined = u.DateJoined,
            ProfilePicUrl = u.ProfilePicUrl,
            BannerPicUrl = u.BannerPicUrl
        };

        // Use this for in-memory Post instances
        public static UserDto ToDto(this User u)
        {
            if (u == null) return null!;
            return new UserDto
            {
                Id = u.Id,
                LegalName = u.LegalName,
                Username = u.Username,
                Biography = u.Biography,
                Followers = u.Followers,
                Following = u.Following,
                DateJoined = u.DateJoined,
                ProfilePicUrl = u.ProfilePicUrl,
                BannerPicUrl = u.BannerPicUrl
            };
        }
    }
}
