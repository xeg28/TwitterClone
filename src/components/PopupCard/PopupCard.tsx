import Icon from "../Icon/Icon";
import './PopupCard.css';
import { useRef } from "react";

interface PopupCardProps {
  setShowPopup: any,
  popupTitle?: string,
  onSubmit?: () => void,
  submitText?: string,
  children: React.ReactNode
}

const PopupCard: React.FC<PopupCardProps> = ({ setShowPopup, popupTitle, children, onSubmit, submitText }) => {

  return (
    <div className="popup-card-wrapper">
      <div>
        <div className="card-container">
          <div className="popup-card">
            <div>
              <div className="popup-header">
                <button className="close-btn" onClick={() => setShowPopup(false)}>
                  <Icon name="close" className="close-icon" />
                </button>
                <div className="flex space-between flex-1 align-center plr-1">
                  <div className="popup-title">
                    {popupTitle}
                  </div>
                  {onSubmit && (
                    <button className="popup-btn" onClick={() => onSubmit()}>
                      {submitText ?? "Save"}
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
    </div>
  )
}

export default PopupCard;