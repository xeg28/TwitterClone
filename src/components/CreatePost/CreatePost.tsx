import { useState, useRef } from "react";
import './CreatePost.css';
import { getUser } from "../../types/User";
import { addPost } from "../../api/posts";
import { useAlert } from "../AlertList/AlertContext";
import ReactDOM from "react-dom";
import Icon from "../Icon/Icon";
import PopupCard from "../PopupCard/PopupCard";
const CreatePost: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postText, setPostText] = useState<String>();
  const { addAlert } = useAlert();
  const user = getUser();
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
      const result = await response.json();
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
    let offset = 115;
    const available = Math.max(100, window.innerHeight - rect.top - offset);

    textarea.style.maxHeight = `${available}px`;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, available) + "px";
  };

  return (
    <div className="w-100 flex align-center justify-content-center">
      <button className="post-btn-lg" onClick={() => setShowCreatePost(true)}>
        <Icon name="post" />
        <span>Post</span>
      </button>
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
    </div>
  );
}


export default CreatePost;