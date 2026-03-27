import { useEffect, useState } from "react";
import { Post as PostType} from "../../../types/Post";
import { useParams } from "react-router-dom";
import { getUserLikedPost } from "../../../api/posts";
import { useAlertActions } from "../../Utilities/AlertList/AlertContext";
import Post from "../../FeatureModules/Post/Post";

const UserLikes:React.FC = () => {
  const [posts, setPosts] = useState<Array<PostType>>();
  const { username } = useParams<{ username: string }>();
  const {addAlert} = useAlertActions(); 

  useEffect(() => {
    if(!username) return;
    const fetchData = async () => {
      const res = await getUserLikedPost(username);
      if(res.ok) {
        const result = await res.json();
        setPosts(result);
      }
      else {
        addAlert("Failed to retrieve posts. Try again.", 'error');
      }
    }
    fetchData();
  }, [])

  if (!posts) return <div className="mtb-2"><div className="spinner-lt"></div></div>
  if(posts.length === 0) return <h3 className="text-center">User has no likes</h3>
  return (
    <div>
      {posts?.map((post, index) => (
        <div key={`user-liked-post-${index}`}>
          <Post 
            post={post}
            setPosts={setPosts}
          />
        </div>
      ))}
    </div>
  )
}

export default UserLikes;