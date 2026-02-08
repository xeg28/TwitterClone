import { getCurrentUser, User } from "../../types/User";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";
import { AnimatePresence } from "framer-motion";
import Icon from "../Icon/Icon";


const Profiles: React.FC = () => {
  const user = getCurrentUser() as User;
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    const removeMenu = (e: MouseEvent) => {
      const target = e.target as Node | null;

      if (profileRef.current && profileRef.current.contains(target)) return;
      setShowMenu(false);
    };

    document.addEventListener('click', removeMenu);
    return () => document.removeEventListener('click', removeMenu);

  }, [])

  return (
    <>
      <div className="flex justify-content-center-m" ref={profileRef}>
        <button className="profiles-btn" onClick={() => setShowMenu((prev) => { return !prev })}>
          <div className="profiles-pic">
            {(user.profilePicUrl && <img src={user.profilePicUrl} alt="Profile"/>) ||
              <Icon name="profileDefault"/>
            }
          </div>
          <div className="profiles-text">
            <div>
              <span className="bolder">{user.legalName}</span>
            </div>
            <div>
              <span className="dimm-text">@{user.username}</span>
            </div>
          </div>
        </button>
      </div>
      <AnimatePresence>
        {showMenu && (
          <ContextMenu
            options={[{ id: "logout", text: `Log out @${user.username}`, path: "logout" },
            ]}
            targetRef={profileRef}
          />
        )}
      </AnimatePresence>
    </>
  )
}


export default Profiles;