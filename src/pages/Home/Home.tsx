
import { useEffect, useRef, useState } from "react";
import { getUser } from "../../types/User";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";

const Home: React.FC = () => {
  const user = useRef({});

  useEffect(() => {
    user.current = getUser();
  }, []);

  return (
    <div className="wrapper">
      <div className="home-layout">
        <Navbar/>
        <main>
          <div className="main-content">
            main
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