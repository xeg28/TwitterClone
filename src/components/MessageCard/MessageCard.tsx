import React, {useEffect} from "react";
import './MessageCard.css';
import {motion} from 'framer-motion';
import {Message, removeMessage} from '../../types/Message';

type MessageCardProps = {
  messages: Set<Message>;
  setMessages: React.Dispatch<React.SetStateAction<Set<Message>>>;
}

const ErrorCard: React.FC<MessageCardProps> = ({
  messages,
  setMessages,
}) => {
  // useEffect(() => {
  //   if (messages && messages.size > 0) {
  //     const timer = setTimeout(() => {
  //       setMessages(new Set<Message>());
  //     }, 10000); // 10 seconds

  //     return () => clearTimeout(timer);
  //   }
  // }, [messages, setMessages]);

  return messages && messages.size > 0 ? (
    <div className="message-track">
      {Array.from(messages).map((message: Message, idx: number) => (
        <motion.div 
          initial={{ x: "105vw" }} // Start offscreen to the left
          animate={{ x: "0%" }} // Move to center
          transition={{ duration: .6}}
          className={"message-card " + message.type}
          key={message.type + message.content}>
          <div className="message">
            <span className="icon"></span>
            <button onClick={() => {removeMessage(message, setMessages)}}>&times;</button>
            <div>{message.content}</div>
          </div>
        </motion.div> 
      ))}
    </div>
    
  ) : null;
};


export default ErrorCard;