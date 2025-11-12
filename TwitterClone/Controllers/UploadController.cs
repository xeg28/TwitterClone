using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TwitterClone.Data;
using TwitterClone.Services;

namespace TwitterClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly Cloudinary _cloudinary;
        private readonly TwitterCloneContext _context;
        public UploadController(CloudinaryService cloudinaryService, TwitterCloneContext context)
        {
            _cloudinary = cloudinaryService.GetInstance();
            _context = context;
        }

        [HttpPost("image/profile")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            Request.Cookies.TryGetValue("userId", out var userIdString);
            if (userIdString == null)
                return Unauthorized(new { status = 401, message = "You are unauthorized to edit this resource" });
            var user = await _context.Users.FindAsync(int.Parse(userIdString));
            
            if (user == null) return NotFound();
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                Folder = "my_app/images/profile"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            var url = uploadResult.SecureUrl.ToString();

            if(user.ProfilePicUrl != null)
            {
                Uri uri = new Uri(user.ProfilePicUrl);
                string path = uri.LocalPath;
                string filename = System.IO.Path.GetFileNameWithoutExtension(path);
                var res = await DeleteImage(filename ?? "");
                if(!res)
                    return StatusCode(500, new { message="Server error while uploading, try again." });
            }
   
            Uri newUri = new Uri(url);

        
            string filePath = newUri.LocalPath;
     
            string pathWithNewExtension = Path.ChangeExtension(filePath, ".webp");
       
            string newUrl = newUri.Scheme + "://" + newUri.Authority + pathWithNewExtension + newUri.Query;

            user.ProfilePicUrl = newUrl;
            await _context.SaveChangesAsync();
            return Ok(new { url });
        }

        private async Task<bool> DeleteImage(string publicId)
        {
            if (string.IsNullOrEmpty(publicId))
                return false;

            // Ensure no file extension in ID (optional safety)
            publicId = publicId.Replace(".jpg", "").Replace(".png", "");

            var deletionParams = new DeletionParams("my_app/images/profile/" + publicId)
            {
                ResourceType = ResourceType.Image // can also be Video, Raw, etc.
            };

            var result = await _cloudinary.DestroyAsync(deletionParams);

            return result.Result == "ok";

        }

        [HttpPost("video")]
        public async Task<IActionResult> UploadVideo(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadParams = new VideoUploadParams
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                Folder = "my_app/videos"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return Ok(new { url = uploadResult.SecureUrl.ToString() });
        }
    }
}
