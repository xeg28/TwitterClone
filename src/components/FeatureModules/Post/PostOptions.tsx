import { Post } from "../../../types/Post"
import Icon from "../../UIElements/Icon/Icon";
import ContextMenu, { MenuOption } from "../../Utilities/ContextMenu/ContextMenu";
import DeletePost from "../DeletePost/DeletePost";

interface PostOptionsProps {
  post: Post;
  isOwner: boolean;
  setPosts?: React.Dispatch<React.SetStateAction<Post[] | undefined>>;
  postBtnRef: React.RefObject<HTMLButtonElement | null>;
}
const PostOptions: React.FC<PostOptionsProps> = ({ post, isOwner, setPosts, postBtnRef }) => {
  const options: MenuOption[] = (() => {
    if (!post.id) return [];
    let menuOptions: MenuOption[] = [];
    if (isOwner && setPosts) {
      menuOptions.push({
        id: "DeletePost",
        text: "Delete",
        ActionElement: <DeletePost
          postId={post.id}
          setShow={() => { }}
          onCloseContextMenu={() => { }}
          setPosts={setPosts}
        />,
        className: "red-text",
        icon: "delete"
      });
    }
    return menuOptions;
  })();

  return (
    <ContextMenu
      options={[...options]}
      targetRef={postBtnRef}
      trigger={({ onClick, ref }) => (
        <div className="post-btn-group" >
          <button className="post-i-btn button-reset" onClick={onClick} ref={ref}>
            <Icon name="moreSm" />
            <div></div>
          </button>
        </div>
      )}
      dynamic
      closeBtn
    />
  );
}

export default PostOptions;