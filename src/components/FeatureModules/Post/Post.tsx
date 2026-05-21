import { Post as PostType } from "../../../types/Post";
import './Post.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getPostDateTime, getPostTime } from "../../../helpers/dateHelper";
import { useRef, useEffect } from "react";
import ProfilePopup from "./ProfilePopup";
import './ProfilePopup.css'
import ProfilePicture from "../../UIElements/ProfilePicture/ProfilePicture";
import { getCurrentUser } from "../../../types/User";
import PostOptions from "./PostOptions";
import PostInteractions from "./PostInteractions";
import PostText from "./PostText";
import { viewPost } from "../../../api/posts";
import { usePageScrollCache } from "../../../hooks/usePageScrollCache";


interface PostProps {
  post: PostType;
  isThread?: true;
  isExpanded?: true;
}

const Post: React.FC<PostProps> = ({ post, isThread, isExpanded }) => {
  const profilePicRef = useRef<HTMLAnchorElement | null>(null);
  const profileNamesRef = useRef<HTMLAnchorElement | null>(null);
  const postBtnRef = useRef<HTMLButtonElement | null>(null);
  const postContainerRef = useRef<HTMLDivElement | null>(null);
  const hasViewedRef = useRef<boolean>(false);
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { saveScroll } = usePageScrollCache(location.pathname);

  // Intersection Observer for view tracking
  useEffect(() => {
    const addView = async () => {
      if (!post.id || hasViewedRef.current) return;
      hasViewedRef.current = true;
      const res = await viewPost(post.id);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          addView();
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (postContainerRef.current) {
      observer.observe(postContainerRef.current);
    }

    return () => {
      if (postContainerRef.current) {
        observer.unobserve(postContainerRef.current);
      }
    };
  }, [post.id]);

  const handlePostClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a link, button, or interactive element
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button')
    ) {
      return;
    }
    saveScroll();
    navigate(`/post/${post.owner?.username}/${post.id}`, { state: { post } });
  }

  const handlePostEnter = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      const target = e.target as HTMLElement;

      // If Enter is pressed on a link or button, trigger click
      if (target.tagName === 'A') {
        target.click();
        return;
      }

      const link = target.closest('a');
      const button = target.closest('button');
      if (link) {
        link.click();
        return;
      }
      if (button) {
        return;
      }
      saveScroll();
      // Otherwise navigate to post
      navigate(`/post/${post.owner?.username}/${post.id}`, { state: { post } });
    }
  }

  return (
    <div
      className={`post-container ${isExpanded ? 'expanded' : ''}`}
      ref={postContainerRef}
      {...isExpanded === undefined && { onClick: handlePostClick, tabIndex: 0, onKeyUp: handlePostEnter }}>
      <div className={`flex ${isExpanded ? 'flex-row gap-1' : 'flex-col align-center'} `}>
        <div className="post-p-pic">
          <Link to={`/profile/${post.owner?.username}`} ref={profilePicRef} >
            <ProfilePicture url={post.owner?.profilePicUrl} />
          </Link>
          <ProfilePopup user={post.owner} refElement={profilePicRef} />
        </div>
        {isExpanded && (
          <div className="flex flex-row space-between flex-1">
            <Link
              to={`/profile/${post.owner?.username}`} ref={profileNamesRef}>
              <span className="bolder name">{post.owner?.legalName}</span>
              <br />
              <span className="dimm-text">@{post.owner?.username}</span>
            </Link>
            <ProfilePopup user={post.owner} refElement={profileNamesRef} />
            <div>
              {post.id && post.owner &&
                <PostOptions
                  post={post}
                  isOwner={post.owner.id === currentUser?.id}
                  postBtnRef={postBtnRef}
                />
              }
            </div>
          </div>
        )}
        {isThread && (
          <div className="thread-line"></div>
        )}
      </div>
      <div className="flex-1">
        {!isExpanded && (
          <div className="flex flex-row space-between">
            <div>
              <Link
                to={`/profile/${post.owner?.username}`} ref={profileNamesRef}>
                <span className="bolder name">{post.owner?.legalName}</span>
                <span>&nbsp;</span>
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
                    postBtnRef={postBtnRef}
                  />
                }
              </div>
            </div>
          </div>
        )}
        <div className={`${isExpanded ? 'expanded' : ''} post-text mb-1`}>{<PostText text={post.text} linkMentions isExpanded={isExpanded} />}</div>
        {isExpanded && <div className="post-info">
          <span className="dimm-text">
            {getPostDateTime(post.datePosted)}
            &nbsp;&middot;&nbsp;
          </span>
          <span>
            <strong>{post.views}</strong>
            &nbsp;
            <span className="dimm-text">Views</span>
          </span>
        </div>}
        <PostInteractions post={post} isExpanded={isExpanded} />
      </div>
    </div>
  )
}

export default Post