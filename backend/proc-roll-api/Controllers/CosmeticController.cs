using Microsoft.AspNetCore.Mvc;
using proc_roll_api.DTOs;
using proc_roll_api.Models;
using proc_roll_api.Services;
using System;

namespace proc_roll_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CosmeticController
    {
        [HttpGet]
        public ActionResult<List<Cosmetic>> GetAll() => CosmeticService.GetAll();
    }
}
