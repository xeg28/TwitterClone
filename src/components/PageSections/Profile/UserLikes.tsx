import { useEffect, useState } from "react";
import { Post as PostType } from "../../../types/Post";
import { useLocation, useParams } from "react-router-dom";
import { getUserLikedPost } from "../../../api/posts";
import { useAlertActions } from "../../Utilities/AlertList/AlertContext";
import Post from "../../FeatureModules/Post/Post";
import { useCachedFetch } from "../../../hooks/useCachedFetch";
import { usePageScrollCache } from "../../../hooks/usePageScrollCache";

const UserLikes: React.FC = () => {
  const [posts, setPosts] = useState<Array<PostType>>();
  const { username } = useParams<{ username: string }>();
  const cacheKey = `userLikes-${username}`;
  const { data, loading } = useCachedFetch(
    username ? cacheKey : undefined,
    username ? () => getUserLikedPost(username).then(res => res.json()) : undefined
  );
  const location = useLocation();
  const { restoreScroll } = usePageScrollCache(location.pathname);

  useEffect(() => {
    if (posts && !loading) {
      restoreScroll();
    }
  }, [posts, loading, restoreScroll]);

  useEffect(() => {
    if (data) {
      const likedPosts = data as Array<PostType>;
      setPosts(likedPosts);
    }
  }, [data])

  if (!posts) return <div className="mtb-2"><div className="spinner-lt"></div></div>
  if (posts.length === 0) return <h3 className="text-center">User has no likes</h3>
  return (
    <div className="posts-wrapper">
      {posts?.map((post, index) => (
        <div key={`user-liked-post-${index}`}>
          <Post
            post={post}
          />
        </div>
      ))}
    </div>
  )
}

export default UserLikes;