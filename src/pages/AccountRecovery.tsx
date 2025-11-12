import FormInput from '../components/FormInput/FormInput';
import {useState} from 'react';
import { useAlertActions } from '../components/AlertList/AlertContext';
import { useNavigate } from 'react-router-dom';

const AccountRecovery: React.FC = () => {
  document.title = "Recover Account";
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const { addAlert } = useAlertActions();
  const [isLoading, setIsLoading] = useState<true | false>(false);
  const apiURL = process.env.REACT_APP_API_URL as string;
  const handleSubmit = async (event:React.FormEvent) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(`${apiURL}/api/passwordreset/request`, 
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(email)
      });
      const result = await response.json();
      if(result.status === 200) {
        let message = {type: "success", content: result.message};
        navigate('/login', {state: {message}})
      }
      else {
        addAlert(result.message, 'error');
      }
    } catch(e) {
      
    }
    finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="fs-xl">Recover Account</h1>
        <form onSubmit={handleSubmit} id="recover-form">
          <div className="w-100">
            <FormInput type="email" id="email" name="email" 
            onChange={(e) => {setEmail(e.target.value)}} isRequired={true} 
            pattern="[^@\s]+@[^@\s]+\.[^@\s]+" placeholder='Email'
            value={email}/>
            <button className="form-button relative" type="submit">
                { isLoading ? (<div className="spinner"></div>) :
                  (<span>Recover</span>)
                }
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountRecovery