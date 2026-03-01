import { Post as PostType } from "../../../types/Post";
import Icon from "../../UIElements/Icon/Icon";
import './Post.css';
import { Link } from "react-router-dom";
import { getPostTime } from "../../../helpers/dateHelper";
import { useState } from "react";
import { useRef } from "react";
import ProfilePopup from "./ProfilePopup";
import './ProfilePopup.css'
interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [showFull, setShowFull] = useState(false);
  const profilePicRef = useRef<HTMLAnchorElement | null>(null);

  const postText = (() => {
    if (!post.text) return null;

    const text: string = post.text;
    const lines = text.split('\n');

    if (showFull) {
      return lines.map((line, index) => (
        <span key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ));
    }

    let truncatedText = text.substring(0, 280);
    const lastSpace = truncatedText.lastIndexOf(' ');
    if (lastSpace > 0) truncatedText = truncatedText.substring(0, lastSpace);

    const previewLines = truncatedText.split('\n').slice(0, 9);
    const needsShowMore = lines.length > 9 || text.length > 275;

    return (
      <>
        {previewLines.map((line, index) => (
          <span key={index}>
            {line}
            {index < previewLines.length - 1 && <br />}
          </span>
        ))}
        {needsShowMore && (
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
    <div className="post-container">
      <div className="post-p-pic">
        <Link to={`/profile/${post.owner?.username}`} ref={profilePicRef}>
          {(post.owner && post.owner.profilePicUrl && (
            <img src={post.owner.profilePicUrl} alt="Profile" />
          )) || <Icon name="profileDefault" />}
        </Link>
        <ProfilePopup user={post.owner} refElement={profilePicRef}/>
      </div>
      <div className="flex-1">
        <Link to={`/profile/${post.owner?.username}`}>
          <span className="bolder name">{post.owner?.legalName}</span>
          &nbsp;
          <span className="dimm-text">@{post.owner?.username}</span>
        </Link>
        <span className="dimm-text">&nbsp;&middot; {getPostTime(post.datePosted)}</span>
        <div className='post-text'>{postText}</div>
      </div>
    </div>
  )
}

export default Post