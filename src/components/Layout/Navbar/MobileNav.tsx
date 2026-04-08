import { Link, useLocation } from "react-router-dom";
import ReactDOM from 'react-dom';
import { useScrollSpeed } from "../../../helpers/scrollHelper";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../../UIElements/Icon/Icon";

const MobileNav: React.FC = () => {
  const location = useLocation();
  const { handleScroll, speed } = useScrollSpeed();
  const [isTransparent, setIsTransparent] = useState<true | false>(false);

  // change opacity when interacting

  useEffect(() => {
    const opacityChangeHandler = () => {
      handleScroll();

      if (!isTransparent && speed.current > 0) {
        setIsTransparent(true);
      }
      else if (isTransparent && (speed.current < -2 || window.scrollY === 0)) {
        setIsTransparent(false);
      }
    }

    window.addEventListener("scroll", opacityChangeHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", opacityChangeHandler);
    };
  }, [isTransparent, handleScroll, speed]);
  if (typeof document == 'undefined') return null;
  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        className="navbar-sm-container"
        initial={{ opacity: isTransparent ? 1 : .3 }}
        animate={{ opacity: isTransparent ? .3 : 1 }}
      >
        <div className="mr-2 mb-2">
          <Link to="/compose/post" className="post-btn-sm" >
            <Icon name="post" className="icon-svg" />
          </Link>
        </div>
        <div
          className='navbar-sm'>
          <div className='nav-btns '>
            <Link to="/"
              className={location.pathname === "/" ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name="home" className={`${location.pathname === "/" ? 'fill' : ''}`}  />
              </div>
            </Link>
            <Link to="/search"
              className={location.pathname === "/search" ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name={location.pathname === "/search" ? 'searchActive' : 'search'} />
              </div>
            </Link>
            <Link to="/notifications"
              className={location.pathname === "/notifications" ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name='notification' className={`${location.pathname === "/notifications" ? 'fill' : ''}`} />
              </div>
            </Link>
            <Link to="/messages"
              className={location.pathname.startsWith('/messages') ? 'active' : ''}>
              <div className="nav-icon">
                <Icon name='messages' className={`${location.pathname.startsWith('/messages') ? "thick" : ''}`}/>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>

    </AnimatePresence>,
    document.body
  )
}

export default MobileNav;