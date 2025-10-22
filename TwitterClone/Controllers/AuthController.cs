using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using TwitterClone.Data;
using TwitterClone.Models;
using TwitterClone.Models.Api;
using TwitterClone.Services;
using RegisterRequest = TwitterClone.Models.RegisterRequest;
using System.Numerics;


namespace TwitterClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TwitterCloneContext _context;
        private readonly IEmailService _emailService; 
        private readonly JwtService _jwtService; 

        public AuthController(TwitterCloneContext context, JwtService jwtService, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
            _jwtService = jwtService;
        }

        private CookieOptions BuildCookieOptions(DateTimeOffset? expires = null)
        {
            return new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                //SameSite = SameSiteMode.Strict,
                SameSite = SameSiteMode.None,
                Expires = expires
            };
        }

        private DateTimeOffset GetRefreshExpiryFromUser(User? user = null)
        {
            int refreshTokenExpirySeconds = 0;
            DateTimeOffset? refreshTokenExpiresAt = null;

            if (user?.RefreshTokenExpiry is DateTime expiry)
            {
                var seconds = (expiry - DateTime.UtcNow).TotalSeconds;
                refreshTokenExpirySeconds = (int)Math.Max(0, Math.Floor(seconds));
                refreshTokenExpiresAt = DateTimeOffset.UtcNow.AddSeconds(refreshTokenExpirySeconds);
            }
            return refreshTokenExpiresAt ?? DateTimeOffset.UtcNow.AddDays(7);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Safely retrieve and parse the userId cookie
            if (!Request.Cookies.TryGetValue("userId", out var userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return BadRequest(new { status = 400, message = "User ID not valid or not found." });
            }
            var res = await _jwtService.RevokeRefreshTokenAsync(userId);

            // Remove the access token cookie
            Response.Cookies.Delete("accessToken", BuildCookieOptions());

            Response.Cookies.Delete("refreshToken", BuildCookieOptions());

            Response.Cookies.Delete("userId", BuildCookieOptions());

            return Ok(new { status = 200, message = "User logged out successfully.", success=res });
        }


        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseModel>> Login(LoginRequestModel request)
        {
            var result = await _jwtService.Authenticate(request);
            if (result is null)
                return Unauthorized(new { status = 401, message = "Invalid credentials" });


            // Set the accessToken as a cookie
            Response.Cookies.Append(
                "accessToken",
                result.AccessToken ?? "",
                BuildCookieOptions(DateTimeOffset.UtcNow.AddSeconds(result.ExpiresIn))
            );

            Response.Cookies.Append(
                "refreshToken",
                result.RefreshToken ?? "",
                BuildCookieOptions(GetRefreshExpiryFromUser(result.User))
            );

            Response.Cookies.Append(
                "userId",
                result.User?.Id.ToString() ?? "",
                BuildCookieOptions(GetRefreshExpiryFromUser(result.User))
            );

            var user = new User {
                Id = result.User.Id,
                Email = result.User.Email,
                LegalName = result.User.LegalName,
                Username = result.User.Username,
                Followers = result.User.Followers,
                Following = result.User.Following,
                Biography = result.User.Biography,
                IsVerified = result.User.IsVerified,
                DateJoined = result.User.DateJoined,
            };

            return Ok(new { status = 200, response = user });
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<LoginResponseModel>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var userIdString = Request.Cookies["userId"];

            if (string.IsNullOrEmpty(refreshToken) || string.IsNullOrEmpty(userIdString))
                return Unauthorized(new { status = 401, message = "Missing refresh token or user ID." });

            var request = new RefreshTokenRequest
            {
                RefreshToken = refreshToken,
                UserId = int.Parse(userIdString)
            };
            var result = await _jwtService.RefreshToken(request);
            if (result is null || result.AccessToken is null || result.RefreshToken is null)
                return Unauthorized(new { status = 401, message = "Invalid or expired refresh token." });


            // Set the accessToken as a cookie
            Response.Cookies.Append(
                "accessToken",
                result.AccessToken ?? "",
                BuildCookieOptions(DateTimeOffset.UtcNow.AddSeconds(result.ExpiresIn))
            );

            Response.Cookies.Append(
                "refreshToken",
                result.RefreshToken ?? "",
                BuildCookieOptions(GetRefreshExpiryFromUser(result.User))
            );

            Response.Cookies.Append(
                "userId",
                result.User?.Id.ToString() ?? "",
                BuildCookieOptions(GetRefreshExpiryFromUser(result.User))
            );
            return Ok(new { status = 200, response = result.User?.IsVerified });
        }

        [HttpGet("validate-token")]
        public IActionResult IsLoggedIn()
        {
            var accessToken = Request.Cookies["accessToken"];
            if (string.IsNullOrEmpty(accessToken))
                return Unauthorized(new { status = 401, message = "No access token." });

            var principal = _jwtService.ValidateToken(accessToken);
            if (principal == null)
                return Unauthorized(new { status = 401, message = "Invalid or expired token." });

            // Optionally, extract user info from claims
            var isVerifiedClaim = principal.FindFirst("IsVerified");
            var isVerified = isVerifiedClaim != null && bool.TryParse(isVerifiedClaim.Value, out var result) && result;
            var email = principal.FindFirst(ClaimTypes.Email)?.Value
                     ?? principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
            var userId = principal.FindFirst("UserId")?.Value;
            var username = principal.FindFirst("Username")?.Value;
            var legalName = principal.FindFirst(JwtRegisteredClaimNames.Name)?.Value;

            var user = new User
            {
                Id=int.Parse(userId),
                Email=email,
                Username=username,
                IsVerified= isVerified,
                LegalName = legalName,
            };
            return Ok(new { status = 200, message = "User is logged in.", user});
        }

        [HttpGet("username-check/{username}")]
        public async Task<IActionResult> CheckUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest("Username is required.");
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (user != null)
            {
                return Conflict(new
                {
                    status = 409,
                    message = "Username is already taken"
                });
            }
            return Ok(new { status = 200, message = "Username is available" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Email and password are required.");

            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return Conflict(new
                {
                    status = 409,
                    message = "Email is already taken"
                });
            }

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

            return Ok(new { status = 200, message = "User registered. Please check your email for a verification code." });
        }


        [HttpPost("resend-code")]
        public async Task<IActionResult> ResendVerificationCode([FromBody] EmailVerification request)
        {
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || user.IsVerified)
                return BadRequest(new { status = 400, message = "User not found or is verfied" });

            var verification = await _context.EmailVerifications
                .FirstOrDefaultAsync(v => v.Email == request.Email);


            // Generate a new code
            string newCode = new Random().Next(100000, 999999).ToString();

            if (verification != null)
            {
                verification.Code = BCrypt.Net.BCrypt.HashPassword(newCode);
                verification.Expiry = DateTime.UtcNow.AddMinutes(15);
                _context.EmailVerifications.Update(verification);
            }
            else
            {
                verification = new EmailVerification
                {
                    Email = user.Email,
                    Code = BCrypt.Net.BCrypt.HashPassword(newCode),
                    Expiry = DateTime.UtcNow.AddMinutes(15)
                };

                _context.EmailVerifications.Add(verification);
            }

            await _context.SaveChangesAsync();
            // Send the new code via email
            await _emailService.SendEmail(request.Email, "Verification Code", $"Your verification code is: {newCode}");
            return Ok(new { status = 200, message = "New code sent" }); 
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] EmailVerification request)
        {
            var verification = await _context.EmailVerifications
                .FirstOrDefaultAsync(v => v.Email == request.Email);

            if (verification == null || verification.Expiry < DateTime.UtcNow)
                return BadRequest(new { status = 400, message = "Invalid or expired verification code." });

            if (!BCrypt.Net.BCrypt.Verify(request.Code, verification.Code))
                return BadRequest(new { status = 400, message = "Invalid verification code." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return BadRequest(new { status = 400, message = "User not found." });

            user.IsVerified = true;
            _context.EmailVerifications.Remove(verification);
            await _context.SaveChangesAsync();

            // Issue a new access token if the user has a valid one
            var accessToken = Request.Cookies["accessToken"];
            ClaimsPrincipal? principal = null;
            if (!string.IsNullOrEmpty(accessToken))
                principal = _jwtService.ValidateToken(accessToken);

            string? newAccessToken = null;
            if (principal != null)
            {
                // Generate a new access token with updated claims
                newAccessToken = _jwtService.GenerateAccessToken(user);

                // Set the new access token as a cookie
                Response.Cookies.Append(
                    "accessToken",
                    newAccessToken,
                    BuildCookieOptions(DateTimeOffset.UtcNow.AddMinutes(
                            _jwtService.TokenValidityMinutes
                        ))
                );
            }

            return Ok(new { status = 200, message = "Email successfully verified." });
        }

    }
}
