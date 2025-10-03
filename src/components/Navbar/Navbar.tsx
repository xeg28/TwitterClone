import './Navbar.css';
import CreatePost from '../CreatePost/CreatePost';
import { API_URL } from '../../config';
import { useNavigate } from "react-router-dom";


const Navbar: React.FC = () => {
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
    <header>
      <div></div>
      <div className="nav-content">
        <CreatePost />
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  )
}

export default Navbar;