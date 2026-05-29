namespace proc_roll_api.Models
{
    public class Cosmetic
    {
        public Guid CosmeticId { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public string ImagePath { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}