using Microsoft.AspNetCore.Mvc;
using proc_roll_api.Models;
using proc_roll_api.Services;

namespace proc_roll_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<User>> GetAll() => UserService.GetAll();

        [HttpGet("{id}")]
        public ActionResult<User> Get(int id)
        {
            var user = UserService.Get(id);
            if (user == null)
                return NotFound();
            return user;
        }

        [HttpPost]
        public IActionResult Create(User user)
        {
            UserService.Add(user.Username, user.Email, user.PasswordHash);
            return CreatedAtAction(nameof(Create), new { id = user.UserId }, user);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = UserService.Get(id);

            if (user == null)
                return NotFound();
            UserService.Delete(id);

            return NoContent();
        }
    }
}
