import './Navbar.css';
import CreatePost from '../CreatePost/CreatePost';
import Icon from '../Icon/Icon';
import Profiles from './Profiles';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef} from 'react';
import { getUser } from '../../types/User';

const Navbar: React.FC = () => { 
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const user = getUser();
  useEffect(() => {
    const containerEl = containerRef.current;
    if(!containerEl) return;
    
    Array.from(containerEl.children).forEach((child) => {
      child.classList.remove("active");
    });

    const link = containerEl.querySelector(`a[href='${location.pathname}']`);
    link?.classList.add("active");
  }, [location.pathname])

  return (
    <header>
      <div></div>
      <div className="nav-content">
        <div className='flex flex-col gap-1 align-center-m'>
          <div className='nav-btns' ref={containerRef}>
            <Link to="/">
              <div className="nav-icon">
                <Icon name="home"/>
              </div>
              <span>Home</span>
            </Link>
            <Link to="/search">
              <div className="nav-icon">
                <Icon name="search"/>
              </div>
              <span>Explore</span>
            </Link>
            <Link to="/notifications">
              <div className="nav-icon">
                <Icon name="notification"/>
              </div>
              <span>Notifications</span>
            </Link>
            <Link to="/messages">
              <div className="nav-icon">
                <Icon name="messages"/>
              </div>
              <span>Messages</span>
            </Link>
            <Link to={`/profile/${user?.username}`}>
              <div className="nav-icon">
                <Icon name="profile"/>
              </div>
              <span>Profile</span>
            </Link>
            <Link to="more">
              <div className="nav-icon">
                <Icon name="more"/>
              </div>
              <span>More</span>
            </Link>
          </div>
          <div className="post">
            <CreatePost />
          </div>
        </div>

        <div className="relative">
          <Profiles/>
        </div>
      </div>
    </header>
  )
}

export default Navbar;