import React, { useEffect } from "react";
import './AlertList.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useAlerts, useAlertActions } from "./AlertContext";
import { useLocation, useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
const AlertList: React.FC = () => {
  const { alerts, removeAlert } = useAlerts();
  const { addAlert } = useAlertActions();
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


  return alerts && typeof document !== "undefined" ?
    (
      <>
        {ReactDOM.createPortal(
          <div className="message-track">
            <AnimatePresence>
              {alerts.map((alert, idx: number) => (
                <motion.div
                  key={alert.type + alert.message + alert.id}
                  layout
                  initial={{ x: "105vw" }}
                  animate={{ x: "0%" }}
                  exit={{ x: "105vw" }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className={"message-card " + alert.type}>
                  <div className="message">
                    <span className="icon"></span>
                    <button onClick={() => { removeAlert(alert) }}>&times;</button>
                    <div>{alert.message}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
      </>
    ) : null;
};


export default AlertList;