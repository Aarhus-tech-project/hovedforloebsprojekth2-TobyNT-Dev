namespace proc_roll_api.Models
{
    public class User
    {
        public Guid UserId { get; set; }
        public string PasswordHash { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public int Balance { get; set; }
        public int Highscore { get; set; }
    }
}