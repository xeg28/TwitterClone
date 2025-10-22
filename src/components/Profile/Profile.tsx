import './Profile.css';
import { useParams } from 'react-router-dom';

const Profile:React.FC = () => {
  const { username } = useParams<{ username: string }>();
  return (
    <div>{username}'s profile</div>
  )
}

export default Profile;