import React, { useLayoutEffect, useRef, useState, useEffect, } from 'react';
import { motion } from "framer-motion";
import ReactDOM from "react-dom";
import './ContextMenu.css';
import { Link } from 'react-router-dom'
import Icon from '../../UIElements/Icon/Icon';
import { Icons } from '../../UIElements/Icon/Icons';

export type MenuOption = {
  id: string;
  text: string;
  path?: string;
  ActionElement?: React.ReactElement<any>;
  className?: string;
  icon?: keyof typeof Icons;
}


interface ContextMenuProps {
  options: MenuOption[];
  targetRef: React.RefObject<HTMLElement | null>;
  trigger: (props: { onClick: React.MouseEventHandler; ref: React.Ref<any> }) => React.ReactElement;
  dynamic?: true;
  closeBtn?: true;
}



const ContextMenu: React.FC<ContextMenuProps> = (
  {
    options,
    targetRef,
    trigger,
    dynamic,
    closeBtn,
  }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [showActionComponent, setShowActionComponent] = useState<true | false>();
  const [isWide, setIsWide] = useState(window.innerWidth > 500);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isWide) {
      document.body.classList.toggle('no-scroll');
    }
    setVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth > 500);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!visible || showActionComponent) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node | null;

      if (
        (menuRef.current && menuRef.current.contains(target)) ||
        (targetRef.current && targetRef.current.contains(target))
      ) {
        return;
      }
      if (!isWide) {
        document.body.classList.remove('no-scroll');
      }
      setVisible(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible, targetRef, showActionComponent]);


  useLayoutEffect(() => {
    if (!visible) return;
    if (typeof document === "undefined") return;
    const el = menuRef.current;
    const target = targetRef.current;
    if (!el || !target) return;

    let timeoutId: number | null = null;

    const positionMenu: () => void = () => {
      const rect = target.getBoundingClientRect();
      const menu = el;

      if (!isWide) {
        el.style.bottom = '0px';
        el.style.left = '0px';
        return;
      }

      if (!menu) return;



      if (!dynamic) {
        el.style.bottom = `${window.innerHeight - rect.top + 10}px`;
        el.style.left = `${rect.left}px`;
      } else {
        const offset = 15;
        let top = rect.top + window.scrollY;
        let right = window.innerWidth - rect.right - offset;
   
        const menuHeight = menu.offsetHeight;
        const viewportBottom = window.innerHeight + window.scrollY;
        if (top + menuHeight > viewportBottom) {
          top = rect.bottom + window.scrollY - menuHeight;
        }
        menu.style.top = `${top}px`;
        menu.style.right = `${right}px`;
      }
    };

    const delayedPositionMenu = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        positionMenu();
      }, 250);
    };

    const observer = new ResizeObserver(() => {
      delayedPositionMenu();
    });
    observer.observe(target);
    const raf = window.requestAnimationFrame(positionMenu);
    window.addEventListener("resize", delayedPositionMenu);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", delayedPositionMenu);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [targetRef, visible]);

  if (typeof document == "undefined") return null;

  return (
    <>
      {trigger({ onClick: handleTriggerClick, ref: targetRef })}
      {visible && ReactDOM.createPortal(
        <>
          <div
            className="context-menu-overlay"
            onClick={() => setVisible(false)}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isWide ? .15 : 0 }}
            className="context-menu"
            ref={menuRef}
            style={{
              position: dynamic && isWide ? 'absolute' : 'fixed',
              display: showActionComponent ? 'none' : undefined
            }}
          >
            <div className="menu-content">
              <div>
                {options.map((option, idx) => (
                  <div className={`menu-option ${option.className ?? ''}`} key={option.id + idx}>
                    {option.path && (
                      <Link to={option.path} onClick={() => setVisible(false)}>
                        {option.icon && (
                          <div className="option-icon">
                            <Icon name={option.icon} />
                          </div>
                        )}
                        {option.text}
                      </Link>
                    )}
                    {option.ActionElement && (
                      <button className="button-reset" onClick={() => setShowActionComponent(true)}>
                        {option.icon && (
                          <div className="option-icon">
                            <Icon name={option.icon} />
                          </div>
                        )}
                        {option.text}
                      </button>
                    )}
                    {showActionComponent && option.ActionElement &&
                      React.cloneElement(option.ActionElement, {
                        setShow: (show: boolean) => {
                          setShowActionComponent(show);
                        },
                        onCloseContextMenu: () => {
                          setShowActionComponent(false);
                          if (!isWide) {
                            document.body.classList.toggle('no-scroll');
                          }
                          setVisible(false);
                        }
                      })
                    }
                  </div>
                ))}
              </div>
              {closeBtn && (
                <div className="cancel-cm-btn">
                  <button className='main-btn' onClick={handleTriggerClick}>Cancel</button>
                </div>
              )}
            </div>
          </motion.div>
        </>,
        document.body
      )}
    </>
  );
};

export default ContextMenu