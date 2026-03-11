public record UserDto
{
    public int Id { get; init; }
    public string? LegalName { get; init; }
    public string? Username { get; init; }
    public string? Biography { get; init; }
    public int Followers { get; init; }
    public int Following { get; init; }
    public int Posts { get; set; }
    public string? ProfilePicUrl { get; set; }
    public string? BannerPicUrl { get; set; }
    public DateTime? DateJoined { get; init; }
}

public record Dtos
{
    public int Id { get; init; }
    public int Likes { get; init; }
    public int Reposts { get; init; }
    public int? RepostId { get; init; }
    public string? MediaPath { get; init; }
    public string? Text { get; init; }
    public DateTime? DatePosted { get; init; }
    public UserDto? Owner { get; init; }
}