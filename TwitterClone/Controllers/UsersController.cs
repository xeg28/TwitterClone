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

        [HttpGet("by-email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await _context.Users.Select(user => new
            {
                user.Email
            }).FirstOrDefaultAsync(u => u.Email == email);

            if (user == null) return NotFound();

            return Ok(user);
        }


    }
}
