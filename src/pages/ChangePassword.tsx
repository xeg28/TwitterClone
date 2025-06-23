import {useState} from 'react';
import FormInput from '../components/FormInput/FormInput';
import {Message, addMessage} from '../types/Message';
import MessageCard from '../components/MessageCard/MessageCard';
import { useNavigate, useLocation } from 'react-router-dom';
const ResetPassword: React.FC = () => {
  document.title = "Change Password";
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<true | false>(false);
  const [messages, setMessages] = useState<Set<Message>>(new Set());
  const apiURL = process.env.REACT_APP_API_URL as string;
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (event:React.FormEvent) => {
    event.preventDefault();
    try {
      if(password !== confirmPassword) {
        addMessage({type:"error", content: "Passwords don't match"}, setMessages);
        return;
      }
      const queryParams = new URLSearchParams(location.search);
      const email = queryParams.get("email") as string;
      const token = queryParams.get("token") as string;

      if(!email || !token) {
        addMessage({type:"error", content: "Invalid Link"}, setMessages);
        return;
      }

      setIsLoading(true);

      const request = {
        Email: email,
        Token: token,
        NewPassword: password
      }

      const response = await fetch(`${apiURL}/api/passwordreset/change-password`, {
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });

      const result = await response.json();

      if(result.status === 200) {
        let message = {type: "success", content: result.message};
        navigate('/Login', {state: {message}});
      }
      else if(result.status === 400) {
        let message = {type: "error", content: result.message};
        navigate('/Login', {state: {message}});
      }
      else if(result.status === 409) {
        addMessage({type:"error", content: result.message}, setMessages);
      }
    }
    catch(e) {
      console.log(e);
    }
    finally {
      setIsLoading(false);
    }
  } 
  return(
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="fs-xl">Change Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="w-100">
            <FormInput type="password" id="password" name="password" placeholder="Password"
                  onChange={e=> setPassword(e.target.value)} isRequired={true}
                  pattern="^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{5,50}$"
                  title="Must contain at least 5 characters, a number, and a special character" info={true}/>
            <FormInput type="password" id="c-password" name="c-password" 
                    placeholder="Confirm Password" onChange={e=>setConfirmPassword(e.target.value)}
                    pattern="^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{5,50}$" isRequired={true}/>
            <button className='form-button' type="submit">
              {isLoading ? (
                <div className="spinner"></div>
              ) : 
              (<span>Change</span>)}
            </button>
            
          </div>
        </form>
      </div>
      <MessageCard messages={messages} setMessages={setMessages} />
    </div>
  )
}

export default ResetPassword;