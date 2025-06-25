namespace TwitterClone.Services
{
    using Microsoft.Extensions.Hosting;
    using Microsoft.EntityFrameworkCore;
    using TwitterClone.Data;
    public class EmailVerificationCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _interval = TimeSpan.FromHours(1);

        public EmailVerificationCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<TwitterCloneContext>();
                    var expired = await context.EmailVerifications
                        .Where(v => v.Expiry < DateTime.UtcNow)
                        .ToListAsync(stoppingToken);

                    if (expired.Any())
                    {
                        context.EmailVerifications.RemoveRange(expired);
                        await context.SaveChangesAsync(stoppingToken);
                    }
                }
                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}
