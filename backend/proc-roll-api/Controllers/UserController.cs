using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using proc_roll_api.DTOs;
using proc_roll_api.Data;
using proc_roll_api.Models;
using proc_roll_api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace proc_roll_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UserController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAll()
        {
            var users = await _db.Users
                .Include(u => u.Cosmetics)
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(Guid id)
        {
            var user = await _db.Users
                .Include(u => u.Cosmetics)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Missing required fields");
            }

            if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
                return Conflict("Username already in use");

            var newUser = new User
            {
                UserId = Guid.NewGuid(),
                Username = dto.Username,
                PasswordHash = dto.Password,
                Balance = 0,
                Highscore = 0
            };

            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = newUser.UserId }, newUser);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var user = await _db.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == dto.Username && u.PasswordHash == dto.Password);

            if (user == null)
                return Unauthorized("Invalid username or password");

            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Balance,
                user.Highscore
            });
        }

        [HttpPost("{id}/balance/add")]
        public async Task<IActionResult> AddBalance(Guid id, BalanceDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Balance += dto.Amount;
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("{id}/balance/remove")]
        public async Task<IActionResult> RemoveBalance(Guid id, BalanceDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return BadRequest("User not found");

            if (user.Balance < dto.Amount)
                return BadRequest("Not enough balance");

            user.Balance -= dto.Amount;
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("{id}/highscore")]
        public async Task<IActionResult> UpdateHighscore(Guid id, HighscoreDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return BadRequest("User not found");

            if (dto.Score > user.Highscore)
            {
                user.Highscore = dto.Score;
                await _db.SaveChangesAsync();
                return Ok();
            }

            return BadRequest("Score not high enough");
        }
    }
}