import FormInput from "../FormInput/FormInput";
import { useState } from "react";
import { User } from "../../types/User";

interface EditProfileProps {
  user: User
}
const EditProfile:React.FC<EditProfileProps> = ({user}) => {
  const [name, setName] = useState<string>(user?.legalName ?? "");
  const [biography, setBiography] = useState<string>(user?.biography ?? "");
  return (
    <div className="edit-profile-wrapper">
      <div className="edit-banner"></div>
      <div className="edit-profile-pic"></div>
      <form>
        <div className="edit-profile-form">
          <FormInput 
            type="text" 
            name="name" 
            id="legalName" 
            value={name}
            onChange={e => setName(e.target.value)} 
            placeholder="Name"
            isRequired 
            pattern="[A-Za-z ]{2,50}" 
            title="Name must be between 2-50 characters"/>
          <FormInput 
            type="textarea" 
            name="bio" 
            id="biography"
            placeholder="Bio"
            onInput={e=>setBiography(e.currentTarget.value)}
            value={biography} 
            isRequired={false} />
        </div>
      </form>
    </div>
  )
}

export default EditProfile;