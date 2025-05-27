using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwitterClone.Data;
using TwitterClone.Models;
using TwitterClone.Services;
using RegisterRequest = TwitterClone.Models.RegisterRequest;


namespace TwitterClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TwitterCloneContext _context;
        private readonly IEmailService _emailService; // Assuming you have an email service to send verification emails

        public AuthController(TwitterCloneContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Email and password are required.");

            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
                return Conflict("A user with this email already exists.");

            var user = new User
            {
                Email = request.Email,
                HashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password), // Use BCrypt or ASP.NET Identity
                IsVerified = false,
                LegalName = request.LegalName,
                Username = request.Username,
                Biography = string.Empty,
                DateJoined = DateTime.UtcNow,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 4. Generate verification code
            string code = new Random().Next(100000, 999999).ToString(); // 6-digit code
            var verification = new EmailVerification
            {
                Email = user.Email,
                Code = BCrypt.Net.BCrypt.HashPassword(code),
                Expiry = DateTime.UtcNow.AddMinutes(15)
            };

            _context.EmailVerifications.Add(verification);
            await _context.SaveChangesAsync();

            // 5. Send email using your existing endpoint or service
            await _emailService.SendEmail(user.Email, "Verify your email", $"Your verification code is: {code}");

            return Ok("User registered. Please check your email for a verification code.");
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] EmailVerification request)
        {
            var verification = await _context.EmailVerifications
                .FirstOrDefaultAsync(v => v.Email == request.Email);

            if (verification == null || verification.Expiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired verification code.");

            if (!BCrypt.Net.BCrypt.Verify(request.Code, verification.Code))
                return BadRequest("Invalid verification code.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return BadRequest("User not found.");

            user.IsVerified = true;
            _context.EmailVerifications.Remove(verification);
            await _context.SaveChangesAsync();

            return Ok("Email verified successfully.");
        }

    }
}
