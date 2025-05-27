using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TwitterClone.Models.TwitterClone.Models;
using TwitterClone.Services;

namespace TwitterClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailsController : ControllerBase
    {
        private readonly IEmailService emailService;
        public EmailsController(IEmailService emailService)
        {
            this.emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            await emailService.SendEmail(request.To, request.Subject, request.Body);
            return Ok();
        }

    }
}
