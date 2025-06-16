import React, {useEffect, useState} from 'react';
import FormInput from '../components/FormInput/FormInput';
import MessageCard from '../components/MessageCard/MessageCard';
import {HOST} from '../config'
import { useNavigate } from "react-router-dom";
import {Message, addMessage} from '../types/Message';

const Registration: React.FC = () => {
  document.title = "Register";
  const [messages, setMessages] = useState<Set<Message>>(new Set<Message>());
  const [inputErrors, setInputErrors] = useState<any>({});
  const [form, setForm] = useState<'email' | 'password'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState<true | false>(false);
  const apiURL = process.env.REACT_APP_API_URL as string;
  const navigate = useNavigate();
  
    // Function to handle form submission and fetch API
  const handleEmail = async (event: React.FormEvent) => {
    event.preventDefault();

    // Example fetch (adjust URL and payload as needed)
    try {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const nameInput = document.getElementById("name") as HTMLInputElement;
      setIsLoading(true);
      const response = await fetch(`${apiURL}/api/users/by-email/${email.trim()}`);
      const result = await response.json();
      setIsLoading(false);

      if (result.emailTaken) {
        setInputErrors((prevErrors: any) => ({
          ...prevErrors,
          emailTaken: true
        }));
      }
      else if(emailInput.checkValidity() && nameInput.checkValidity()) {
        setForm("password");
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

 const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if(password !== confirmPassword){
      addMessage({type:"error", content:"Passwords do not match."}, setMessages);
      return;
    }

    var regsitration = {
      legalname:name.trim(),
      email:email.trim(),
      username:username.trim(),
      password:password
    }

    setIsLoading(true);
    const response = await fetch(`${apiURL}/api/auth/register`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(regsitration) 
    });

    const result = await response.json();
    setIsLoading(false);
    if(result.status && result.status === 200) {
      let success = new Set<string>();
      success.add("Successfuly registered")
      navigate("/verify-email", { state: { email, success }});
    }
    else if(result.emailTaken || result.usernameTaken) {
      setInputErrors((prevErrors: any) => ({
        ...prevErrors,
        emailTaken: result.emailTaken, 
        usernameTaken: result.usernameTaken
      }));
    }
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

  return (
    <div className="wrapper">
      {
        form === "email" && (
          <div className="form-wrapper">
            <h1 className="fs-xl">Create an account</h1>
            <form onSubmit={handleEmail}>
              <div className="w-100">
                 <div className="input-group">
                  <FormInput type="text" id="name" name="name" value={name}
                    onChange={e => setName(e.target.value)} placeholder="Name" 
                    isRequired={true} title="Name must be 2-50 letters only" 
                    pattern="[A-Za-z ]{2,50}"/>
                </div>
                <div className="input-group">
                  <FormInput type="email" name="email" id="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="Email"
                  isRequired={true} title="Enter a valid email address"
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  onFocus={() => setInputErrors((prevErrors: any) =>
                        prevErrors ? { ...prevErrors, emailTaken: false } : prevErrors
                        )}/>
                  {inputErrors && inputErrors.emailTaken && (
                    <div className="input-error" id="email-error">
                      This email is already taken.
                    </div>
                  )}
                </div>
                <hr className='w-100' />
              </div>
              <div className="w-100">
                <div style={{marginBottom: '1rem', marginLeft:'.25rem'}}>Already have an account? <a href={HOST+'/'}>Login</a></div>
                <button className="form-button relative" type="submit">
                  { isLoading ? (<div className="spinner"></div>) :
                    (<span>Next</span>)
                  }
                </button>
              </div>
            </form>
          </div>  
        )}
        {form === "password" && (
          <div className="form-wrapper">
            <div className='flex flex-row relative align-center' style={{marginBottom: "2rem"}}>
              <button className = "button-reset fs-xl bolder" id="back-btn" title="back" type="button" onClick={() => setForm("email")}>
                <svg  className="back-icon"
                  fill="currentColor"
                  width="1em"
                  height="1em"
                  viewBox="0 0 42 42"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fill-rule="evenodd" points="31,38.32 13.391,21 31,3.68 28.279,1 8,21.01 28.279,41 "></polygon> </g></svg>
                  
              </button>
              <h1 className='form-title'>
                Create an account</h1>
            </div>
            
            <form onSubmit={handleRegister}>
              {/* ...password fields... */}
              <div className="w-100">
                <div className="input-group">
                  <FormInput type="text" id="username" name="username" placeholder="Username"
                  value={username} onChange={e => setUsername(e.target.value)}
                  pattern=".{2,50}" isRequired={true} title="Must be between 2-50 characters"
                  onFocus={() => setInputErrors((prevErrors: any) => 
                    prevErrors ? {...prevErrors, usernameTaken: false} : prevErrors
                  )} />
                  {inputErrors && inputErrors.usernameTaken && (
                    <div className="input-error" id="username-error">
                      Username is already taken
                    </div>
                  )}
                </div>
                <div className="input-group">
                  <FormInput type="password" id="password" name="password" placeholder="Password"
                    onChange={e=> setPassword(e.target.value)} isRequired={true}
                    pattern="^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{5,50}$"
                    title="Must contain at least 5 characters, a number, and a special character" info={true}/>
                </div>
                <div className="input-group">
                  <FormInput type="password" id="c-password" name="c-password" 
                    placeholder="Confirm Password" onChange={e=>setConfirmPassword(e.target.value)}
                    pattern="^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{5,50}$" isRequired={true}/>
                </div>
                <button className = "form-button" type="submit" >
                  { isLoading ? (<div className="spinner"></div>) :
                      (<span>Sign Up</span>)
                    }
                </button>
              </div>
            </form>
            <MessageCard messages={messages} setMessages={setMessages}/>
          </div>
        )}
    </div>

  );
}

export default Registration;
