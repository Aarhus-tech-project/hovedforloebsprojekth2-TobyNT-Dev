using proc_roll_api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace proc_roll_api.Services
{
    public class CosmeticService
    {
        static List<Cosmetic> Cosmetics = new List<Cosmetic>();
        static Guid nextId;

        public static List<Cosmetic> GetAll() => Cosmetics;
    }
}
