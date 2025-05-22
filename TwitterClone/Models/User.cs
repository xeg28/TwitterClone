namespace TwitterClone.Models
{
    public class User
    {
        public int Id { get; set; }
        public required String LegalName { get; set; }
        public required String Username { get; set; }
        public required String Email { get; set; }
        public int Followers { get; set; }
        public int Following { get; set; }
        public String Biography { get; set; } = null!;
        public DateTime DateJoined { get; set; }
        public String? HashedPassword {  get; set; }
    }
}
