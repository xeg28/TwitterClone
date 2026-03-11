import Icon from "../../UIElements/Icon/Icon";
import './PopupCard.css';
import ConfirmDialog, { ConfirmDialogProps } from "../ConfirmDialog/ConfirmDialog";
import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';

interface PopupCardProps {
  setShowPopup: any,
  popupTitle?: string,
  onSubmit?: () => void,
  submitText?: string,
  children: React.ReactNode,
  confirmDialogProps?: ConfirmDialogProps,
  isLoading?: boolean
}

const PopupCard: React.FC<PopupCardProps> = ({ setShowPopup, popupTitle, children, onSubmit, submitText, confirmDialogProps, isLoading }) => {
  const [showConfirmation, setShowConfirmation] = useState<true | false>(false);
  useEffect(() => {
    document.body.classList.add("no-scroll");
    if (confirmDialogProps) {
      confirmDialogProps.onDeny = () => setShowConfirmation(false);
    }
    return () => {
      document.body.classList.remove("no-scroll");
    }
  }, [confirmDialogProps])


  const handleClose = () => {
    if (!confirmDialogProps) {
      setShowPopup(false)
      return;
    }
    else if (confirmDialogProps.trigger()) {
      setShowConfirmation(true);
    }
    else {
      setShowPopup(false);
    }
  }
  return (
    <div className="popup-card-wrapper">
      <div>
        <div className="card-container">
          <div className="popup-card">
            <div>
              <div className="popup-header">
                <button className="close-btn" onClick={handleClose}>
                  <Icon name="close" className="close-icon" />
                </button>
                <div className="flex space-between flex-1 align-center plr-1">
                  <div className="popup-title">
                    {popupTitle}
                  </div>
                  {onSubmit && (
                    <button className="popup-btn" onClick={() => onSubmit()}>
                      {!isLoading ?
                        (<span>{submitText ?? "Save"}</span>) :
                        (
                          <div className="spinner"></div>
                        )
                      }
                    </button>
                  )}
                </div>
              </div>
              <div className="popup-content">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmation && confirmDialogProps
        && (<ConfirmDialog {...confirmDialogProps} />)}
    </div>
  )
}

export default PopupCard;