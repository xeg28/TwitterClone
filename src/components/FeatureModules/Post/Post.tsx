import { Post as PostType } from "../../../types/Post";
import './Post.css';
import { Link } from "react-router-dom";
import { getPostTime } from "../../../helpers/dateHelper";
import { useEffect, useState } from "react";
import { useRef } from "react";
import ProfilePopup from "./ProfilePopup";
import './ProfilePopup.css'
import ProfilePicture from "../../UIElements/ProfilePicture/ProfilePicture";
import { getCurrentUser } from "../../../types/User";
import PostOptions from "./PostOptions";
import Icon from "../../UIElements/Icon/Icon";
import { isLikedPost, likePost, unlikePost } from "../../../api/posts";

interface PostProps {
  post: PostType;
  setPosts: React.Dispatch<React.SetStateAction<PostType[] | undefined>>;
}

const Post: React.FC<PostProps> = ({ post, setPosts, }) => {
  const [showFull, setShowFull] = useState<true | false>(false);
  const profilePicRef = useRef<HTMLAnchorElement | null>(null);
  const profileNamesRef = useRef<HTMLAnchorElement | null>(null);
  const postBtnRef = useRef<HTMLButtonElement | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<true | false>(false);
  const [isRepost, setIsRepost] = useState<true | false>(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (post) {
      setLikes(post.likes ?? 0);
    }
  }, [setLikes, post]);

  useEffect(() => {
    const checkIsLiked = async () => {
      if (!post.id) return;
      const res = await isLikedPost(post.id);
      if (res.ok) {
        const result = await res.json();
        setIsLiked(result.liked);
      }
    }
    checkIsLiked();
  }, [setIsLiked, post.id]);

  const handleLikePost = async () => {
    if (!post.id) return;
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1)
      const res = await unlikePost(post.id);
      if (!res.ok) {

      }
    }
    else {
      setIsLiked(true);
      setLikes((prev) => prev + 1)
      const res = await likePost(post.id);

      if (!res.ok) {
      }
    }
  }

  const postText = (() => {
    if (!post.text) return null;

    const text: string = post.text;
  
    const allLines = text.split('\n');

    const isTooLong = allLines.length > 9 || text.length > 275;

    const previewLines = allLines.slice(0, 9);
    const previewText = previewLines.join('\n');

    // but try to avoid cutting in the middle of a mention
    const finalPreview = previewText.length > 275
      ? previewText.substring(0, 275) + "..."
      : previewText;

    const finalLines = finalPreview.split('\n');

    const renderWithMentions = (line: string) => {
      if (!line.trim()) return line;

      const mentionRegex = /(@[a-zA-Z][a-zA-Z0-9_]{0,14})/g;
      const parts = line.split(mentionRegex);
      return parts.map((part, index) => {
        if (part.startsWith('@') && part.length > 1) {
          const username = part.substring(1);
          return (
            <Link
              key={`mention-${index}-${username}`}
              to={`/profile/${username}`}
            >
              {part}
            </Link>
          );
        }

        return <span key={`text-${index}`}>{part}</span>;
      });
    };
    if (showFull) {
      return allLines.map((line, index) => (
        <span key={index}>
          {renderWithMentions(line)}
          {index < allLines.length - 1 && <br />}
        </span>
      ));
    }

    let truncatedText = text.substring(0, 280);
    const lastSpace = truncatedText.lastIndexOf(' ');
    if (lastSpace > 0) truncatedText = truncatedText.substring(0, lastSpace);

    return (
      <>
        {finalLines.map((line, index) => (
          <span key={index}>
            {renderWithMentions(line)}
            {index < finalLines.length - 1 && <br />}
          </span>
        ))}
        {isTooLong && (
          <>
            <br />
            <button onClick={() => setShowFull(true)} className="show-more">
              Show more
            </button>
          </>
        )}
      </>
    );
  })();


  return (
    <div className="post-container" >
      <div className="post-p-pic">
        <Link to={`/profile/${post.owner?.username}`} ref={profilePicRef}>
          <ProfilePicture url={post.owner?.profilePicUrl} />
        </Link>
        <ProfilePopup user={post.owner} refElement={profilePicRef} />
      </div>
      <div className="flex-1">
        <div className="flex flex-row space-between">
          <div>
            <Link to={`/profile/${post.owner?.username}`} ref={profileNamesRef}>
              <span className="bolder name">{post.owner?.legalName}</span>
              &nbsp;
              <span className="dimm-text">@{post.owner?.username}</span>
            </Link>
            <ProfilePopup user={post.owner}  refElement={profileNamesRef}/>
            <span className="dimm-text">&nbsp;&middot; {getPostTime(post.datePosted)}</span>
          </div>
          <div className="flex flex-row align-center">
            <div>
              {post.id && post.owner &&
                <PostOptions
                  post={post}
                  isOwner={post.owner.id === currentUser?.id}
                  setPosts={setPosts}
                  postBtnRef={postBtnRef}
                />
              }
            </div>
          </div>
        </div>
        <div className='post-text mb-1'>{postText}</div>
        <div className="flex flex-row align-center space-between">
          <div className="post-btn-group">
            <button className="button post-i-btn button-reset">
              <Icon name="comment" />
              <div></div>
            </button>
            <span>0</span>
          </div>
          <div className="post-btn-group repost">
            <button className={`button post-i-btn button-reset ${isRepost ? 'active' : ''}`}>
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
        </div>
      </div>
    </div>
  )
}

export default Post