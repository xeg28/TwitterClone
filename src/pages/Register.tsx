import React, {useState} from 'react';
import FormInput from '../components/FormInput/FormInput';
import MessageCard from '../components/MessageCard/MessageCard';
import {HOST} from '../config'
import { useNavigate } from "react-router-dom";
import {Message, addMessage} from '../types/Message';

type RegistrationData = {
  [name:string]: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const addData = (dataTitle: string, value: string, setData: React.Dispatch<React.SetStateAction<RegistrationData>>) => {
  setData((prev: RegistrationData) => {
    const newData = {...prev} as RegistrationData;
    newData[dataTitle] = value;
    return newData;
  });
}


const Registration: React.FC = () => {
  document.title = "Register";
  const [messages, setMessages] = useState<Set<Message>>(new Set<Message>());
  const [inputErrors, setInputErrors] = useState<Map<string, string>>(new Map<string, string>());
  const [form, setForm] = useState<'email' | 'password'>('email');
  const [data, setData] = useState<RegistrationData>({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
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
      const response = await fetch(`${apiURL}/api/users/email-check/${data.email.trim()}`);
      const result = await response.json();
      setIsLoading(false);

      if (result.status === 409) {
        setInputErrors((prevErrors: Map<string, string>)  => {
          const newErrors = new Map(prevErrors);
          newErrors.set("email", result.message);
          return newErrors;
        });
      }
      else if(result.status === 400) {
        addMessage({type: "error", content: result.message}, setMessages);
      }
      else if(emailInput.checkValidity() && nameInput.checkValidity()) {
        setForm("password");
      }

    } catch (error) {
        setIsLoading(false);
        addMessage({type: "error", content: "Connection Error, Try again."}, setMessages);
    }
  };

  const handleBack = () => {
    const form: HTMLElement | null = document.getElementById("password-form");
    const passwordInputs: NodeListOf<HTMLInputElement> | undefined = form?.querySelectorAll("input[type='password'");
    if(passwordInputs) {
      passwordInputs.forEach((el) => {
        el.value = "";
      });
    }
    setForm("email");
  }

 const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if(data.password !== data.confirmPassword){
      addMessage({type:"error", content:"Passwords do not match."}, setMessages);
      return;
    }

    var regsitration = {
      legalname:data.name.trim(),
      email:data.email.trim(),
      username:data.username.trim(),
      password:data.password
    }

    try{
      setIsLoading(true);
      var response = await fetch(`${apiURL}/api/auth/username-check/${data.username}`)
      var result = await response.json();

      if(result.status === 409) {
        setInputErrors((prevErrors: Map<string, string>) => {
          const newMap = new Map(prevErrors);
          newMap.set("username", result.message);
          return newMap;
        });
        setIsLoading(false);
        return;
      }

      response = await fetch(`${apiURL}/api/auth/register`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify(regsitration) 
      });

      result = await response.json();
      setIsLoading(false);
      if(result.status && result.status === 200) {
        let success = new Set<string>();
        let email = data.email;
        success.add("Successfuly registered")
        navigate("/verify-email", { state: {email , success }});
      }
      else if(result.status === 409) {
        addMessage({type:"error", content: result.message}, setMessages);
      }
    } catch(error) {
        setIsLoading(false);
        addMessage({type: "error", content: "Connection Error, Try again."}, setMessages);
    }
  }


  return (
    <div className="wrapper">
      {
        form === "email" && (
          <div className="form-wrapper">
            <h1 className="fs-xl">Create an account</h1>
            <form onSubmit={handleEmail} id="email-form">
              <div className="w-100">
                <FormInput type="text" id="name" name="name" value={data.name}
                  onChange={e => addData("name", e.target.value, setData)} placeholder="Name" 
                  isRequired={true} title="Name must be 2-50 letters only" 
                  pattern="[A-Za-z ]{2,50}"/>
                  
                <FormInput type="email" name="email" id="email" value={data.email}
                onChange={e => addData('email', e.target.value, setData)} placeholder="Email"
                isRequired={true} title="Enter a valid email address"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+" errors={inputErrors} setErrors={setInputErrors}/>
                
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
          <div className="form-wrapper" id="password-form">
            <div className='flex flex-row relative align-center' style={{marginBottom: "2rem"}}>
              <button className = "button-reset fs-xl bolder" id="back-btn" title="back" type="button" onClick={handleBack}>
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
                 <FormInput type="text" id="username" name="username" placeholder="Username"
                  value={data.username} onChange={e => addData('username', e.target.value, setData)}
                  pattern=".{2,50}" isRequired={true} title="Must be between 2-50 characters" 
                  errors={inputErrors} setErrors={setInputErrors}/>

                <FormInput type="password" id="password" name="password" placeholder="Password"
                    onChange={e=> addData('password', e.target.value, setData)} isRequired={true}
                    pattern="^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{5,50}$"
                    title="Must contain at least 5 characters, a number, and a special character" info={true}/>

                <FormInput type="password" id="c-password" name="c-password" 
                    placeholder="Confirm Password" onChange={e=>addData('confirmPassword', e.target.value, setData)}
                    pattern="^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{5,50}$" isRequired={true}/>

                <button className = "form-button" type="submit" >
                  { isLoading ? (<div className="spinner"></div>) :
                      (<span>Sign Up</span>)
                    }
                </button>
              </div>
            </form>
          </div>
        )}
        <MessageCard messages={messages} setMessages={setMessages}/>
    </div>

  );
}

export default Registration;
