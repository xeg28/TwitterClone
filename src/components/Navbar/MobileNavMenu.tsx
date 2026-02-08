import { getCurrentUser } from "../../types/User";
import { useState } from "react";
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User } from '../../types/User'
import { HOST } from "../../config";
import Icon from "../Icon/Icon";
const MobileNavMenu: React.FC = () => {
  const user = getCurrentUser() as User;
  const [showMenu, setShowMenu] = useState<Boolean>(false);
  return (
    <div className="mlr-1">
      <button className="nav-menu-btn" onClick={() => setShowMenu(true)}>
        {(user.profilePicUrl && <img src={user.profilePicUrl} alt="Profile-Alt" />)
          || ((<Icon name="profileDefault" />))}
      </button>
      {showMenu && typeof document !== 'undefined' && ReactDOM.createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .2, ease: 'easeIn' }}
          className="mobile-nav-popup"
          onClick={() => setShowMenu(false)}>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{ duration: .2, ease: 'easeIn' }}
            className="mobile-nav"
            onClick={(e) => { e.stopPropagation() }}
          >
            <div className="flex flex-col">
              <div className="flex flex-col p-2 gap-1">
                <div className="flex flex-row space-between">
                  <Link className="nav-menu-btn" to={`${HOST}/profile/${user?.username}`} >
                    {(user.profilePicUrl && <img src={user.profilePicUrl} alt="profile" />)
                      || ((<Icon name="profileDefault" />))
                    }
                  </Link>
                </div>
                <div className="flex flex-col">
                  <span>{user?.legalName}</span>
                  <span className="dimm-text">@{user?.username}</span>
                </div>
                <div className="flex flex-row gap-2">
                  <Link to={`user/following/${user?.username}`}>
                    <span className="bolder">{user?.following}&nbsp;</span>
                    <span className="dimm-text">Following</span>
                  </Link>
                  <Link to={`user/followers/${user?.username}`}>
                    <span className="bolder">{user?.followers}&nbsp;</span>
                    <span className="dimm-text">Followers</span>
                  </Link>
                </div>
              </div>
              <div className="mobile-nav-menu">
                <Link to={`/profile/${user?.username}`}>
                  <div className="nav-icon">
                    <Icon name="profile" />
                  </div>
                  <span>Profile</span>
                </Link>
                <Link to={`/bookmarks`}>
                  <div className="nav-icon">
                    <Icon name="bookmark" />
                  </div>
                  <span>Bookmarks</span>
                </Link>
                <Link to={`/settings`}>
                  <div className="nav-icon">
                    <Icon name="settings" />
                  </div>
                  <span>Settings</span>
                </Link>
                <Link to="logout">
                  <div className="nav-icon">
                    <Icon name="logout" />
                  </div>
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  )
}

export default MobileNavMenu;