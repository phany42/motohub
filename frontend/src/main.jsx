import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import CloudSyncManager from "./components/sync/CloudSyncManager";
import { registerServiceWorker } from "./utils/registerServiceWorker";

registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AlertProvider>
      <AuthProvider>
        <CartProvider>
          <CloudSyncManager />
          <App />
        </CartProvider>
      </AuthProvider>
    </AlertProvider>
  </BrowserRouter>
);
