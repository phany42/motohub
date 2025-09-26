import React from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((bike) => (
            <div
              key={bike.id || bike.slug}
              className="flex justify-between items-center bg-gray-900 p-4 rounded-md"
            >
              <div>
                <h3 className="font-semibold">{bike.name}</h3>
                <p className="text-sm text-gray-400">{bike.brand}</p>
              </div>
              <button
                onClick={() => removeFromCart(bike.id || bike.slug)}
                className="text-red-500 hover:text-red-400"
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