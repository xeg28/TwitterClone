import React, {useState, useEffect, useRef} from "react";
import './FormInput.css';

type FormInputProps = {
  type: string;
  id: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?:string;
  isRequired:boolean;
  title?:string;
  pattern:string;
  info?:boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  id,
  name,
  value,
  onChange,
  onFocus,
  placeholder,
  isRequired,
  title,
  pattern,
  info
}) => {
  const [showInfo, setShowInfo] = useState<true | false>(false);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const handleInfoClick = (event: React.MouseEvent) => {
    setShowInfo((prevVal:boolean) => {
      return !prevVal;
    });
  }
  useEffect(() => {
    if (showInfo && infoRef.current) {
      const current = infoRef.current;
      const rect = current.getBoundingClientRect();
      const height = current.offsetHeight;
      if((rect.top - (height+5)) >= 0 && (rect.top - (height+5)) <= window.innerHeight) {
        current.style.top = -(height+5) + "px";
        current.style.right = "20px";
        current.style.borderRadius = "8px 8px 0px 8px";
      }
      else {
        current.style.top = "30px";
        current.style.right = "20px";
        current.style.borderRadius = "8px 0px 8px 8px";
      }
    }
  }, [showInfo]);

  return (
    <div className="input-text" >
      <input type={type} id={id} name={name} placeholder=" " 
        value={value} onChange={onChange} required={isRequired} title={title} 
        pattern={pattern} {... onFocus ? {onFocus} : {}}/>
      <span className="placeholder">{placeholder}</span>
      {info && (
        <div className="input-info">
          <button type="button" data-toggle="popover" data-placement="top" data-content={title} className="info-btn button-reset" name="Info Button" 
            onClick={handleInfoClick}>i</button>
          {
            showInfo && (
              <div className="popover" ref={infoRef}>
                <div className="popover-content">{title}</div>
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}


export default FormInput;