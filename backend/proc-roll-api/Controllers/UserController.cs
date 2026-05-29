using Microsoft.AspNetCore.Mvc;
using proc_roll_api.DTOs;
using proc_roll_api.Models;
using proc_roll_api.Services;
using System;

namespace proc_roll_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<User>> GetAll() => UserService.GetAll();

        [HttpGet("{id}")]
        public ActionResult<User> Get(Guid id)
        {
            var user = UserService.Get(id);
            if (user == null)
                return NotFound();
            return user;
        }

        [HttpPost]
        public IActionResult Create(CreateUserDto dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.Username) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Missing required fields");
            }

            if (UserService.EmailExists(dto.Email))
                return Conflict("Email already in use");

            if (UserService.UsernameExists(dto.Username))
                return Conflict("Username already in use");

            var newUser = new User
            {
                UserId = Guid.NewGuid(),
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = UserService.HashPassword(dto.Password),
                Balance = 0,
                Highscore = 0
            };

            var added = UserService.Add(newUser);
            if (!added)
                return Conflict("Email or username already in use");

            return CreatedAtAction(nameof(Get), new { id = newUser.UserId }, newUser);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var user = UserService.Get(id);

            if (user == null)
                return NotFound();
            UserService.Delete(id);

            return NoContent();
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var user = UserService.Login(dto.Email, dto.Password);

            if (user == null)
                return Unauthorized("Invalid email or password");

            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Email,
                user.Balance,
                user.Highscore
            });
        }

        [HttpPost("{id}/balance/add")]
        public IActionResult AddBalance(Guid id, BalanceDto dto)
        {
            var success = UserService.AddBalance(id, dto.Amount);

            if (!success)
                return NotFound();

            return Ok();
        }

        [HttpPost("{id}/balance/remove")]
        public IActionResult RemoveBalance(Guid id, BalanceDto dto)
        {
            var success = UserService.RemoveBalance(id, dto.Amount);

            if (!success)
                return BadRequest("Not enough balance or user not found");

            return Ok();
        }

        [HttpPost("{id}/highscore")]
        public IActionResult UpdateHighscore(Guid id, HighscoreDto dto)
        {
            var success = UserService.UpdateHighscore(id, dto.Score);

            if (!success)
                return BadRequest("User not found or score not high enough");

            return Ok();
        }
    }
}
