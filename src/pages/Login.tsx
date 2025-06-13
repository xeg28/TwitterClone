import MessageCard from '../components/MessageCard/MessageCard';
import { useLocation, useNavigate, Location} from "react-router-dom";
import {useState, useEffect} from 'react';
const Login:React.FC = () => {
  const [errors, setErrors] = useState<Set<string>>(new Set<string>());
  const [successMessages, setSuccessMessages] = useState<Set<string>>(new Set<string>());
  const navigate = useNavigate();
  const location = useLocation() as Location;
    useEffect(() => {
    if (location.state?.success) {
      // Use the success message
      setSuccessMessages((prevMsgs:Set<string>) => {
        const newMsg = new Set<string>(prevMsgs);
        newMsg.add(location.state.success);
        return newMsg;
      });

      // Remove only the success key, keep others
      const { success, ...rest } = location.state;

      // Replace the state without refreshing
      navigate(location.pathname, {
        replace: true,
        state: rest,
      });
    }
  }, [navigate, location]);

  return (
    <div className="container">
      login
      <MessageCard messages={errors} setMessages={setErrors} messageType='error'/>
      <MessageCard messages={successMessages} setMessages={setSuccessMessages} messageType='success'/>
    </div>
  );
}

export default Login;