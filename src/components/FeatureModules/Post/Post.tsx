import { Post as PostType } from "../../../types/Post";
import './Post.css';
import { Link } from "react-router-dom";
import { getPostTime } from "../../../helpers/dateHelper";
import { useRef } from "react";
import ProfilePopup from "./ProfilePopup";
import './ProfilePopup.css'
import ProfilePicture from "../../UIElements/ProfilePicture/ProfilePicture";
import { getCurrentUser } from "../../../types/User";
import PostOptions from "./PostOptions";
import PostInteractions from "./PostInteractions";
import PostText from "./PostText";


interface PostProps {
  post: PostType;
  isThread?: true;
  setPosts?: React.Dispatch<React.SetStateAction<PostType[] | undefined>>;
}

const Post: React.FC<PostProps> = ({ post, setPosts, isThread }) => {
  const profilePicRef = useRef<HTMLAnchorElement | null>(null);
  const profileNamesRef = useRef<HTMLAnchorElement | null>(null);
  const postBtnRef = useRef<HTMLButtonElement | null>(null);
  const currentUser = getCurrentUser();

  return (
    <div className="post-container" >
      <div className="flex flex-col align-center">
        <div className="post-p-pic">
          <Link to={`/profile/${post.owner?.username}`} ref={profilePicRef}>
            <ProfilePicture url={post.owner?.profilePicUrl} />
          </Link>
          <ProfilePopup user={post.owner} refElement={profilePicRef} />
        </div>
        {isThread && (
          <div className="thread-line"></div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex flex-row space-between">
          <div>
            <Link to={`/profile/${post.owner?.username}`} ref={profileNamesRef}>
              <span className="bolder name">{post.owner?.legalName}</span>
              &nbsp;
              <span className="dimm-text">@{post.owner?.username}</span>
            </Link>
            <ProfilePopup user={post.owner} refElement={profileNamesRef} />
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
        <div className='post-text mb-1'>{<PostText text={post.text} linkMentions />}</div>
        <PostInteractions post={post} />
      </div>
    </div>
  )
}

export default Post