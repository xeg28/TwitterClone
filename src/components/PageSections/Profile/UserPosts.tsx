import { useState, useEffect } from 'react';
import { Post as PostType } from "../../../types/Post";
import { useParams } from "react-router-dom";
import { getUserPosts } from '../../../api/posts';
import Post from '../../FeatureModules/Post/Post';
import { useAlertActions } from '../../Utilities/AlertList/AlertContext';
import { usePostsRefresh } from './PostsRefreshContext';

const UserPosts: React.FC = () => {
  const [posts, setPosts] = useState<Array<PostType>>();
  const { username } = useParams<{ username: string }>();
  const { addAlert } = useAlertActions();
  const {refreshFlag} = usePostsRefresh();
  useEffect(() => {
    if (!username) return;
    const fetchData = async (username: string) => {
      const response = await getUserPosts(username)
      if (response.ok) {
        const result = await response.json();
        setPosts(result);
      }
      else {
        addAlert("Failed to retrieve posts. Try again.", "error");
      }
    }

    fetchData(username);
  }, [username, refreshFlag, addAlert])

  if (!posts) return <div className="mtb-2"><div className="spinner-lt"></div></div>


  return (
    <div className="posts-wrapper">
      {posts.map((post: PostType, index) => (
        <div key={`user-post-${index}`}>
          <Post
            post={post}
            setPosts={setPosts}
          />
        </div>
      ))}
    </div>
  )
}


export default UserPosts;