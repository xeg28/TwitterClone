import Icon from "../Icon/Icon";
import './Topbar.css';
import { useScrollSpeed } from "../../helpers/scrollHelper";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
interface TopbarProps {
  handleBack?: () => void;
  children: React.ReactNode;
}


const Topbar: React.FC<TopbarProps> = ({ handleBack, children }) => {
  const { handleScroll, speed } = useScrollSpeed();
  const [isHidden, setIsHidden] = useState<true | false>(false);
  const [isWide, setIsWide] = useState<true | false>(window.innerWidth > 500);

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth > 500);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const positionChangeHandler = () => {
      handleScroll();

      if (!isHidden && speed.current > 0) {
        setIsHidden(true);
      }
      else if (isHidden && (speed.current < -2 || window.scrollY === 0)) {
        setIsHidden(false);
        console.log('shown');
      }
    }
    window.addEventListener("scroll", positionChangeHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", positionChangeHandler);
    };
  }, [isHidden, handleScroll, speed])
  return (
    <motion.div
      {...(!isWide && {
        initial: isHidden ? { y: 0 } : { y: "-100%" },
        animate: isHidden ? { y: "-100%" } : { y: 0 },
        transition: isHidden
          ? { type: "tween", ease: "linear", duration: 0.2}
          : { type: "spring", bounce: 0.5, duration: 0.6}
      })}
      className="topbar">
      {handleBack && (
        <button onClick={handleBack}>
          <Icon name="back" />
        </button>
      )}
      {children}
    </motion.div>
  )
}

export default Topbar;