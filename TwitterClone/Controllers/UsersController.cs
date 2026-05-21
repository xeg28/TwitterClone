using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwitterClone.Data;
using TwitterClone.Mappings;
using TwitterClone.Models;

namespace TwitterClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly TwitterCloneContext _context;

        public UsersController(TwitterCloneContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("{username}")]
        public async Task<ActionResult<UserDto>> GetUserById(string username)
        {
            var user = await _context.Users.Select(UserMapper.ToDtoExpr)
                .FirstOrDefaultAsync(u  => u.Username == username);


            if (user == null) return NotFound();

            var postCount = await _context.Posts
                .CountAsync(p => p.OwnerId == user.Id);
            user.Posts = postCount;
            return Ok(user);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User updatedUser)
        {
            Request.Cookies.TryGetValue("userId", out var userIdString);

            if (userIdString == null) return Unauthorized(new { status = 401, message = "You are unauthorized to edit this resource" });

            if(userIdString != null && int.Parse(userIdString) != id)
            {
                return Forbid();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.LegalName = updatedUser.LegalName;
            user.Biography = updatedUser.Biography;
            user.Following = updatedUser.Following;
            user.Followers = updatedUser.Followers;

            await _context.SaveChangesAsync();

            return NoContent();
            
        }

        [HttpGet("email-check/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest(new {status = 400,  message = "Email is required." });

            bool emailTaken = await _context.Users.AnyAsync(u => u.Email == email);
            
            if(emailTaken)
            {
                return Conflict(new { status = 409, message = "Email is already taken." });
            }

            return Ok(new { status = 200, message = "Email is available" });
        }
    }
}
