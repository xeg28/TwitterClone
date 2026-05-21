import { useNavigate, Location, useLoaderData, useLocation } from "react-router-dom";
import { getPrevious, goBack } from "../../../utils/NavigationHistory";
import Topbar from "../../Layout/Topbar/Topbar";
import Post from "../../FeatureModules/Post/Post";
import { Post as PostType } from "../../../types/Post";
import { useEffect, useState } from "react";
import { getPost } from "../../../api/posts";
import { useAlertActions } from "../../Utilities/AlertList/AlertContext";
import PostReplies from "./PostReplies";
import './PostExpanded.css';

interface PostExpandedProps {
  
}

const PostExpanded:React.FC<PostExpandedProps> = ({}) => {
  const navigate = useNavigate();
  const [post, setPost] = useState<PostType>();
  const {addAlert} = useAlertActions();
  const location = useLocation();
  const handleBack = () => {
    const prevRoute = goBack();;
    navigate(prevRoute ?? '/');
  }

  useEffect(() => {

    const fetchData = async () => {
      const match = location.pathname.match(/^\/post\/([^/]+)\/([^/]+)$/);
      const id = match ? match[2] : undefined;
      if(!id) return;
      const res = await getPost(id);

      if(res.ok) {
        const result = await res.json();
        setPost(result);
      }
      else {
        addAlert("Failed to retrieve post, try again.", "error");
      }
    }

    if(location.state && location.state.post) {
      setPost(location.state.post);
    }
    else {
      fetchData();
    }
  }, [])

  return (
    <div>
      <Topbar handleBack={handleBack}>
        <div className="ml-2 fs-lg bolder">Post</div>
      </Topbar>
      {post ? (
        <Post post={post} isExpanded/>
      ): (
        <div className="mtb-2"><div className="spinner-lt"></div></div>
      )}
      {post && post.id && (
        <PostReplies postId={post.id} />
      )}
    </div>
  );
}

export default PostExpanded;