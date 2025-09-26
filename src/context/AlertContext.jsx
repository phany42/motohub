import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 2500);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
      {alert && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 ${
          alert.type === "error" ? "bg-red-600" :
          alert.type === "success" ? "bg-green-600" :
          "bg-blue-600"
        }`}>
          {alert.message}
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
