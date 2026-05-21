import { useEffect, useState } from "react";
import { Post as PostType } from "../../../types/Post";
import { getPostReplies } from "../../../api/posts";
import { useAlertActions } from "../../Utilities/AlertList/AlertContext";
import Post from "../../FeatureModules/Post/Post";

interface PostRepliesProps {
  postId: number;
}
const PostReplies: React.FC<PostRepliesProps> = ({ postId }) => {
  const [replies, setReplies] = useState<Array<PostType>>();
  const { addAlert } = useAlertActions();
  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;
      const res = await getPostReplies(postId);
      if (res.ok) {
        setReplies(await res.json());
      }
      else {
        addAlert("Failed to load replies. Try again.", "error");
      }
    }

    fetchData();
  }, [setReplies])

  return (
    <div className="posts">
      {!replies ? (
        <div className="mtb-2"><div className="spinner-lt"></div></div>
      ) : (
        <div className="posts-wrapper">
          {
            replies.map((reply, index) => (
              <div key={`post-reply-${index}`}>
                <Post post={reply} />
              </div>
            ))
          }
        </div>
      )}

    </div>
  )
}

export default PostReplies;