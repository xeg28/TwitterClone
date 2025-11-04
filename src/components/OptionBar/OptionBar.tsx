import { useEffect, useRef } from 'react';
import './OptionBar.css';
import { useLocation, Link } from 'react-router-dom';
interface OptionBarProps {
  optionTitles: string[];
  baseURI: string;
  optionParamater: string[];
  children: React.ReactNode;
}

const OptionBar: React.FC<OptionBarProps> = ({ optionTitles, baseURI, optionParamater, children }) => {
  const location = useLocation();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  }, [location.pathname])

  return (
    <div>
      <div className="option-bar" ref={barRef}>
        {optionParamater.map((option: string, index: number) => (
          <Link
            to={baseURI + option}
            className="option-link"
            key={option + index}>
            <span>{optionTitles[index]}</span>
          </Link>
        ))}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default OptionBar;