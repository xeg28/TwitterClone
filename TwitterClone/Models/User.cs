namespace TwitterClone.Models
{
    public class User
    {
        public int Id { get; set; }
        public required String LegalName { get; set; }
        public required String Username { get; set; }
        public required String Email { get; set; }
        public Boolean IsVerified { get; set; } = false;
        public int Followers { get; set; }
        public int Following { get; set; }
        public String Biography { get; set; } = null!;
        public DateTime DateJoined { get; set; }
        public String? HashedPassword {  get; set; }
        public String? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
    }
}
