import React from "react";
import './AlertList.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useAlert } from "./AlertContext";

const AlertList: React.FC = () => {
  const { alerts, removeAlert } = useAlert();

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