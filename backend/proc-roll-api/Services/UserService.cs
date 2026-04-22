using proc_roll_api.Models;
using System.Xml.Linq;

namespace proc_roll_api.Services
{
    public class UserService
    {
        static List<User> Users = new List<User>();
        static int nextId;

        public static List<User> GetAll() => Users;

        public static User? Get(int id) => Users.FirstOrDefault(u => u.UserId == id);

        public static void Add(string username, string email, string password)
        {
            var user = new User
            {
                UserId = nextId++,
                Username = username,
                Email = email,
                PasswordHash = HashPassword(password),
                Balance = 0
            };

            Users.Add(user);
        }

        public static void Delete(int id)
        {
            var user = Get(id);
            if (user == null)
                return;
            Users.Remove(user);
        }

        private static string HashPassword(string password)
        {
            // Replace with ASP.NET Identity hashing
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}
