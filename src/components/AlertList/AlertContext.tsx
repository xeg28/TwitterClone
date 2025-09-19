import React, { createContext, useContext, useState, ReactNode } from "react";

type Alert = {
  id: number;
  type: "success" | "error" | "info";
  message: string;
  timeout?: NodeJS.Timeout;
};

type AlertContextType = {
  alerts: Alert[];
  addAlert: (message: string, type?: "success" | "error" | "info") => void;
  removeAlert: (alert: Alert) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (message: string, type: "success" | "error" | "info" = "info") => {
    const existing = alerts.find((a) => a.type === type && a.message === message);
    if(existing) return;
    const id = Date.now(); 

    const timeout = setTimeout(() => removeAlert({ id, type, message }), 7000);

    setAlerts((prev) => [...prev, { id, type, message, timeout }]);
  };

  const removeAlert = (alert: Alert) => {
    if (alert.timeout) clearTimeout(alert.timeout);

    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used inside AlertProvider");
  return context;
};