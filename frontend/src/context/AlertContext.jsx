import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback((message, type = "info", ttlMs = 2600) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setAlerts((current) => [...current, { id, message, type }]);

    window.setTimeout(() => {
      removeAlert(id);
    }, ttlMs);
  }, [removeAlert]);

  const value = useMemo(
    () => ({ alerts, showAlert, removeAlert }),
    [alerts, showAlert, removeAlert]
  );

  return (
    <AlertContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              alert.type === "error"
                ? "border-red-300/60 bg-red-700/85 text-red-50"
                : alert.type === "success"
                ? "border-emerald-300/60 bg-emerald-700/85 text-emerald-50"
                : "border-sky-300/60 bg-sky-700/85 text-sky-50"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <p>{alert.message}</p>
              <button
                type="button"
                onClick={() => removeAlert(alert.id)}
                className="rounded-md border border-white/30 px-1.5 py-0.5 text-xs text-white/80"
              >
                close
              </button>
            </div>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider");
  }

  return context;
}
