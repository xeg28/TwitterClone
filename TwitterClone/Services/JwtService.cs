using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TwitterClone.Data;
using TwitterClone.Models;
using TwitterClone.Models.Api;

namespace TwitterClone.Services
{
    public class JwtService
    {
        private readonly TwitterCloneContext _dbContext;
        private readonly IConfiguration _configuration;
        public int TokenValidityMinutes;
        public JwtService(TwitterCloneContext context, IConfiguration configuration)
        {
            _dbContext = context;
            _configuration = configuration;
            TokenValidityMinutes = _configuration.GetValue<int>("JwtConfig:TokenValidityMins");
        }

        public async Task<LoginResponseModel> Authenticate(LoginRequestModel request)
        {
            if (string.IsNullOrEmpty(request.User) || string.IsNullOrEmpty(request.Password))
                return null;
            
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == request.User || u.Email == request.User);

            if(user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.HashedPassword))
            {
                return null; // Invalid credentials
            }

            var accessToken = GenerateAccessToken(user);
            var tokenValidityMins = _configuration.GetValue<int>("JwtConfig:TokenValidityMins");
            var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenValidityMins);

            return new LoginResponseModel
            {
                User = user,
                AccessToken = accessToken,
                ExpiresIn = (int)(tokenExpiryTimeStamp - DateTime.UtcNow).TotalSeconds,
                RefreshToken = await GenerateAndSaveRefreshToken(user),
            };

        }

        public async Task<bool> RevokeRefreshTokenAsync(int userId)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user is null)
                return false;

            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            _dbContext.Users.Update(user);
            var result = await _dbContext.SaveChangesAsync();
            return result > 0;
        }

        public async Task<LoginResponseModel> RefreshToken(RefreshTokenRequest request)
        {
            var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
            if(user is null)
            {
                return null;
            }

            if(!user.IsVerified)
            {
                await RevokeRefreshTokenAsync(user.Id);
                return null;
            }

            var accessToken = GenerateAccessToken(user);
            var tokenValidityMins = _configuration.GetValue<int>("JwtConfig:TokenValidityMins");
            var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenValidityMins);

            return new LoginResponseModel
            {
                User = user,
                AccessToken = accessToken,
                ExpiresIn = (int)(tokenExpiryTimeStamp - DateTime.UtcNow).TotalSeconds,
                RefreshToken = await GenerateAndSaveRefreshToken(user)
            };
        }

        private async Task<User> ValidateRefreshTokenAsync(int userId, string refreshToken)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if(user == null || user.RefreshToken != refreshToken 
                || user.RefreshTokenExpiry < DateTime.UtcNow)
            {
                return null; // Invalid or expired refresh token
            }

            return user;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshToken(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7); // Set expiry to 7 days
            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();
            return refreshToken;
        }

        public string GenerateAccessToken(User user)
        {
            var issuer = _configuration["JwtConfig:Issuer"];
            var audience = _configuration["JwtConfig:Audience"];
            var key = _configuration["JwtConfig:Key"];
            var tokenValidityMins = _configuration.GetValue<int>("JwtConfig:TokenValidityMins");
            var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenValidityMins);

            var TokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Name, user.Username),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim("IsVerified", user.IsVerified.ToString().ToLowerInvariant())
                }),
                Expires = tokenExpiryTimeStamp,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                    SecurityAlgorithms.HmacSha256Signature),
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(TokenDescriptor);
            var accessToken = tokenHandler.WriteToken(securityToken);
            return accessToken;
        }

        public ClaimsPrincipal? ValidateToken(string accessToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes(_configuration["JwtConfig:Key"]);

            try
            {
                var principal = tokenHandler.ValidateToken(accessToken, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _configuration["JwtConfig:Issuer"],
                    ValidAudience = _configuration["JwtConfig:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return principal;
            }
            catch
            {
                return null;
            }
        }
    } 
}
