using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwitterClone.Data;
using TwitterClone.Services;
using TwitterClone.Models;
using TwitterClone.Models.PasswordReset;

namespace TwitterClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordResetController : ControllerBase
    {
        private readonly TwitterCloneContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public PasswordResetController(TwitterCloneContext context, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        [HttpPost("request")] 
        public async Task<IActionResult> RequestPasswordReset([FromBody] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest(new { status = 400, message = "Email is required." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return Ok(new { status = 200, message = "Password reset link sent to your email." });
            }

            var existingReset = await _context.PasswordResets.FirstOrDefaultAsync(r => r.Email == email);

            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            var expiry = DateTime.UtcNow.AddMinutes(30);
            var passwordReset = new PasswordReset
            {
                Email = email,
                Token = token,
                Expiry = expiry
            };

            if (existingReset != null)
            {
                existingReset.Expiry = expiry;
                existingReset.Token = token;
                await _context.SaveChangesAsync();
            }
            else
            {
                _context.PasswordResets.Add(passwordReset);
                await _context.SaveChangesAsync();
            }


            var baseUrl = _configuration.GetValue<string>("Frontend:BaseUrl");
            var resetLink = $"{baseUrl}/reset-password?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";
            await _emailService.SendEmail(email, "Password Reset", $"Click the link to reset your password: {resetLink}");

            return Ok(new { status = 200, message = "Password reset link sent to your email." });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var passwordReset = await _context.PasswordResets
                .FirstOrDefaultAsync(r => r.Email == request.Email && r.Token == request.Token);

            if (passwordReset == null || passwordReset.Expiry < DateTime.UtcNow)
            {
                return BadRequest(new { status = 400, message = "Invalid or expired token." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest(new { status = 400, message = "Invalid or expired token." });
            }
            if (BCrypt.Net.BCrypt.Verify(request.NewPassword, user.HashedPassword))
            {
                return Conflict(new { status = 409, message = "New password must be different from the current password." });
            }
            
            user.HashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            _context.PasswordResets.Remove(passwordReset);
            await _context.SaveChangesAsync();

            return Ok(new { status = 200, message = "Password changed successfully." });
        }
    }
}
