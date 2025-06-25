namespace TwitterClone.Models.Api
{
    public class LoginResponseModel
    {
        public User? User { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public int ExpiresIn { get; set; }
    }
}
