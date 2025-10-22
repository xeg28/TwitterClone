import React, { useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import './ContextMenu.css';

type MenuOption = {
  id: string;
  text: string;
  func(): void;
}

interface ContextMenuProps {
  options: MenuOption[];
  targetRef: React.RefObject<HTMLElement | null>;
}


const ContextMenu: React.FC<ContextMenuProps> = ({ options, targetRef }) => {

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (targetRef.current && menuRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      menuRef.current.style.bottom = `${rect.height + 10}px`;
    }
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .15 }}
      className="context-menu" ref={menuRef}>
      <div className="menu-content">
        {options.map((option, idx) => (
          <div className="menu-option" key={option.id + idx}>
            <a href='#'
              onClick={
                (e) => {
                  e.preventDefault();
                  option.func()
                }}>
              {option.text}
            </a>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default ContextMenu