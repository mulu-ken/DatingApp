namespace API.Entities;
public class AppUser
{
    public int ID { get; set; }
    public string UserName { get; set; } = string.Empty;
    public byte[] PasswordHash { get; set; } = null!;
    public byte[] PasswordSalt { get; set; } = null!;

}