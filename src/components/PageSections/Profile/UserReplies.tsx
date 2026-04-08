import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post as PostType } from "../../../types/Post";
import { getUserPostWithReplies } from "../../../api/posts";
import Post from "../../FeatureModules/Post/Post";
import { usePostsRefresh } from "./PostsRefreshContext";

const UserReplies:React.FC = () => {

  const { username } = useParams<{ username: string }>();
  const [postReplies, setPostReplies] = useState<PostType[]>();
  const {refreshFlag} = usePostsRefresh();
  useEffect(() => {
    if(!username) return;

    const fetchData = async () => {
      const res = await getUserPostWithReplies(username);
      if(res.ok) {
        const result = await res.json();
        setPostReplies(result);
      }
    }

    fetchData()
  }, [username, refreshFlag])
  if (!postReplies) return <div className="mtb-2"><div className="spinner-lt"></div></div>
  return (
    <div className="posts-wrapper">
      {postReplies?.map((postReply: PostType, index) => (
        <div className="post-reply" key={`user-post-with-reply-${index}`}>
          {postReply.grandparent && (
            <Post post={postReply.grandparent} setPosts={setPostReplies}isThread/>
          )}
          {postReply.parent && (
            <Post post={postReply.parent} setPosts={setPostReplies} isThread/>
          )}
          {postReply && (
            <Post post={postReply} setPosts={setPostReplies} />
          )}
        </div>
      ))}
    </div>
  )
}

export default UserReplies;