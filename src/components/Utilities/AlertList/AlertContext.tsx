import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

type Alert = {
  id: number;
  type: "success" | "error" | "info";
  message: string;
  timeout?: ReturnType<typeof setTimeout>;
};

type AlertActions = {
  addAlert: (message: string, type?: Alert["type"]) => void;
};

type AlertState = {
  alerts: Alert[];
  removeAlert: (alert: Alert) => void;
};

const AlertActionsContext = createContext<AlertActions | undefined>(undefined);
const AlertStateContext = createContext<AlertState | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback(
    (message: string, type: Alert["type"] = "info") => {
      setAlerts((prev) => {
        if (prev.some((a) => a.type === type && a.message === message))
          return prev;
        const id = Date.now();
        const timeout = setTimeout(() => {
          setAlerts((cur) => cur.filter((a) => a.id !== id));
        }, 7000);
        return [...prev, { id, type, message, timeout }];
      });
    },
    []
  );

  const removeAlert = useCallback((alert: Alert) => {
    if (alert.timeout) clearTimeout(alert.timeout);
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
  }, []);

  const actions = useMemo(() => ({ addAlert }), [addAlert]);
  const state = useMemo(() => ({ alerts, removeAlert }), [alerts, removeAlert]);

  return (
    <AlertActionsContext.Provider value={actions}>
      <AlertStateContext.Provider value={state}>{children}</AlertStateContext.Provider>
    </AlertActionsContext.Provider>
  );
};

export const useAlertActions = () => {
  const ctx = useContext(AlertActionsContext);
  if (!ctx) throw new Error("useAlertActions must be used within AlertProvider");
  return ctx;
};

export const useAlerts = () => {
  const ctx = useContext(AlertStateContext);
  if (!ctx) throw new Error("useAlerts must be used within AlertProvider");
  return ctx;
};