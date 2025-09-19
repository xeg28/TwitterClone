import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getUser } from "../types/User";
import CreatePost from '../components/CreatePost/CreatePost';

const Home: React.FC = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const user = useRef({});
  
  useEffect(() => {
    user.current = getUser();
}, []);
  const logout = async () => {
    try {
      const response = await fetch(`${apiURL}/api/auth/logout`, {
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
    <div className="wrapper">
      <div className="fs-xl">Home Page</div>
      <button onClick={logout}>Logout</button>
      <CreatePost/>
    </div>
  )
}

export default Home;