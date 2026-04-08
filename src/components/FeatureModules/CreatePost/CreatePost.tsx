import { useState, useRef, useEffect } from "react";
import './CreatePost.css';
import ReactDOM from "react-dom";
import { useAlertActions } from "../../Utilities/AlertList/AlertContext";
import { getCurrentUser } from "../../../types/User";
import { addPost } from "../../../api/posts";
import PopupCard from "../../Popups/PopupCard/PopupCard";
import ProfilePicture from "../../UIElements/ProfilePicture/ProfilePicture";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrent } from "../../../utils/NavigationHistory";
import { Post } from "../../../types/Post";
import PostText from "../Post/PostText";
import { usePostsRefresh } from "../../PageSections/Profile/PostsRefreshContext";


const CreatePost: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [postText, setPostText] = useState<String>();
  const [postComment, setPostComment] = useState<Post>();
  const { addAlert } = useAlertActions();
  const user = getCurrentUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerRefresh } = usePostsRefresh();

  useEffect(() => {
    if (location.state) {
      if (location.state.postComment) {
        setPostComment(location.state.postComment);
      }
    }
  }, [location.state])


  const refreshUserPosts = () => {
    const pattern = /^\/profile\/(?<username>[\w-]+)(?:\/.*)?/;
    const match = getCurrent()?.match(pattern);
    if (match && match.groups) {
      const username = match.groups.username;
      if (username === user?.username) triggerRefresh();
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ownerid: user?.id,
      text: postText,
      rootId: postComment ? postComment.rootId : null,
      parentId: postComment ? postComment.id : null,
    }

    try {
      setIsLoading(true);
      const response = await addPost(data);
      if (response.ok) {
        refreshUserPosts();

        addAlert("Post created", "success");

        navigate(getCurrent() ?? '/');
      }
      else {
        addAlert("An error occurred while creating post, try again.", "error");
      }
    }
    catch (e: any) {
      console.error(e.message);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    setPostText(textarea.value);

    const rect = textarea.getBoundingClientRect();
    let offset = 115;
    const available = Math.max(100, window.innerHeight - rect.top - offset);

    textarea.style.maxHeight = `${available}px`;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, available) + "px";
  };

  return (
    <>
      {typeof document !== "undefined" && ReactDOM.createPortal(

        <PopupCard closePopup={() => { navigate(getCurrent() ?? '/') }}
        >
          <form className="post-form" onSubmit={handleSubmit}>
            {postComment && postComment.owner && (
              <div className="flex flex-row mb-2 gap-1">
                <div className="flex flex-col">
                  <div className="icon-img-wrapper">
                    <ProfilePicture url={postComment.owner?.profilePicUrl} />
                  </div>
                  <div className="flex flex-1 justify-content-center">
                    <div className="reply-line"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div>
                    <span className="bolder">
                      {postComment.owner.legalName} &nbsp;
                    </span>
                    <span className="dimm-text">
                      @{postComment.owner.username}
                    </span>
                  </div>
                  <div className="mb-2">
                    <PostText text={postComment.text} />
                  </div>
                  <div className="dimm-text pb-2">Replying to&nbsp;
                    <Link className="recipients" to="#">
                      @{postComment.owner.username}
                    </Link>
                  </div>
                </div>
              </div>
            )}
            <div className="flex post-form-wrapper" >
              <div className="icon-img-wrapper">
                <ProfilePicture url={user?.profilePicUrl} />
              </div>
              <textarea id="post-text"
                placeholder={postComment ? "Post your reply" : "What's happening?"}
                ref={textareaRef}
                required
                onInput={handleInput}></textarea>
            </div>
            <hr />
            <div className="post-options">
              <button className="popup-btn">{isLoading ? (
                <div className="spinner"></div>) :
                (<span>Post</span>)
              }</button>
            </div>
          </form>
        </PopupCard>
        ,
        document.body
      )
      }
    </>
  );
}


export default CreatePost;