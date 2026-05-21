using System;
using Microsoft.Extensions.Caching.Memory;
using TwitterClone.Data;

namespace TwitterClone.Services
{
    public class ViewFlushService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IMemoryCache _cache;

        public ViewFlushService(IServiceScopeFactory scopeFactory, IMemoryCache cache)
        {
            _scopeFactory = scopeFactory;
            _cache = cache;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

                using var scope = _scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetService<TwitterCloneContext>()!;

                var dirtyPosts = ViewService.GetDirtyPosts();

                foreach (var postId in dirtyPosts)
                {
                    string key = $"post_views:{postId}";

                    if (!_cache.TryGetValue(key, out int count) || count == 0)
                        continue;

                    var post = await context.Posts.FindAsync(postId);
                    if (post != null)
                    {
                        post.Views += count;
                    }

                    _cache.Remove(key);
                    ViewService.ClearDirtyPost(postId);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
