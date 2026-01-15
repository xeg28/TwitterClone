import { useState, useRef } from "react";
import './CreatePost.css';
import { getCurrentUser } from "../../types/User";
import { addPost } from "../../api/posts";
import { useAlertActions } from "../AlertList/AlertContext";
import ReactDOM from "react-dom";
import Icon from "../Icon/Icon";
import PopupCard from "../PopupCard/PopupCard";

interface CreatePostProps {
  isMobile: boolean;
}

const CreatePost: React.FC<CreatePostProps> = ({isMobile}) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postText, setPostText] = useState<String>();
  const { addAlert } = useAlertActions();
  const user = getCurrentUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ownerid: user?.id,
      text: postText
    }

    try {
      setIsLoading(true);
      const response = await addPost(data);
      if (response.ok) {
        addAlert("Post created", "success");
        setShowCreatePost(false);
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
    let offset = 115 ;
    const available = Math.max(100, window.innerHeight - rect.top - offset);

    textarea.style.maxHeight = `${available}px`;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, available) + "px";
  };

  return (
    <>
      {!isMobile ? (
        <button className="post-btn-lg" onClick={() => setShowCreatePost(true)}>
          <Icon name="post" />
          <span>Post</span>
        </button>
      ) :
        (
          <button className="post-btn-sm" onClick={() => setShowCreatePost(true)} >
            <Icon name="post" className="icon-svg" />
          </button>
        )
      }
      {showCreatePost && typeof document !== "undefined" && ReactDOM.createPortal(

        <PopupCard setShowPopup={setShowCreatePost}
        >
          <form className="post-form" onSubmit={handleSubmit}>
            <div className="flex post-form-wrapper" >
              <div className="icon-img-wrapper">

              </div>
              <textarea id="post-text"
                placeholder="What's happening?"
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