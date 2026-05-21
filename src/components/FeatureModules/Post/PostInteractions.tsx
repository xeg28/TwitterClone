import { useEffect, useState } from "react";
import { Post } from "../../../types/Post";
import Icon from "../../UIElements/Icon/Icon";
import { likePost, unlikePost } from "../../../api/posts";
import { useNavigate } from "react-router-dom";

interface PostInteractionsProps {
  post: Post;
  isExpanded?: true;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({ post, isExpanded }) => {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean | undefined>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setLikes(post.likes ?? 0);
      setIsLiked(post.isLiked);
    }
  }, [setLikes, post]);

  // Button Handlers
  const handleLikePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.id) return;
    if (isLiked) {
      setLikes((prev) => prev - 1)
      setIsLiked(false);
      const res = await unlikePost(post.id);
      if (!res.ok) {

      }
    }
    else {
      setLikes((prev) => prev + 1)
      setIsLiked(true);
      const res = await likePost(post.id);
      if (!res.ok) {
      }
    }
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    const postComment = post;
    navigate('/compose/post', { state: { postComment } });
  }

  return (
    <div className="flex flex-row align-center space-between">
      <div className="post-btn-group">
        <button className="button post-i-btn button-reset" onClick={handleComment}>
          <Icon name="comment" />
          <div></div>
        </button>
        <span>{post.replies}</span>
      </div>
      <div className="post-btn-group repost">
        <button className={`button post-i-btn button-reset ${post.hasReposted ? 'active' : ''}`}>
          <Icon name="repost" />
          <div></div>
        </button>
        <span>0</span>
      </div>
      <div className="post-btn-group like">
        <button
          className={`button post-i-btn button-reset ${isLiked ? 'active' : ''}`}
          onClick={handleLikePost}
        >
          <Icon name="heart" />
          <div></div>
        </button>
        <span>{likes}</span>
      </div>

      {!isExpanded && (
        <div className="post-btn-group">
          <button
            className={`button post-i-btn button-reset`}
          >
            <Icon name="views" />
            <div></div>
          </button>
          <span>{post.views}</span>
        </div>
      )}

      {isExpanded && (
        <div className="post-btn-group">
          <button
            className={`button post-i-btn button-reset `}
          >
            <Icon name="bookmark" />
            <div></div>
          </button>
          <span>0</span>
        </div>
      )}

      {isExpanded && (
        <div className="post-btn-group">
          <button
            className={`button post-i-btn button-reset `}
          >
            <Icon name="share" />
            <div></div>
          </button>
        </div>
      )}

      {!isExpanded && (
        <div className="flex flex-row gap-1">
          <div className="post-btn-group">
            <button
              className={`button post-i-btn button-reset `}
            >
              <Icon name="bookmark" />
              <div></div>
            </button>
          </div>
          <div className="post-btn-group">
            <button
              className={`button post-i-btn button-reset `}
            >
              <Icon name="share" />
              <div></div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostInteractions;