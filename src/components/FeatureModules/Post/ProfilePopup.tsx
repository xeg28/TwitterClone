import ReactDom from 'react-dom';
import { User } from '../../../types/User';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../../types/User';
import Icon from '../../UIElements/Icon/Icon';

interface ProfilePopupProps {
  user: User | undefined;
  refElement: React.RefObject<HTMLAnchorElement | null>
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ user, refElement }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const showTimer = useRef<NodeJS.Timeout | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const currentUser = getCurrentUser();

  const handleMouseEnter = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (!showPopup) {
      showTimer.current = setTimeout(() => {
        setShowPopup(true);
      }, 500);
    }
  }, [hideTimer, showPopup, setShowPopup]);

  const handleMouseLeave = () => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    hideTimer.current = setTimeout(() => {
      setShowPopup(false);
    }, 250);
  };

  useEffect(() => {
    if (!refElement.current) return;
    const ref = refElement.current;
    ref.addEventListener('mouseenter', handleMouseEnter);
    ref.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      ref.removeEventListener('mouseenter', handleMouseEnter);
      ref.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [refElement, handleMouseEnter]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    if (showPopup && popupRef.current && refElement.current) {
      const rect = refElement.current.getBoundingClientRect();
      const popup = popupRef.current;

      const yOffset = 15;
      const hoverElementCenter = rect.width / 2;
      const popupCenter = popup.clientWidth / 2;
      let centerPos = (rect.left + hoverElementCenter - popupCenter);
      let leftPos = rect.left;
      let bottomPos = rect.bottom + yOffset + window.scrollY;
      let topPos = rect.top + window.scrollY - yOffset - popup.clientHeight;
      if ((bottomPos + popup.clientHeight) > window.innerHeight + window.scrollY) {
        popup.style.top = `${topPos}px`;
      }
      else {
        popup.style.top = `${bottomPos}px`;
        console.log(popup.style.top);
      }
      if (centerPos < 0) {
        popup.style.left = `${leftPos}px`
      }
      else {
        popup.style.left = `${centerPos}px`;
      }
    }
  }, [showPopup, refElement])

  if (typeof document === 'undefined' || !user) return null;

  return ReactDom.createPortal(
    <AnimatePresence>
      {showPopup && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className='profile-popup'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className='p-2'>
            <div className="flex flex-row space-between mb-1">
              <Link
                to={`/profile/${user.username}`}
                className="p-img">
                {(user.profilePicUrl && (
                  <img src={user.profilePicUrl} alt="Profile" />
                )) || <Icon name="profileDefault" />}
              </Link>
              {currentUser?.id !== user.id &&
                (<button className="f-btn">Follow</button>)
              }
            </div>
            <div className='mb-2'>
              <div className="bolder p-name">
                {user.legalName}
              </div>
              <div className="dimm-text p-username">
                @{user.username}
              </div>
            </div>
            <div className="mb-2">
              {user.biography}
            </div>
            <div>
              <span><strong>{user.following}</strong> <span className='dimm-text'>Following</span> &nbsp;&nbsp;</span>
              <span><strong>{user.followers}</strong> <span className='dimm-text'>Followers</span></span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default ProfilePopup;