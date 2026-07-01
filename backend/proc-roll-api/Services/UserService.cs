using proc_roll_api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace proc_roll_api.Services
{
    public class UserService
    {
        static List<User> Users = new List<User>();
        static Guid nextId;

        public static List<User> GetAll() => Users;

        public static User? Get(Guid id) => Users.FirstOrDefault(u => u.UserId == id);
        public static User? GetByUsername(string username) =>
            string.IsNullOrWhiteSpace(username) ? null :
            Users.FirstOrDefault(u => u.Username != null && u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));

        public static bool UsernameExists(string username) =>
            !string.IsNullOrWhiteSpace(username) && Users.Any(u => u.Username != null && u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));

        // Returns true on success, false if email/username already exists
        public static bool Add(User user)
        {
            if (user == null) return false;

            if (UsernameExists(user.Username))
                return false;

            Users.Add(user);
            return true;
        }

        public static void Delete(Guid id)
        {
            var user = Get(id);
            if (user == null)
                return;
            Users.Remove(user);
        }

        public static User? Login(string email, string password)
        {
            return Users.FirstOrDefault(u => u.PasswordHash == password);
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
