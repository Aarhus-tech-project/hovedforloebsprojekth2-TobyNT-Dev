using proc_roll_api.Models;
using System.Xml.Linq;

namespace proc_roll_api.Services
{
    public class UserService
    {
        static List<User> Users = new List<User>();
        static Guid nextId;

        public static List<User> GetAll() => Users;

        public static User? Get(Guid id) => Users.FirstOrDefault(u => u.UserId == id);

        public static void Add(User user)
        {
            Users.Add(user);
        }

        public static void Delete(Guid id)
        {
            var user = Get(id);
            if (user == null)
                return;
            Users.Remove(user);
        }

        public static string HashPassword(string password)
        {
            // Replace with ASP.NET Identity hashing
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));
        }

        public static User? Login(string email, string password)
        {
            var hashedPassword = HashPassword(password);

            return Users.FirstOrDefault(u =>
                u.Email == email &&
                u.PasswordHash == hashedPassword);
        }
        public static bool AddBalance(Guid userId, int amount)
        {
            var user = Get(userId);
            if (user == null) return false;

            user.Balance += amount;
            return true;
        }
        public static bool RemoveBalance(Guid userId, int amount)
        {
            var user = Get(userId);
            if (user == null) return false;

            if (user.Balance < amount)
                return false;

            user.Balance -= amount;
            return true;
        }
        public static bool UpdateHighscore(Guid userId, int score)
        {
            var user = Get(userId);
            if (user == null) return false;

            if (score > user.Highscore)
            {
                user.Highscore = score;
                return true;
            }

            return false;
        }
    }
}
