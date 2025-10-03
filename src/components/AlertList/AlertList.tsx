import React, { useEffect } from "react";
import './AlertList.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useAlert} from "./AlertContext";
import { useLocation, useNavigate, Location} from "react-router-dom";

const AlertList: React.FC = () => {
  const { alerts, removeAlert, addAlert} = useAlert();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
      if (location.state?.message) {
        // Use the success message
        let msg = location.state.message;
        addAlert(msg.content, msg.type);
  
        const { message, ...rest } = location.state;
        navigate(location.pathname, {
          replace: true,
          state: rest,
        });
      }
    }, [location, navigate, addAlert]);
  

  return alerts ? (
    <div className="message-track">
      <AnimatePresence>
        {alerts.map((alert, idx: number) => (
          <motion.div
            key={alert.type + alert.message + alert.id}
            layout 
            initial={{ x: "105vw" }}
            animate={{ x: "0%" }}
            exit={{ x: "105vw" }}
            transition={{ type: "spring", stiffness: 500, damping: 35}}
            className={"message-card " + alert.type}>
            <div className="message">
              <span className="icon"></span>
              <button onClick={() => { removeAlert(alert) }}>&times;</button>
              <div>{alert.message}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

  ) : null;
};


export default AlertList;