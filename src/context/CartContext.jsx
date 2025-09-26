
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]);

  const addToCart = (bike) => {
    if (!cart.find((item) => item.slug === bike.slug)) {
      setCart([...cart, bike]);
    }
  };

  const removeFromCart = (slug) => {
    setCart(cart.filter((item) => item.slug !== slug));
  };

  const saveForLater = (bike) => {
    if (!saved.find((item) => item.slug === bike.slug)) {
      setSaved([...saved, bike]);
    }
  };

  const removeFromSaved = (slug) => {
    setSaved(saved.filter((item) => item.slug !== slug));
  };

  return (
    <CartContext.Provider
      value={{ cart, saved, addToCart, removeFromCart, saveForLater, removeFromSaved }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}