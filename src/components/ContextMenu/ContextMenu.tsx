import React, { useLayoutEffect, useRef } from 'react';
import { motion } from "framer-motion";
import ReactDOM from "react-dom";
import './ContextMenu.css';
import {Link} from 'react-router-dom'
type MenuOption = {
  id: string;
  text: string;
  path: string;
}

interface ContextMenuProps {
  options: MenuOption[];
  targetRef: React.RefObject<HTMLElement | null>;
}


const ContextMenu: React.FC<ContextMenuProps> = ({ options, targetRef }) => {

  const menuRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (typeof document === "undefined") return; // SSR guard
    const el = menuRef.current;
    const target = targetRef.current;
    if (!el || !target) return;

    const positionMenu: () => void = () => {
      const rect = target.getBoundingClientRect();
      // place the menu relative to the target (adjust as needed)
      el.style.bottom = `${window.innerHeight - rect.top + 10}px`;
      el.style.left = `${rect.left}px`;
    }
    // ensure measurement runs after motion element mounts/paints
    const raf = window.requestAnimationFrame(positionMenu);

    window.addEventListener("resize", positionMenu);

    return () => {
      window.cancelAnimationFrame(raf);
      window.addEventListener("resize", positionMenu);
    };
  }, [targetRef]);

  if (typeof document == "undefined") return null;
  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .15 }}
      className="context-menu" ref={menuRef}>
      <div className="menu-content">
        {options.map((option, idx) => (
          <div className="menu-option" key={option.id + idx}>
            <Link to={option.path}>
              {option.text}
            </Link>
          </div>
        ))}
      </div>
    </motion.div>,
    document.body
  );
};

export default ContextMenu