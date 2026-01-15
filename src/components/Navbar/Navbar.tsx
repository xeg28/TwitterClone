import './Navbar.css';
import CreatePost from '../CreatePost/CreatePost';
import Icon from '../Icon/Icon';
import Profiles from './Profiles';
import { Link, useLocation } from 'react-router-dom';
import { useRef } from 'react';
import { getCurrentUser } from '../../types/User';
import { useState, useEffect } from 'react';
import MobileNav from './MobileNav';

const Navbar: React.FC = () => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const user = getCurrentUser();
  const [isWide, setIsWide] = useState(window.innerWidth > 500);

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth > 500);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isWide ? (
    <header>
      <div></div>
      <div className="nav-content">
        <div className='flex flex-col gap-1 align-center-m'>
          <div className='nav-btns' ref={containerRef}>
            <Link to="/"
              className={location.pathname === "/" ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name={location.pathname === "/" ? 'homeActive' : 'home'} />
              </div>
              <span>Home</span>
            </Link>
            <Link to="/search"
              className={location.pathname === "/search" ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name={location.pathname === "/search" ? 'searchActive' : 'search'} />
              </div>
              <span>Explore</span>
            </Link>
            <Link to="/notifications"
              className={location.pathname === "/notifications" ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name={location.pathname === "/notifications" ? 'notificationActive' : 'notification'} />
              </div>
              <span>Notifications</span>
            </Link>
            <Link to="/messages"
              className={location.pathname.startsWith('/messages') ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name={location.pathname.startsWith('/messages') ? 'messagesActive' : 'messages'} />
              </div>
              <span>Messages</span>
            </Link>
            <Link to={`/profile/${user?.username}`}
              className={location.pathname.startsWith('/profile/') ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name={location.pathname.startsWith('/profile/') ? 'profileActive' : 'profile'} />
              </div>
              <span>Profile</span>
            </Link>
            <Link to="bookmarks" className={location.pathname === '/bookmarks' ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name={location.pathname === '/bookmarks' ? 'bookmarkActive' : 'bookmark'} />
              </div>
              <span>Bookmark</span>
            </Link>
          </div>
          <div className="post">
            <div className="w-100 flex align-center justify-content-center">
              <CreatePost isMobile={false}/>
            </div>
          </div>
        </div>

        <div className="relative">
          <Profiles />
        </div>
      </div>
    </header>
  ) : <MobileNav />
}

export default Navbar;