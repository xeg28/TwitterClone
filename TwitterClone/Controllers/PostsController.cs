using System.Numerics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwitterClone.Data;
using TwitterClone.Models.PostModels;
using TwitterClone.Mappings;
using TwitterClone.Services;

namespace TwitterClone.Controllers 
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly TwitterCloneContext _context;
        private readonly IViewService _viewService;

        public PostsController(TwitterCloneContext context, IViewService viewService)
        {
            _context = context;
            _viewService = viewService;
        }


        private async Task<IEnumerable<int>> GetUserLikedPostsIds()
        {
            Request.Cookies.TryGetValue("userId", out var userIdString);
            if (userIdString == null) return Enumerable.Empty<int>();
            var userId = int.Parse(userIdString);
            var likedPostIds = await _context.PostLikes
                .AsNoTracking()
                .Where(pl => pl.UserId == userId)
                .Select(pl => pl.PostId)
                .ToArrayAsync();
            return likedPostIds;
        }

        [HttpGet] // add authorize tag later
        public async Task<ActionResult<List<Post>>> GetPosts()
        {
            var likedPostIds = await GetUserLikedPostsIds();
            var posts = await _context.Posts
            .Include(post => post.Owner)  // Eagerly load the related User (Owner)
            .Select(PostMapper.ToDtoExpr(likedPostIds))
            .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPostById(int id)
        {
            var likedPostIds = await GetUserLikedPostsIds();
            var post = await _context.Posts
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(PostMapper.ToDtoExpr(likedPostIds))
                .FirstOrDefaultAsync();

            if (post == null)
                return NotFound();

            return Ok(post);
        }

        [HttpGet("user/{username}")]
        [Authorize]
        public async Task<ActionResult<List<PostDto>>> GetPostsByUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest();

            var likedPostIds = await GetUserLikedPostsIds();

            var posts = await _context.Posts
                .AsNoTracking()
                .Where(p => p.Owner != null && p.Owner.Username == username && p.ParentId == null)
                .Select(PostMapper.ToDtoExpr(likedPostIds))
                .OrderByDescending(p => p.DatePosted)
                .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("user/with_replies/{username}")]
        [Authorize]
        public async Task<ActionResult<List<PostDto>>> GetUserReplyPosts(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest();
            
            var likedPostIds = await GetUserLikedPostsIds();

            var posts = await _context.Posts
                .AsNoTracking()
                .Where(p => p.Owner != null && p.Owner.Username == username)
                .Select(PostMapper.ToDtoExpr(likedPostIds))
                .OrderByDescending(p => p.DatePosted)
                .ToListAsync();

            var replyParentIds = posts
                .Where(r => r.ParentId != null)
                .Select(r => r.ParentId!.Value)
                .ToHashSet();

            var filteredReplies = posts
                .Where(r => !replyParentIds.Contains(r.Id))
                .ToList();

            var parentIds = posts
                .Where(r => r.ParentId != null)
                .Select(r => r.ParentId!.Value)
                .Distinct()
                .ToList();

            var parents = await _context.Posts
                .AsNoTracking()
                .Where(p => parentIds.Contains(p.Id))
                .Select(PostMapper.ToDtoExpr(likedPostIds))
                .ToListAsync();

            var grandparentIds = parents
                .Where(p => p.ParentId != null && p.Owner.Username == username)
                .Select(p => p.ParentId!.Value)
                .Distinct()
                .ToList();

            var grandparents = await _context.Posts
                .AsNoTracking()
                .Where(p => grandparentIds.Contains(p.Id))
                .Select(PostMapper.ToDtoExpr(likedPostIds))
                .ToListAsync();

            var parentMap = parents.ToDictionary(p => p.Id);
            var grandparentMap = grandparents.ToDictionary(p => p.Id);

            var result = filteredReplies.Select(reply =>
            {
                if(reply.ParentId == null)
                {
                    return reply;
                }
                parentMap.TryGetValue(reply.ParentId!.Value, out var parent);

                PostDto? grandparent = null;
                if (parent?.ParentId != null)
                {
                    grandparentMap.TryGetValue(parent.ParentId.Value, out grandparent);
                }

                reply.parent = parent;
                reply.grandparent = grandparent;
                return reply;
            }).ToList();

            return Ok(result);
        }

        [HttpGet("replies/{postId}")]
        [Authorize]
        public async Task<ActionResult<List<PostDto>>> GetRepliesForPost(int postId)
        {
            var likedPostIds = await GetUserLikedPostsIds();
            var replies = await _context.Posts
                .AsNoTracking()
                .Where(p => p.ParentId == postId)
                .Select(PostMapper.ToDtoExpr(likedPostIds))
                .OrderBy(p => p.DatePosted)
                .ToListAsync();
            return Ok(replies);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Post>> AddPost(Post newPost)
        {
            Request.Cookies.TryGetValue("userId", out var userIdString);
            if(userIdString == null)
                return Unauthorized(new { status = 401, message = "You are unauthorized to create a post" });
            if (int.Parse(userIdString) != newPost.OwnerId)
                return Unauthorized(new { status = 401, message = "You are unauthorized to create a post for another user" });
            if (newPost == null || newPost.Text == null)
                return BadRequest();

            newPost.DatePosted = DateTime.UtcNow;

            if(newPost.ParentId != null)
            {
                var parent = await _context.Posts.FindAsync(newPost.ParentId);
                if (parent == null)
                    return BadRequest(new { status = 400, message = "Parent post not found" });
                parent.Replies++;
            }

            _context.Posts.Add(newPost);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPostById), new { id = newPost.Id }, newPost);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, Post newPost)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();

            //post.Id = newPost.Id;
            post.Likes = newPost.Likes;
            post.Reposts = newPost.Reposts;
            post.Text = newPost.Text;
            post.Repost = newPost.Repost;
            post.MediaPath = newPost.MediaPath;
            //post.Owner = newPost.Owner;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("view/{id}")]
        public IActionResult AddView(int id)
        {
            var userId = Request.Cookies["userId"];
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

            _viewService.AddView(id, userId, ip);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            Request.Cookies.TryGetValue("userId", out var userIdString);
            if(userIdString == null)
                return Unauthorized(new { status = 401, message = "You are unauthorized to delete this post" });
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();

            if (int.Parse(userIdString) != post.OwnerId)
            {
                return Unauthorized(new { status = 401, message = "You are unauthorized to delete this post" });
            }

            if(post.ParentId != null)
            {
                var parent = await _context.Posts.FindAsync(post.ParentId);
                if (parent != null && parent.Replies > 0)
                    parent.Replies--;
            }


                _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPost("like/{id}")]
        [Authorize]
        public async Task<IActionResult> LikePost(int id)
        {
            Request.Cookies.TryGetValue("userId", out var userIdString);
            if (userIdString == null) return Unauthorized();

            var userId = int.Parse(userIdString);

            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            var existing = await _context.PostLikes.FindAsync(userId, id);
            if (existing != null) return BadRequest(new { message = "Already liked" });

            var like = new PostLike { UserId = userId, PostId = id, LikedAt = DateTime.UtcNow };
            _context.PostLikes.Add(like);

            // maintain denormalized counter for fast reads
            post.Likes++;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("like/{id}")]
        [Authorize]
        public async Task<IActionResult> UnlikePost(int id)
        {
            Request.Cookies.TryGetValue("userId", out var userIdString);
            if (userIdString == null) return Unauthorized();

            var userId = int.Parse(userIdString);

            var like = await _context.PostLikes.FindAsync(userId, id);
            if (like == null) return NotFound();

            _context.PostLikes.Remove(like);

            var post = await _context.Posts.FindAsync(id);
            if (post != null && post.Likes > 0)
                post.Likes--;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("likes/user/{username}")]
        public async Task<IActionResult> GetLikedPostsByUsername(string username)
        {
            var likedIds = await GetUserLikedPostsIds();
            var liked = await _context.PostLikes
                .AsNoTracking()
                .Where(pl => pl.User.Username == username)
                .OrderByDescending(pl => pl.LikedAt)      // order on DB-side
                .Select(PostLikeMapper.ToDtoExpr)         // single clean projection
                .ToListAsync();

            return Ok(liked);
        }
    }
}
