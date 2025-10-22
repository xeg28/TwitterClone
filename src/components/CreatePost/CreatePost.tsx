import { useState, useRef } from "react";
import './CreatePost.css';
import { getUser } from "../../types/User";
import { addPost } from "../../api/posts";
import { useAlert } from "../AlertList/AlertContext";
import Icon from "../Icon/Icon";
const CreatePost: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postText, setPostText] = useState<String>();
  const { addAlert } = useAlert();
  const user = getUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    let offset = 107;
    const available = Math.max(100, window.innerHeight - rect.top - offset);

    textarea.style.maxHeight = `${available}px`;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, available) + "px";
  };

  return (
    <div className="w-100 flex align-center justify-content-center">
      <button className= "post-btn-lg" onClick={() => setShowCreatePost(true)}>
        <Icon name="post"/>
        <span>Post</span>
      </button>
      {showCreatePost &&
        (
          <div className="post-popup">
            <div>
              <form onSubmit={handleSubmit}>
                <div className="form-post-wrapper" ref={containerRef}>
                  <div className="popup-header">
                    <button className="close-btn" onClick={() => setShowCreatePost(false)}>
                      <Icon name="close" className="close-icon" />
                    </button>
                  </div>
                  <div className="flex" id="post-form">
                    <div className="icon-img-wrapper">

                    </div>
                    <textarea id="post-text" placeholder="What's happening?" ref={textareaRef} onInput={handleInput}></textarea>
                  </div>
                  <hr />
                  <div className="post-options">
                    <button className="post-btn">{isLoading ? (
                      <div className="spinner"></div>) :
                      (<span>Post</span>)
                    }</button>
                  </div>

                </div>
              </form>

            </div>
          </div>
        )
      }
    </div>
  );
}


export default CreatePost;