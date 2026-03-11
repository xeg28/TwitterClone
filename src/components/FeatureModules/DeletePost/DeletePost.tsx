import ConfirmDialog, {ConfirmDialogProps} from "../../Popups/ConfirmDialog/ConfirmDialog"
import { deletePost } from "../../../api/posts";
import { useAlertActions } from "../../Utilities/AlertList/AlertContext";
import { Post } from "../../../types/Post";

interface DeletePostProps {
  postId:string | number,
  setShow: React.Dispatch<React.SetStateAction<boolean | undefined>>,
  onCloseContextMenu: () => void,
  setPosts: React.Dispatch<React.SetStateAction<Post[] | undefined>>,
}
const DeletePost:React.FC<DeletePostProps>  = ({postId, setShow, setPosts, onCloseContextMenu}) => {
  const {addAlert}= useAlertActions();
  const delPost = async () => {
    if(!postId) return;
    const res = await deletePost(postId);
    if(!res.ok) {
      const result = await res.json();
      addAlert(result.message ?? "Error deleting post", "error");
      setShow(false);
    }
    else {
      setPosts(prev => prev?.filter(post => post.id !== postId));
      addAlert("Post Deleted", 'success');
      onCloseContextMenu();
    }

  }
  
  const confirmDialogProps:ConfirmDialogProps | null = {
    trigger: () => true,
    onConfirm: delPost,
    onDeny: () => {setShow(false);},
    title:"Delete Post?",
    dialog: "This can’t be undone and it will be removed from your profile.",
    type:"discard",
    confirmText: "Delete",

  };


  return <ConfirmDialog {...confirmDialogProps} ></ConfirmDialog>; 
}

export default DeletePost;