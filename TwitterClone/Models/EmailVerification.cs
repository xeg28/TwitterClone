namespace TwitterClone.Models
{
    public class EmailVerification
    {
        public int Id { get; set; }
        public required string? Email { get; set; }
        public required string? Code { get; set; }
        public DateTime? Expiry { get; set; }
    }
}
