import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config';
import { getUser, User } from "../../types/User";

const Profiles: React.FC = () => {
  const user = getUser() as User;
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      const result = await response.json();
      if (result.status === 200) {
        navigate('/login');
      }
      else {
        console.log(result.message);
      }

    }
    catch (e) {
      
    }
  }

  return (
    <div className="flex justify-content-center">
      <button className="profiles-btn" >
        <div className="profiles-pic"></div>
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
  )
}


export default Profiles;