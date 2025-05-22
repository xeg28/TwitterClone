using System.Diagnostics.Eventing.Reader;
using Microsoft.AspNetCore.Http;
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
        [HttpGet]
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
                    // We do NOT include post.Owner.PasswordHash or post.Owner.PasswordSalt
                }
            })
            .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPostById(int id)
        {
            var post = await _context.Posts
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
                    // We do NOT include post.Owner.PasswordHash or post.Owner.PasswordSalt
                }
            })  // Eagerly load the related User (Owner)
            .FirstOrDefaultAsync(p => p.Id == id);  // Find the post by I

            if (post == null)
                return NotFound();

            return Ok(post);
        }

        [HttpPost]
        public async Task<ActionResult<Post>> AddPost(Post newPost)
        {
            if (newPost == null)
                return BadRequest();

            newPost.DatePosted = DateTime.Now;
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
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
