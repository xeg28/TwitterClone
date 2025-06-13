import {useEffect, useState} from "react";
import { useLocation, useNavigate, Location} from "react-router-dom";
import MessageCard from '../../components/MessageCard/MessageCard';
import "./VerifyEmail.css";


const VerifyEmail: React.FC = () => {
  document.title = "Verify Email";
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Set<string>>(new Set<string>());
  const apiURL = process.env.REACT_APP_API_URL as string;
  const location = useLocation() as Location & {
    state: { email?: string };
  };
  
  const email = location.state?.email ?? "";

  const [successMessage, setSuccessMessage] = useState<Set<string>>(new Set<string>());


  useEffect(() => {
    if (location.state?.success) {
      // Use the success message
      setSuccessMessage((prevMsgs:Set<string>) => {
        const newMsg = new Set<string>(prevMsgs);
        newMsg.add(location.state.success);
        return newMsg;
      });

      // Remove only the success key, keep others like email
      const { success, ...rest } = location.state;

      // Replace the state without refreshing
      navigate(location.pathname, {
        replace: true,
        state: rest,
      });
    }
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate, location]);

  const handleVerification = async () => {
    const inputs = document.querySelectorAll(".verify-num") as NodeListOf<HTMLInputElement>;
    let code = "" as string;

    inputs.forEach((input) => {
      code += input.value;
    });

    const request = {email:email, code:code};
    const response = await fetch(`${apiURL}/api/auth/verify-email`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(request) 
    });

    const result = await response.json();
    
    if(result.status === 200) {
      let success = result.message;
      navigate("/", { state: {success}, replace: true });
    }
    else {
      setErrors((prevErrors: Set<string>) => {
        let newErrors = new Set<string>(prevErrors);
        newErrors.add(result.message);
        return newErrors;
      });
    }
  }


  const handleCodeResend = async () => {
    const request = {email:email, code:""};
    const response = await fetch(`${apiURL}/api/auth/resend-code`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(request) 
    });
    const result = await response.json();

    if(result.status === 200) {
      setSuccessMessage((prevMsg:Set<string>) => {
        const newMsgs = new Set<string>(prevMsg);
        newMsgs.add(result.message);
        return newMsgs;
      });
    }
    else {
      setErrors((prevErrors: Set<string>) => {
        let newErrors = new Set<string>(prevErrors);
        newErrors.add(result.message);
        return newErrors;
      });
    }

  }

  useEffect(() => {
    const inputs = document.querySelectorAll(".verify-num") as NodeListOf<HTMLInputElement>;
    const handleOnInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;
      if(isNaN(Number(value)) || value === " ") {
        target.value = "";
        return;
      }
      const index = Array.from(inputs).indexOf(target);
      if(index < inputs.length - 1 && value.length === 1) {
        inputs[index+1].focus();
      } 
    };

    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault();
      const pasteData = event.clipboardData?.getData('text').trim();
      const pasteArray = (pasteData) ? pasteData.split('') : null;

      if(pasteArray) {
        let index = 0;
        pasteArray.forEach((char) => {
          if(!isNaN(Number(char)) && index < inputs.length){
            inputs[index++].value = char;
          }
        });
      }
    };


   // inside useEffect
    const handleBackspace = (event: any) => {
      const input = event.target as HTMLInputElement;
      const index = Array.from(inputs).indexOf(input);
      if (event.key === 'Backspace') {
        if(index > 0) {
          event.preventDefault();
          input.value = "";
          inputs[index-1].focus();
        } 
      }
    };

    inputs.forEach((input) => {
      input.addEventListener('input', handleOnInput);
      input.addEventListener('paste', handlePaste);
      input.addEventListener('keydown', handleBackspace);
    });

    // Cleanup
    return () => {
        inputs.forEach((input) => {
          input.removeEventListener('input', handleOnInput);
          input.removeEventListener('paste', handlePaste);
          input.removeEventListener('keydown', handleBackspace);
        });
      };
    }, []);

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <div className="w-100 flex flex-col justfiy-content-center align-center gap-1">
          <h1 className="fs-xl m-0">Verification Code</h1>
          <div className="fs-m">Enter the 6 digit code sent to your email</div>
        </div>
        <div className="code-form">
          <div className="verify-input" >
            <input type="text" inputMode="numeric" className="verify-num" maxLength={1} />
            <input type="text" inputMode="numeric" className="verify-num" maxLength={1} />
            <input type="text" inputMode="numeric" className="verify-num" maxLength={1} />
            <input type="text" inputMode="numeric" className="verify-num" maxLength={1} />
            <input type="text" inputMode="numeric" className="verify-num" maxLength={1} />
            <input type="text" inputMode="numeric" className="verify-num" maxLength={1} />
          </div>
          <div className="resend-msg fs-m">Didn't receive a code? <span className="link" onClick={handleCodeResend}>Resend code</span></div>
        </div>
        <button className="form-button" onClick={handleVerification}>Verify</button>
      </div>
      <MessageCard messages={errors} setMessages={setErrors} messageType="error"/>
      <MessageCard messages={successMessage} setMessages={setSuccessMessage} messageType="success"/>
    </div>
  );
}

export default VerifyEmail;