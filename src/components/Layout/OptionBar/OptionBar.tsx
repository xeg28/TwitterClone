import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import './OptionBar.css';
import { useLocation, Link } from 'react-router-dom';
import OptionBarElement from './OptionBarElement';
interface OptionBarProps {
  optionTitles: string[];
  baseURI?: string;
  optionParamater?: string[];
  components: React.ReactNode[];
}

const OptionBar: React.FC<OptionBarProps> = ({
  optionTitles,
  baseURI,
  optionParamater,
  components
}) => {
  const location = useLocation();
  const barRef = useRef<HTMLDivElement>(null);
  const [nodeIndex, setNodeIndex] = useState<number | undefined>();


  useEffect(() => {
    if (!baseURI) {
      setNodeIndex(0);
      return;
    }
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

    const relPath = location.pathname.replace(baseURI, "");
    setNodeIndex((prev) => optionParamater?.indexOf(relPath) ?? prev);

  }, [location.pathname, baseURI]);

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
              <button
                className="option-link button-reset"
                key={option + index}
                onClick={() => { setNodeIndex(index) }}
              >
                <span>{option}</span>
              </button>
            ))
          ))
        }
      </div>
      <div>
        {nodeIndex != undefined && components.map((component: React.ReactNode, index) => (
          <div key={`option-element-${index}`}>
            <OptionBarElement
            render={nodeIndex === index}
            className={nodeIndex === index ? '' : 'd-none'}>
            {component}
          </OptionBarElement>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OptionBar;