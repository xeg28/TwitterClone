import './Profile.css';
import { Outlet, useParams } from 'react-router-dom';
import { fetchUser, updateUser, updateProfileImage, updateBannerImage } from '../../api/user';
import { useEffect, useState, useRef } from 'react';
import { User } from '../../types/User';
import { useAlertActions } from '../AlertList/AlertContext';
import Icon from '../Icon/Icon';
import { popPrevious } from '../../utils/NavigationHistory';
import { useNavigate } from 'react-router-dom';
import { getDateJoined } from '../../helpers/dateHelper';
import ReactDOM from 'react-dom';
import PopupCard from '../PopupCard/PopupCard';
import EditProfile from './EditProfile';
import OptionBar from '../OptionBar/OptionBar';
import Topbar from '../Topbar/Topbar';

type UserProfile = {
  legalName?: string,
  biography?: string,
  profilePic?: File,
  bannerPic?: File
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User>({});
  const userData = useRef<UserProfile>({});
  const [showEditUser, setShowEditUser] = useState<true | false>(false);
  const { addAlert } = useAlertActions();
  const [isLoading, setIsLoading] = useState<true | false>(true);
  const [editIsLoading, setEditIsLoading] = useState<true | false>(false);
  const navigate = useNavigate();


  const handleBack = () => {
    const prev = popPrevious();
    navigate(prev ?? "/");
  }

  const saveUser = async () => {
    const newData = userData.current;

    try {
      setEditIsLoading(true);
      if (newData.profilePic) {
        const formData = new FormData();
        formData.append("file", newData.profilePic);
        const response = await updateProfileImage(formData);
        if (!response.ok) {
          addAlert("There was an error when uploading, try again.", "error");
          return;
        }
        else {
          const result = await response.json();
          setUser((prev) => { return { ...prev, profilePicUrl: result.url } });
        }
      }
   
      if (newData.bannerPic) {
        const formData = new FormData();
        formData.append("file", newData.bannerPic);
        const response = await updateBannerImage(formData);
        if (!response.ok) {
          addAlert("There was an error when uploading, try again.", "error");
          return;
        }
        else {
          const result = await response.json();
          setUser((prev) => { return { ...prev, bannerPicUrl: result.url } });
        }
      }

      const response = await updateUser({
        ...user,
        legalName: newData.legalName,
        biography: newData.biography
      });
      if (response.ok) {
        setUser((prev) => {
          return {
            ...prev,
            legalName: newData.legalName,
            biography: newData.biography
          };
        });
        addAlert("Profile updated", "success");
        setShowEditUser(false);
      }
      else {
        addAlert("Can't update user", "error");
      }
    }
    catch (e) {
      addAlert("Error updating user, try again", "error");
    }
    finally {
      setEditIsLoading(false);
    }
  }

  const confirmationTrigger = (): boolean => {
    const current = userData.current;
    if (user.legalName === current.legalName && user.biography === current.biography) return false;
    return true;
  }

  useEffect(() => {
    if (!username) return;
    const fetchData = async (username: string) => {
      setIsLoading(true);
      const response = await fetchUser(username);
      if (response.ok) {
        setUser(await response.json());
      }
      else {
        let res = await response.json();
        addAlert(res.message, "error");
      }
      setIsLoading(false);
    }

    fetchData(username);
  }, [username, addAlert]);

  const handleEditUser = () => {
    setShowEditUser((prev) => { return !prev })
    userData.current.legalName = user.legalName;
    userData.current.biography = user.biography;
  }
  return (
    <div className="profile relative h-100" >
      {
        isLoading ?
          (
            <div className="center"><div className="spinner-lt"></div></div>
          ) :
          (
            <div className="flex flex-col">
              {/* <div className="top-bar">
                <button onClick={handleBack}>
                  <Icon name="back" />
                </button>
                {!isLoading && (
                  <div>
                    <span className='fs-lg bolder'>{user.legalName}</span>
                    <span className='fs-sm dimm-text'># posts</span>
                  </div>
                )}
                <button>
                  <Icon name="search" />
                </button>
              </div> */}

              <Topbar handleBack={handleBack}>
                {!isLoading && (
                  <div>
                    <span className='fs-lg bolder'>{user.legalName}</span>
                    <span className='fs-sm dimm-text'># posts</span>
                  </div>
                )}
              </Topbar>

              <div className="banner-container">
                {(user.bannerPicUrl != null &&
                  <img src={user.bannerPicUrl} alt="profile" />)
                }
              </div>
              <div className="profile-content">
                <div className='flex flex-row space-between'>
                  <div className="profile-picture">
                    {(user.profilePicUrl != null &&
                      <img src={user.profilePicUrl} alt="profile" />) ||
                      (<Icon name="profileDefault" />)
                    }
                  </div>
                  <div>
                    <button className='main-btn' onClick={handleEditUser}>
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <div className="flex flex-col">
                    <div className="fs-lg bolder">{user?.legalName}</div>
                    <div className='dimm-text'>@{user?.username}</div>
                  </div>
                  <div className="bio">
                    {user?.biography}
                  </div>
                  <div className='dimm-text'>
                    <span className='text-icon'>
                      <Icon name="calendar" />
                    </span>
                    <span>Joined {getDateJoined(user?.dateJoined)}</span>
                  </div>
                  <div className='flex gap-2'>
                    <span>{user?.following} <span className="dimm-text">Following</span></span>
                    <span>{user?.followers} <span className="dimm-text">Followers</span></span>
                  </div>
                </div>
              </div>

              {showEditUser && typeof document !== "undefined" && ReactDOM.createPortal(
                <PopupCard
                  setShowPopup={setShowEditUser}
                  popupTitle='Edit profile'
                  onSubmit={saveUser}
                  submitText='Save'
                  confirmDialogProps={{
                    trigger: confirmationTrigger,
                    onConfirm: () => setShowEditUser(false),
                    type: "discard",
                    title: "Discard changes?",
                    dialog: "This can't be undone and you'll lose all your changes."
                  }}
                  isLoading={editIsLoading}
                >
                  <EditProfile user={user} onDataChange={(d) => (userData.current = d)} />
                </PopupCard>,
                document.body
              )}

              <div>
                <OptionBar
                  optionTitles={['Posts', 'Replies']}
                  baseURI={`/profile/${username}`}
                  optionParamater={['', '/replies']} >
                  <Outlet />
                </OptionBar>
              </div>
            </div>
          )
      }

    </div>

  )
}

export default Profile;