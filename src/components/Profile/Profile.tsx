import './Profile.css';
import { useParams } from 'react-router-dom';
import { fetchUser } from '../../api/user';
import { useEffect, useState } from 'react';
import { User } from '../../types/User';
import { useAlert } from '../AlertList/AlertContext';
import Icon from '../Icon/Icon';


const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | undefined>();
  const { addAlert } = useAlert();

  const handleBack = () => {

  }

  useEffect(() => {
    if (!username) return;
    const fetchData = async (username: string) => {
      const response = await fetchUser(username);
      if (response.ok) {
        setUser(await response.json());
        console.log(user);
      }
      else {
        let res = await response.json();
        addAlert(res.message, "error");
      }
    }

    fetchData(username);
  }, []);

  return (
    <>
      <div className="profile">
        <div className="top-bar">
          <button onClick={handleBack}>
            <Icon name="back" />
          </button>
          <div>
            <span className='fs-lg bolder'>{user?.legalName}</span>
            <span className='fs-sm dimm-text'># posts</span>
          </div>
          <button>
            <Icon name="search" />
          </button>
        </div>

        <div className="banner-container">

        </div>
        <div className="profile-content">
          <div className="profile-picture">

          </div>

        </div>

      </div>
    </>
  )
}

export default Profile;