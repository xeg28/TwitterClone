import Icon from "../Icon/Icon";
import './PopupCard.css';
import { useRef } from "react";

interface PopupCardProps {
  setShowPopup: any,
  popupTitle?: string,
  responsiveText?: React.RefObject<any>,
  children: React.ReactNode
}

const PopupCard: React.FC<PopupCardProps> = ({ setShowPopup, popupTitle, children }) => {

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
                <div className="popup-title">
                  {popupTitle}
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