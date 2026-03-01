import { useState, useEffect, useCallback } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import { User } from "../../../types/User";
import FormInput from "../../UIElements/FormInput/FormInput";
interface EditProfileProps {
  user: User;
  onDataChange: (data: User) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onDataChange }) => {
  const [name, setName] = useState<string>(user?.legalName ?? "");
  const [biography, setBiography] = useState<string>(user?.biography ?? "");
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [profileBannerImg, setProfileBannerImg] = useState<File | null>(null);

  const updateData = useCallback(() => {
    const newData = {
      legalName: name,
      biography: biography,
      profilePic: profileImg,
      bannerPic: profileBannerImg
    }
    onDataChange(newData);
  }, [name, biography, profileImg, profileBannerImg, onDataChange]);
  useEffect(() => {
    updateData();
  }, [profileImg, name, biography, profileBannerImg, updateData]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    setName(v);
  }

  const onBioInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const v = e.currentTarget.value;
    setBiography(v);
  }

  return (
    <div className="edit-profile-wrapper">
      <div className="edit-banner">
        <ProfileImageUpload setImg={setProfileBannerImg} currentImg={user.bannerPicUrl} imgType="banner"/>
      </div>
      <div className="edit-profile-pic">
        <ProfileImageUpload setImg={setProfileImg} currentImg={user.profilePicUrl} imgType="profile"/>
      </div>
      <form>
        <div className="edit-profile-form">
          <FormInput
            type="text"
            name="name"
            id="legalName"
            value={name}
            onChange={onNameChange}
            placeholder="Name"
            isRequired
            pattern="[A-Za-z ]{2,50}"
            title="Name must be between 2-50 characters"
            charLimit={50} />
          <FormInput
            type="textarea"
            name="bio"
            id="biography"
            placeholder="Bio"
            onInput={onBioInput}
            value={biography}
            isRequired={false}
            charLimit={160} />
        </div>
      </form>
    </div>
  )
}

export default EditProfile;