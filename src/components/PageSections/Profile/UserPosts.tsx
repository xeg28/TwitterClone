import { useState, useEffect } from 'react';
import { Post as PostType } from "../../../types/Post";
import { useLocation, useParams } from "react-router-dom";
import { getUserPosts } from '../../../api/posts';
import Post from '../../FeatureModules/Post/Post';
import { useAlertActions } from '../../Utilities/AlertList/AlertContext';
import { usePostsRefresh } from './PostsRefreshContext';
import { useCachedFetch } from '../../../hooks/useCachedFetch';
import { setCache } from '../../../utils/Cache';
import { usePageScrollCache } from '../../../hooks/usePageScrollCache';

const UserPosts: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const cacheKey = `posts-${username}`
  const { data, loading } = useCachedFetch(
    username ? cacheKey : undefined,
    username ? () => getUserPosts(username).then(res => res.json()) : undefined
  );
  const [posts, setPosts] = useState<Array<PostType>>();

  const { addAlert } = useAlertActions();
  const { refreshFlag } = usePostsRefresh();
  const location = useLocation();
  const { restoreScroll } = usePageScrollCache(location.pathname);

  useEffect(() => {
    if (posts && !loading) {
      restoreScroll();
    }
  }, [posts, loading, restoreScroll]);

  useEffect(() => {
    if (data) {
      const userPosts = data as Array<PostType>;
      setPosts(userPosts);
    }
  }, [data])

  useEffect(() => {
    if (!username || loading) return;
    const fetchData = async (username: string) => {
      const response = await getUserPosts(username)
      if (response.ok) {
        const result = await response.json();
        setCache(cacheKey, result);
        setPosts(result);
      }
      else {
        addAlert("Failed to retrieve posts. Try again.", "error");
      }
    }

    fetchData(username);
  }, [username, refreshFlag, addAlert, cacheKey, loading])

  if (!posts) return <div className="mtb-2"><div className="spinner-lt"></div></div>


  return (
    <div className="posts-wrapper">
      {posts.map((post: PostType, index) => (
        <div key={`user-post-${index}`}>
          <Post
            post={post}
          />
        </div>
      ))}
    </div>
  )
}


export default UserPosts;