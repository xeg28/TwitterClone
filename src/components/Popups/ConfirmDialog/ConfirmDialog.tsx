import './ConfirmDialog.css'
import ReactDom from 'react-dom';
export interface ConfirmDialogProps {
  trigger: () => boolean;
  onConfirm: () => void;
  onDeny?: () => void;
  confirmText?: string;
  denyText?: string;
  title: string;
  dialog: string;
  type: "discard" | "save";
}
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ onConfirm, onDeny, confirmText, denyText, title, dialog, type }) => {
  if (typeof document === "undefined") return null;
  return ReactDom.createPortal(
    <div className="confirm-popup">
      <div>
        <div className="confirm-card">
          <div className="mb-2">
            <div className="fs-lg bolder mtb-1 lh-1">{title}</div>
            <div className="fs-m dimm-text">{dialog}</div>
          </div>
          <div className='flex flex-col gap-1'>
            <button className={`main-btn confirm-btn ${type}`} onClick={onConfirm}>{confirmText ?? "Discard"}</button>
            <button className='main-btn' onClick={onDeny}>{denyText ?? "Cancel"}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ConfirmDialog;