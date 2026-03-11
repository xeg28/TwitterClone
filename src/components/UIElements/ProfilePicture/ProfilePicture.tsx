import Icon from "../Icon/Icon";
interface ProfilePictureProps {
  url?: string;
}
const ProfilePicture: React.FC<ProfilePictureProps> = ({ url }) => {

  return (
    <>{url ? (
      <img src={url} alt="profile" />
    ) : (<Icon name="profileDefault" />)}</>
  )
}

export default ProfilePicture;