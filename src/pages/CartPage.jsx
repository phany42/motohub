import React from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((bike) => (
            <div key={bike.id} className="bg-gray-900 p-4 rounded flex justify-between">
              <div>
                <h3>{bike.name}</h3>
                <p className="text-sm text-gray-400">{bike.brand}</p>
              </div>
              <button
                onClick={() => removeFromCart(bike.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
