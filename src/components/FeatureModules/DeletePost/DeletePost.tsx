import ConfirmDialog, { ConfirmDialogProps } from "../../Popups/ConfirmDialog/ConfirmDialog"
import { deletePost } from "../../../api/posts";
import { useAlertActions } from "../../Utilities/AlertList/AlertContext";
import { Post } from "../../../types/Post";
import { usePostsRefresh } from "../../PageSections/Profile/PostsRefreshContext";

interface DeletePostProps {
  postId: string | number,
  setShow: React.Dispatch<React.SetStateAction<boolean | undefined>>,
  onCloseContextMenu: () => void,
  setPosts: React.Dispatch<React.SetStateAction<Post[] | undefined>>,
}
const DeletePost: React.FC<DeletePostProps> = ({ postId, setShow, setPosts, onCloseContextMenu }) => {
  const { addAlert } = useAlertActions();
  const {triggerRefresh} = usePostsRefresh();
  const delPost = async () => {
    if (!postId) return;
    const res = await deletePost(postId);
    if (!res.ok) {
      const result = await res.json();
      addAlert(result.message ?? "Error deleting post", "error");
      setShow(false);
    }
    else {
      setPosts((prev) => {
       var postToDel = undefined as Post | undefined; 
        prev?.forEach((post) => {
          if (post.id === postId && post.parent) {
            post = post.parent;
          } if (post.id === postId) {
            postToDel = post;
          }
          else if (post.parent && post.parent.id === postId) post.parent = undefined;
          else if (post.grandparent && post.grandparent.id === postId) post.grandparent = undefined;
        })
        prev?.filter(post => post !== postToDel)
        return prev;
      });
      triggerRefresh();
      addAlert("Post Deleted", 'success');
      onCloseContextMenu();
    }

  }

  const confirmDialogProps: ConfirmDialogProps | null = {
    trigger: () => true,
    onConfirm: delPost,
    onDeny: () => { setShow(false); },
    title: "Delete Post?",
    dialog: "This can’t be undone and it will be removed from your profile.",
    type: "discard",
    confirmText: "Delete",

  };


  return <ConfirmDialog {...confirmDialogProps} ></ConfirmDialog>;
}

export default DeletePost;