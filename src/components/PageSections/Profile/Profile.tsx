import './Profile.css';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { getCurrentUser, User } from '../../../types/User';
import { useAlertActions } from '../../Utilities/AlertList/AlertContext';
import { popPrevious } from '../../../utils/NavigationHistory';
import { fetchUser, updateBannerImage, updateProfileImage, updateUser } from '../../../api/user';
import Topbar from '../../Layout/Topbar/Topbar';
import Icon from '../../UIElements/Icon/Icon';
import { getDateJoined } from '../../../helpers/dateHelper';
import PopupCard from '../../Popups/PopupCard/PopupCard';
import EditProfile from './EditProfile';
import OptionBar from '../../Layout/OptionBar/OptionBar';
import Follow from '../../FeatureModules/Follow/Follow';
import ProfilePicture from '../../UIElements/ProfilePicture/ProfilePicture';

type UserProfile = {
  legalName?: string,
  biography?: string,
  profilePic?: File,
  bannerPic?: File
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User>({});
  const currentUser = getCurrentUser();
  const userData = useRef<UserProfile>({});
  const [showEditUser, setShowEditUser] = useState<true | false>(false);
  const { addAlert } = useAlertActions();
  const [isLoading, setIsLoading] = useState<true | false>(true);
  const [editIsLoading, setEditIsLoading] = useState<true | false>(false);
  const navigate = useNavigate();
  const location = useLocation();


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

  if (isLoading) return (
    <div className='profile relative h-100'>
      <div className="center"><div className="spinner-lt"></div></div>
    </div>
  )

  return (
    <div className="profile relative h-100" >
      <div className="flex flex-col">
        <Topbar handleBack={handleBack}>
          {!isLoading && (
            <div className='ml-2 flex flex-col'>
              <span className='fs-lg bolder'>{user.legalName}</span>
              <span className='fs-sm dimm-text'>{user.posts} posts</span>
            </div>
          )}
        </Topbar>

        <div className="banner-container">
          {(user.bannerPicUrl != null &&
            <Link to="header_photo" state={{ backgroundLocation: location }}>
              <img src={user.bannerPicUrl} alt="profile" />
            </Link>
          )
          }
        </div>
        <div className="profile-content">
          <div className='flex flex-row space-between'>
            <div className="profile-picture">
              {(user.profilePicUrl != null &&
                <Link to="photo">
                  <ProfilePicture url={user.profilePicUrl}/>
                </Link>) ||
                (<Icon name="profileDefault" />)
              }
            </div>
            {currentUser?.id === user.id ? (
              <div className='profile-btn'>
                <button className='main-btn' onClick={handleEditUser}>
                  <span>Edit Profile</span>
                </button>
              </div>
            ) :
              (
                <div className='profile-btn'><Follow/></div>
              )
            }
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
    </div>

  )
}

export default Profile;