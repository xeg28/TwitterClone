import { getCurrentUser, User } from "../../../types/User";
import { useRef } from "react";
import ContextMenu from "../../Utilities/ContextMenu/ContextMenu";
import ProfilePicture from "../../UIElements/ProfilePicture/ProfilePicture";


const Profiles: React.FC = () => {
  const user = getCurrentUser() as User;

  const profileRef = useRef<HTMLDivElement | null>(null);

  return (
    <ContextMenu
      options={[{ id: "logout", text: `Log out @${user.username}`, path: "logout" }]}
      targetRef={profileRef}
      trigger={({ onClick, ref }) => (
        <div className="flex justify-content-center-m" ref={ref}>
          <button className="profiles-btn" onClick={onClick}>
            <div className="profiles-pic">
              <ProfilePicture url={user.profilePicUrl}/>
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
      )}
    />
  );
}


export default Profiles;