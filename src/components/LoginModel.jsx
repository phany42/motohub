
import React, { useState } from "react";


export default function LoginModal({ open, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
   
    const user = { username, loggedAt: new Date().toISOString() };
    localStorage.setItem("mh_user", JSON.stringify(user));
    alert(`Welcome, ${username || "user"}! (UI-only login)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose} />
      <div className="relative bg-gray-900 text-white rounded-lg p-6 w-full max-w-md z-10 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Login to MotoHub</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name or email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password (UI-only)"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-md"
            >
              Login
            </button>
            <button type="button" onClick={onClose} className="text-sm text-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
