using System.ComponentModel.DataAnnotations;

namespace TwitterClone.Models.PasswordReset
{
    public class PasswordReset
    {
        [Key]
        public required string? Email { get; set; }
        public required string? Token { get; set; }
        public required DateTime? Expiry { get; set; }
    }
}
