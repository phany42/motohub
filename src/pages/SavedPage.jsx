import React from "react";
import { useCart } from "../context/CartContext";

export default function SavedPage() {
  const { saved, removeFromSaved, addToCart } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Saved for Later</h2>
      {saved.length === 0 ? (
        <p className="text-gray-400">No bikes saved for later.</p>
      ) : (
        <div className="space-y-4">
          {saved.map((bike) => (
            <div
              key={bike.id || bike.slug}
              className="flex justify-between items-center bg-gray-900 p-4 rounded-md"
            >
              <div>
                <h3 className="font-semibold">{bike.name}</h3>
                <p className="text-sm text-gray-400">{bike.brand}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(bike)}
                  className="text-green-500 hover:text-green-400"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromSaved(bike.id || bike.slug)}
                  className="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}