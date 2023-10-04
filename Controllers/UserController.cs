using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using TestAJAXQuery.Data;
using TestAJAXQuery.Models;

namespace TestAJAXQuery.Controllers
{
    public class UserController : Controller
    {
        private readonly AppDbContext _db;
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger, AppDbContext db)
        {
            _logger = logger;
            _db = db;
        }

        public IActionResult Index() => View();

        [HttpGet]
        public JsonResult GetAll()
        {
            List<User> users = _db.User.ToList();

            return Json(users);
        }

        [HttpGet("User/Get/{id?}")]
        public JsonResult Get(int? id)
        {
            if (id is null || id == 0) return Json(new User());

            User? user = _db.User.FirstOrDefault(el => el.Id == id);

            return Json(user);
        }

        [HttpPost]
        public IActionResult Upsert([FromBody] User user)
        {
            string message = "User is not exists!";
            bool isSuccess = false;

            if (user.Id != 0)
            {
                if (ModelState.IsValid)
                {

                    _db.User.Update(user);

                    message = "User hase been update!";
                    isSuccess = true;
                }

                if (!ModelState.IsValid)
                {
                    message = "Data is not valid!";
                    isSuccess = false;
                }
            }

            if (user.Id == 0)
            {
                if (_db.User.FirstOrDefault(el => el.Name == user.Name) is not null)
                {
                    message = "User with this name is exists!";

                    return Ok(new { success = isSuccess, message});
                }

                if (ModelState.IsValid)
                {

                    _db.User.Add(user);

                    message = "User hase been added!";
                    isSuccess = true;
                }

                if (!ModelState.IsValid)
                {
                    message = "Data is not valid!";
                    isSuccess = false;
                }
            }
            
            _db.SaveChanges();
            return Ok(new {success = isSuccess, message});
        }

        [HttpDelete]
        public IActionResult Delete([FromBody] int? id)
        {
            string message = "User is not exists!";
            bool isSuccess = false;

            if (id == 0 || id is null) return NotFound();

            User userToDel = _db.User.FirstOrDefault(el => el.Id == id) ?? new();

            if (userToDel is null) return NotFound();

            _db.User.Remove(userToDel);
            _db.SaveChanges();

            message = "User has been deleted!";
            isSuccess = true;

            return Ok(new { success = isSuccess, message });
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult DeleteUsers()
        {
            foreach (var el in _db.User.ToList())
            {
                if (el.Name == "Name")
                {
                    _db.User.Remove(el);
                }
            }

            _db.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}