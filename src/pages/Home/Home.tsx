
import { useEffect, useRef } from "react";
import { getCurrentUser } from "../../types/User";
import {Outlet} from "react-router-dom";
import Navbar from "../../components/Layout/Navbar/Navbar";
import { useNavigationHistory } from "../../hooks/useNavigationHistory";
import "./Home.css";


const Home: React.FC = () => {
  const user = useRef<any>({});
  useNavigationHistory();
  useEffect(() => {
    user.current = getCurrentUser();
  }, []);

  return (
    <div className="wrapper">
      <div className="home-layout">
        <Navbar/>
        <main>
          <div className="main-content">
            <Outlet/>
          </div>
        </main>
        <div className="alt-content">
          <div>
            secondary
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;