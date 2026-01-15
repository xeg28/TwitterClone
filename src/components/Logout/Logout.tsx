import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        const result = await response.json();
        if (result.status === 200) {
          navigate('/login');
        } else {
          console.log(result.message);
        }
      } catch (e) {
        console.error('Logout failed:', e);
      }
    };

    logout();
  }, [navigate]);

  return (
    <LoadingScreen/>
  );
};

export default Logout;