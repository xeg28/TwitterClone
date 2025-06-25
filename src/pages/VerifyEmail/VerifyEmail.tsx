import {useEffect, useState, useRef} from "react";
import { useLocation, useNavigate, Location} from "react-router-dom";
import MessageCard from '../../components/MessageCard/MessageCard';
import "./VerifyEmail.css";
import {Message, addMessage} from '../../types/Message';


const VerifyEmail: React.FC = () => {
  document.title = "Verify Email";
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Set<Message>>(new Set<Message>());
  const [isLoading, setIsLoading] = useState<true | false>(false);
  const apiURL = process.env.REACT_APP_API_URL as string;
  const didRun = useRef(false);
  const didResend = useRef(false);

  const location = useLocation() as Location & {
    state: { email?: string };
  };
  
  const email = location.state?.email ?? "";

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
      return;
    }
    // Only call resendCode once, even in Strict Mode
    if (!didResend.current) {
      didResend.current = true;
      resendCode();
    }
  }, [email, navigate]);

  useEffect(() => {
    if (location.state?.success) {
      if (didRun.current) return;
        didRun.current = true;
      // Use the success message
      addMessage({type:'success', content:location.state.success}, setMessages);

      // Remove only the success key, keep others like email
      const { success, ...rest } = location.state;

      // Replace the state without refreshing
      navigate(location.pathname, {
        replace: true,
        state: rest,
      });
    }
  }, [navigate, location]);

  const handleVerification = async () => {
    const inputs = document.querySelectorAll(".verify-num") as NodeListOf<HTMLInputElement>;
    let code = "" as string;

    inputs.forEach((input) => {
      code += input.value;
    });

    const request = {email:email, code:code};
    setIsLoading(true);
    const response = await fetch(`${apiURL}/api/auth/verify-email`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(request), 
      credentials: "include"
    });

    const result = await response.json();
    setIsLoading(false);
    if(result.status === 200) {
      let message = {type:"success", content: result.message};
      navigate("/login", { state: {message}, replace: true });
    }
    else {
      addMessage({type:'error', content:result.message}, setMessages);
    }
  }


  const resendCode = async () => {
    const request = {email:email, code:""};
    const response = await fetch(`${apiURL}/api/auth/resend-code`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(request) 
    });
    const result = await response.json();
    return result;
  }


  const handleCodeResend = async () => {
    const result = await resendCode();

    if(result.status === 200) {
      addMessage({type:'success', content: result.message}, setMessages);
    }
    else {
      addMessage({type:'error', content:result.message}, setMessages);
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
        <button className="form-button" onClick={handleVerification}>
          {isLoading ? (<div className="spinner"></div>) : 
          (<span>Verfiy</span>)}
        </button>
      </div>
      <MessageCard messages={messages} setMessages={setMessages}/>
    </div>
  );
}

export default VerifyEmail;