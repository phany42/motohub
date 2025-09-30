
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";  
import { CartProvider } from "./context/CartContext"; 
import { AlertProvider } from "./context/AlertContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
 
    <BrowserRouter>
    <AlertProvider>
      <CartProvider>
        <App />
      </CartProvider>
      </AlertProvider>
    </BrowserRouter>
 
);