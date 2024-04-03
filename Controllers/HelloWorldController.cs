using Microsoft.AspNetCore.Mvc;
using HelloWorld.Models;

namespace HelloWorld.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HelloWorldController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { Message = "Hello, World!" });
        }

        [HttpPost("greet")]
        public IActionResult Greet([FromBody] GreetRequest request)
        {
            return Ok(new { Message = $"Hello, {request.Name}!" });
        }
    }
}
