import { useNavigate} from "react-router-dom";
import {useState} from 'react';
import { useAlertActions } from '../../components/AlertList/AlertContext';
import FormInput from '../../components/FormInput/FormInput';
import {HOST} from '../../config'
import './Login.css';

type LoginData = {
  [user:string]: string;
  password: string;
}

const addData = (dataType: string, value: string, setData: React.Dispatch<React.SetStateAction<LoginData>>) => {
  setData((prevData:LoginData) => {
    const newData = {...prevData};
    newData[dataType] = value;
    return newData;
  });
}

const Login:React.FC = () => {

  document.title = "Login";
  
  const { addAlert } = useAlertActions();
  const [isLoading, setIsLoading] = useState<true | false>(false);
  const [data, setData] = useState<LoginData>({
    user: "",
    password: ""
  });
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL as string;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const loginData = {...data};

    try {
      setIsLoading(true);
      const response = await fetch(`${apiURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });
      const result = await response.json();
      if(result.status === 401) {
         addAlert(result.message, "error");
         addData('password', "", setData);
      }
      else if(result.status === 200) {
        navigate('/');
      }
    } catch(e) {
        addAlert("Server error, try again", "error");
    }
    finally {
      setIsLoading(false);
    }

  }

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="fs-xl">Sign In</h1>
        <form className="login-form" onSubmit={handleLogin} id="login-form">
          <div className="w-100">
            <FormInput type="text" name="email-user" id="email-user" value={data.user}
                  onChange={e => addData('user', e.target.value, setData)} placeholder="Email or Username"
                  isRequired={true} title=""
                  pattern=".*" />
            <FormInput type="password" id="password" name="password" placeholder="Password"
                    onChange={e=> addData('password', e.target.value, setData)} isRequired={true}
                    pattern=".*" value={data.password}/>
            <hr className='w-100 d-none-500'/>
          </div>
          <div className="w-100">
            <div className="flex space-between d-none-500"  style={{marginBottom: '1rem', marginLeft:'.25rem'}}>
              <span>Don't have an account? <a className="link" href={HOST+'/register'}>Register</a></span>
              <a href={HOST+'/account-recovery'}>Forgot Password</a>
            </div>
              <button className="form-button relative" type="submit">
                { isLoading ? (<div className="spinner"></div>) :
                  (<span>Login</span>)
                }
              </button>
          </div>
        </form>
         <div id="register-btn">
                <div id="or-line">
                  <hr />
                  <span >or</span>
                </div>
                <button className='form-button' type="button" onClick={()=>{navigate('/register')}}>Create Account</button>
                <span className='w-100 text-center'>Forgot password? <a href={HOST+'/account-recovery'}>Reset</a></span>
              </div>
      </div>
    </div>
  );
}

export default Login;