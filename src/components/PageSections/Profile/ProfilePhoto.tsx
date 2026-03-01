import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchUser } from '../../../api/user';
import { User } from '../../../types/User';
import Icon from '../../UIElements/Icon/Icon';

interface ProfilePhotoProps {
  type: 'photo' | 'header';
}

type PhotoType = {
  photo?: string;
  header?: string;
}
const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ type }) => {
  const { username } = useParams<{ username: string }>();
  const [photoURLs, setPhotoURLs] = useState<PhotoType | null>(null);

  useEffect(() => {
    if (!username) return;
    const fetchData = async (username: string) => {
      const response = await fetchUser(username);
      if (response.ok) {
        let user = await response.json() as User;

        setPhotoURLs({
          photo: user.profilePicUrl,
          header: user.bannerPicUrl
        });
      }
    }

    fetchData(username);
  }, [username])

  if (typeof document === 'undefined') return null;
  return photoURLs ? ReactDOM.createPortal(
    <div className={`large-photo ${type}`}>
      <Link to={`/profile/${username}`}>
        <Icon name="close" />
      </Link>
      <img src={photoURLs[type]} alt="Profile" />
    </div>,
    document.body
  ) : null;
}

export default ProfilePhoto;