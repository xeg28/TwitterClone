import { SetStateAction, useEffect, useRef, useState } from 'react';
import './OptionBar.css';
import { useLocation, Link } from 'react-router-dom';
interface OptionBarProps {
  optionTitles: string[];
  baseURI?: string;
  optionParamater?: string[];
  children?: React.ReactNode;
  nodeIndex?: number;
  setNodeIndex?: React.Dispatch<SetStateAction<number>>;
}

const OptionBar: React.FC<OptionBarProps> = ({
  optionTitles,
  baseURI,
  optionParamater,
  children,
  nodeIndex,
  setNodeIndex
}) => {
  const location = useLocation();
  const barRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!baseURI) return;
    const containerEl = barRef.current;
    if (!containerEl) return;

    Array.from(containerEl.children).forEach((child) => {
      child.classList.remove("active");
    });

    Array.from(containerEl.children).forEach((child) => {
      const link = child.getAttribute("href");
      if (!link) return;

      const escaped = link.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`^${escaped}/?$`);
      if (re.test(location.pathname)) child.classList.add("active");
    });

  }, [location.pathname]);

  useEffect(() => {
    const containerEl = barRef.current;
    if (!containerEl || nodeIndex === undefined) return;

    Array.from(containerEl.children).forEach((child) => {
      child.classList.remove("active");
    });

    containerEl.children[nodeIndex].classList.add('active');
  }, [nodeIndex])

  return (
    <div>
      <div className="option-bar" ref={barRef}>
        {optionParamater ? (
          optionParamater.map((option: string, index: number) => (
            <Link
              to={baseURI + option}
              className="option-link"
              key={option + index}>
              <span>{optionTitles[index]}</span>
            </Link>
          ))) :
          (setNodeIndex && (
            optionTitles.map((option: string, index: number) => (
              <a
                href="#"
                className="option-link"
                key={option + index}
                onClick={() => { setNodeIndex(index) }}
              >
                <span>{option}</span>
              </a>
            ))
          ))
        }
      </div>
      <div>
        {children && <>{children}</>}
      </div>
    </div>
  )
}

export default OptionBar;