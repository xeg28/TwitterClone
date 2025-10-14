import React, { useEffect, useRef} from 'react';
import './ContextMenu.css';

type MenuOption = {
  id: string;
  text: string;
  func(): void;
}

interface ContextMenuProps {
  options: MenuOption[];
  show: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
}


const ContextMenu: React.FC<ContextMenuProps> = ({ options, show, targetRef}) => {

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (targetRef.current && menuRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      menuRef.current.style.bottom = `${rect.height + 10}px`;
    }
  }, [show])
  return (
    <div className={`context-menu ${show ? "" : "d-none"}`} ref={menuRef}>
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
    </div>
  )
}

export default ContextMenu