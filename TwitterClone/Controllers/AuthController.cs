using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TwitterClone.Data;
using TwitterClone.Models;
using TwitterClone.Models.Api;
using TwitterClone.Services;
using RegisterRequest = TwitterClone.Models.RegisterRequest;


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
            //Response.Cookies.Delete("accessToken");
            //Response.Cookies.Delete("refreshToken");
            //Response.Cookies.Delete("userId");
            Response.Cookies.Delete("accessToken", new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true // set to true if your site uses HTTPS (Render does)
            });

            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });

            Response.Cookies.Delete("userId", new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });

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
                new CookieOptions
                {
                    HttpOnly = true, // Prevents JavaScript access (recommended for security)
                    Secure = true,
                    //SameSite = SameSiteMode.Strict,
                    SameSite = SameSiteMode.None, // Adjust as needed (Lax/Strict/None)
                    Expires = DateTimeOffset.UtcNow.AddSeconds(result.ExpiresIn)
                }
            );

            Response.Cookies.Append(
                "refreshToken",
                result.RefreshToken ?? "",
                new CookieOptions
                {
                    HttpOnly = true, // Prevents JavaScript access (recommended for security)
                    Secure = true,
                    //SameSite = SameSiteMode.Strict,
                    SameSite = SameSiteMode.None // Adjust as needed (Lax/Strict/None)
                }
            );

            Response.Cookies.Append(
                "userId",
                result.User.Id.ToString() ?? "",
                new CookieOptions
                {
                    HttpOnly = true, // Prevents JavaScript access (recommended for security)
                    Secure = true,
                    //SameSite = SameSiteMode.Strict,
                    SameSite = SameSiteMode.None // Adjust as needed (Lax/Strict/None)
                }
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
                new CookieOptions
                {
                    HttpOnly = true, // Prevents JavaScript access (recommended for security)
                    Secure = true,
                    //SameSite = SameSiteMode.Strict,
                    SameSite = SameSiteMode.None, // Adjust as needed (Lax/Strict/None)
                    Expires = DateTimeOffset.UtcNow.AddSeconds(result.ExpiresIn)
                }
            );

            Response.Cookies.Append(
                "refreshToken",
                result.RefreshToken ?? "",
                new CookieOptions
                {
                    HttpOnly = true, // Prevents JavaScript access (recommended for security)
                    Secure = true,
                    //SameSite = SameSiteMode.Strict,
                    SameSite = SameSiteMode.None // Adjust as needed (Lax/Strict/None)
                }
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

            var email = principal.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                     ?? principal.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email)?.Value;
            return Ok(new { status = 200, message = "User is logged in.", isVerified, email});
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
                    new CookieOptions
                    {
                        HttpOnly = true,
                        //SameSite = SameSiteMode.Strict,
                        SameSite = SameSiteMode.None,
                        Secure = true,
                        Expires = DateTimeOffset.UtcNow.AddMinutes(
                            _jwtService.TokenValidityMinutes // Use your config value
                        )
                    }
                );
            }

            return Ok(new { status = 200, message = "Email successfully verified." });
        }

    }
}
