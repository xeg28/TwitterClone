import React, {useState, useEffect, useRef} from "react";
import './FormInput.css';

type FormInputProps = {
  type: string;
  id: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?:string;
  isRequired:boolean;
  title?:string;
  pattern:string;
  info?:boolean;
  errors?:Map<string, string>;
  setErrors?:React.Dispatch<React.SetStateAction<Map<string, string>>>;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  isRequired,
  title,
  pattern,
  info,
  errors, 
  setErrors
}) => {
  const [showInfo, setShowInfo] = useState<true | false>(false);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const handleInfoClick = (event: React.MouseEvent) => {
    setShowInfo((prevVal:boolean) => {
      return !prevVal;
    });
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('input-text') || target.classList.contains('placeholder')) {
        var input = (target.classList.contains('input-text')) ? target.querySelector('input') as HTMLInputElement 
            : target.parentElement?.querySelector('input') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }
    };

    document.addEventListener('click', handleClick);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

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
    <div className="input-group">
      <div className="input-text" >
        <input type={type} id={id} name={name} placeholder=" " 
          value={value} onChange={onChange} required={isRequired} title={title} 
          pattern={pattern} {...(setErrors && {
          onFocus: () => setErrors((prevErrors: Map<string, string>) => {
            if (!prevErrors) return prevErrors;
            const newErrors = new Map(prevErrors);
            newErrors.delete(id); 
            return newErrors;
          })})}/>
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
      {errors && errors.get(id) && (
          <div className="input-error" id="email-error">
            {errors.get(id)}
          </div>
        )}
    </div>
    
  );
}


export default FormInput;