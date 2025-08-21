namespace TwitterClone.Models.PasswordReset
{
    public class ChangePasswordRequest
    {
        public required string? Email { get; set; }
        public required string? Token { get; set; }
        public required string? NewPassword { get; set; }
    }
}
