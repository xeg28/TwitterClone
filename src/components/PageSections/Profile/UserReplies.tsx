import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Post as PostType } from "../../../types/Post";
import { getUserPostWithReplies } from "../../../api/posts";
import Post from "../../FeatureModules/Post/Post";
import { usePostsRefresh } from "./PostsRefreshContext";
import { useCachedFetch } from "../../../hooks/useCachedFetch";
import { setCache } from "../../../utils/Cache";
import { usePageScrollCache } from "../../../hooks/usePageScrollCache";

const UserReplies: React.FC = () => {

  const { username } = useParams<{ username: string }>();
  const cacheKey = `userReplies-${username}`
  const { data, loading } = useCachedFetch(
    username ? cacheKey : undefined,
    username ? () => getUserPostWithReplies(username).then(res => res.json()) : undefined
  );
  const [postReplies, setPostReplies] = useState<Array<PostType>>();
  const { refreshFlag } = usePostsRefresh();

  const location = useLocation();
  const { restoreScroll } = usePageScrollCache(location.pathname);

  useEffect(() => {
    if (postReplies && !loading) {
      restoreScroll();
    }
  }, [postReplies, loading, restoreScroll]);

  useEffect(() => {
    if (data) {
      const userPosts = data as Array<PostType>;
      setPostReplies(userPosts);
    }
  }, [data]);

  useEffect(() => {
    if (!username || loading) return;

    const fetchData = async () => {
      const res = await getUserPostWithReplies(username);
      if (res.ok) {
        const result = await res.json();
        setCache(cacheKey, result);
        setPostReplies(result);
      }
    }

    fetchData()
  }, [username, refreshFlag, cacheKey, loading])
  if (!postReplies) return <div className="mtb-2"><div className="spinner-lt"></div></div>
  return (
    <div className="posts-wrapper">
      {postReplies?.map((postReply: PostType, index) => (
        <div className="post-reply" key={`user-post-with-reply-${index}`}>
          {postReply.grandparent && (
            <Post post={postReply.grandparent} isThread />
          )}
          {postReply.parent && (
            <Post post={postReply.parent} isThread />
          )}
          {postReply && (
            <Post post={postReply} />
          )}
        </div>
      ))}
    </div>
  )
}

export default UserReplies;