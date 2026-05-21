using Microsoft.Extensions.Caching.Memory;

namespace TwitterClone.Services
{

    public interface IViewService
    {
        void AddView(int postId, string? userId, string? ipAddress);
        int GetCachedViews(int postId);
    }
    public class ViewService : IViewService
    {
        private readonly IMemoryCache _cache;

        // Track which posts have pending updates
        private static readonly HashSet<int> _dirtyPosts = new();

        public ViewService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public void AddView(int postId, string? userId, string? ipAddress)
        {
            // 🔒 Prevent duplicate views 
            string viewerKey = $"viewed:{userId ?? ipAddress}:{postId}";

            if (_cache.TryGetValue(viewerKey, out _))
                return;

            _cache.Set(viewerKey, true, TimeSpan.FromMinutes(10));

            // 📈 Increment cached view count
            string key = GetPostKey(postId);

            int current = _cache.GetOrCreate(key, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
                return 0;
            });

            _cache.Set(key, current + 1);

            lock (_dirtyPosts)
            {
                _dirtyPosts.Add(postId);
            }
        }

        public int GetCachedViews(int postId)
        {
            return _cache.TryGetValue(GetPostKey(postId), out int count)
                ? count
                : 0;
        }

        public static IEnumerable<int> GetDirtyPosts()
        {
            lock (_dirtyPosts)
            {
                return _dirtyPosts.ToList();
            }
        }

        public static void ClearDirtyPost(int postId)
        {
            lock (_dirtyPosts)
            {
                _dirtyPosts.Remove(postId);
            }
        }

        private string GetPostKey(int postId) => $"post_views:{postId}";
    }
}
