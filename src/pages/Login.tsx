import MessageCard from '../components/MessageCard/MessageCard';
import { useLocation, useNavigate, Location} from "react-router-dom";
import {useState, useEffect} from 'react';
import {Message, addMessage} from '../types/Message';
const Login:React.FC = () => {
  const [messages, setMessages] = useState<Set<Message>>(new Set<Message>());
  const navigate = useNavigate();
  const location = useLocation() as Location;
    useEffect(() => {
    if (location.state?.success) {
      // Use the success message
      setMessages((prevMsgs:Set<Message>) => {
        const newMsgs = new Set<Message>(prevMsgs);
        newMsgs.add({type: 'success', content: location.state.success});
        return newMsgs;
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
      <button onClick={() => addMessage({type: "error", content: "this is an error"}, setMessages)}>Error</button>
      <button onClick={() => addMessage({type: "success", content: "this is a success"}, setMessages)}>Success</button>
      <MessageCard messages={messages} setMessages={setMessages} />
    </div>
  );
}

export default Login;