using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using TwitterClone.Data;
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

        // add [authorize] attribute to protect this endpoint 
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _context.Users.Select(user => new
            {
                user.Id,
                user.LegalName,
                user.Username,
                user.Biography,
                user.Followers,
                user.DateJoined,
                user.Following
            }).FirstOrDefaultAsync(u  => u.Id == id);

            if (user == null) return NotFound();

            return Ok(user);
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
