import React, {useEffect} from "react";
import './MessageCard.css';
import {motion} from 'framer-motion';

type MessageCardProps = {
  messages: Set<string>;
  setMessages: React.Dispatch<React.SetStateAction<Set<string>>>;
  messageType: string;
}

const ErrorCard: React.FC<MessageCardProps> = ({
  messages,
  setMessages,
  messageType 
}) => {
  useEffect(() => {
    if (messages && messages.size > 0) {
      const timer = setTimeout(() => {
        setMessages(new Set<string>());
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [messages, setMessages]);

  return messages && messages.size > 0 ? (
    <div className="message-track">
      {Array.from(messages).map((err: string, idx: number) => (
        <motion.div 
          initial={{ x: "105vw" }} // Start offscreen to the left
          animate={{ x: "0%" }} // Move to center
          transition={{ duration: .6}}
          className={"message-card " + messageType}
          key={idx}>
          <div className="message">
            <span className="icon"></span>
            <button onClick={() => {setMessages((prevErrors: Set<string>) => {
                let newErrors = new Set<string>(prevErrors);
                newErrors.delete(err);
                return newErrors;
            });}}>&times;</button>
            <div>{err}</div>
          </div>
        </motion.div> 
      ))}
    </div>
    
  ) : null;
};


export default ErrorCard;