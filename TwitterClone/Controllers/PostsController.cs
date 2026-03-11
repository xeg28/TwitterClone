using System.Numerics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwitterClone.Data;
using TwitterClone.Models;

namespace TwitterClone.Controllers 
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly TwitterCloneContext _context;

        public PostsController(TwitterCloneContext context)
        {
            _context = context;
        }
        [HttpGet] // add authorize tag later
        public async Task<ActionResult<List<Post>>> GetPosts()
        {
            var posts = await _context.Posts
            .Include(post => post.Owner)  // Eagerly load the related User (Owner)
            .Select(post => new
            {
                post.Id,
                post.Likes,
                post.Reposts,
                post.Repost,
                post.MediaPath,
                post.Text,
                post.DatePosted,
                Owner = new
                {
                    post.Owner.Id,
                    post.Owner.LegalName,
                    post.Owner.Username,
                    post.Owner.Biography,
                    post.Owner.Followers,
                    post.Owner.DateJoined,
                    post.Owner.Following
                }
            })
            .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Dtos>> GetPostById(int id)
        {
            var post = await _context.Posts
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new Dtos
                {
                    Id = p.Id,
                    Likes = p.Likes,
                    Reposts = p.Reposts,
                    RepostId = p.Repost != null ? p.Repost.Id : null,
                    MediaPath = p.MediaPath,
                    Text = p.Text,
                    DatePosted = p.DatePosted,
                    Owner = p.Owner == null ? null : new UserDto
                    {
                        Id = p.Owner.Id,
                        LegalName = p.Owner.LegalName,
                        Username = p.Owner.Username,
                        Biography = p.Owner.Biography,
                        Followers = p.Owner.Followers,
                        Following = p.Owner.Following,
                        DateJoined = p.Owner.DateJoined
                    }
                })
                .FirstOrDefaultAsync();

            if (post == null)
                return NotFound();

            return Ok(post);
        }

        [HttpGet("user/{username}")]
        public async Task<ActionResult<List<Dtos>>> GetPostsByUserId(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest();

            var posts = await _context.Posts
                .AsNoTracking()
                .Where(p => p.Owner != null && p.Owner.Username == username)
                .Select(p => new Dtos
                {
                    Id = p.Id,
                    Likes = p.Likes,
                    Reposts = p.Reposts,
                    RepostId = p.Repost != null ? p.Repost.Id : null,
                    MediaPath = p.MediaPath,
                    Text = p.Text,
                    DatePosted = p.DatePosted,
                    Owner = p.Owner == null ? null : new UserDto
                    {
                        Id = p.Owner.Id,
                        LegalName = p.Owner.LegalName,
                        Username = p.Owner.Username,
                        Biography = p.Owner.Biography,
                        Followers = p.Owner.Followers,
                        Following = p.Owner.Following,
                        DateJoined = p.Owner.DateJoined,
                        ProfilePicUrl = p.Owner.ProfilePicUrl
                    }
                }).OrderByDescending(p => p.DatePosted)
                .ToListAsync();

            return Ok(posts);
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


                _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
