
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModel"; 

export default function Navbar({ onSearch }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between relative">
      {/* Logo + tagline */}
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-2xl font-bold">
          Mh
        </Link>
        <span className="text-gray-400 hidden sm:block">
          MotoHub | Compare, Browse & Explore Bikes
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex space-x-6 relative">
        <Link to="/" className="hover:text-gray-400">
          Home
        </Link>
        <Link to="/brands" className="hover:text-gray-400">
          Brands
        </Link>

        {/* Browse By Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsBrowseOpen(true)}
          onMouseLeave={() => setIsBrowseOpen(false)}
        >
          <button className="hover:text-gray-400">Browse By ▾</button>
          {isBrowseOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-gray-800 rounded shadow-lg z-50">
              <Link
                to="/browseby/year"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Year
              </Link>
              <Link
                to="/browseby/type"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Type
              </Link>
              <Link
                to="/browseby/price"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Price
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search + Actions */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search bikes..."
          onChange={(e) => onSearch(e.target.value)}
          className="px-3 py-1 rounded text-black"
        />
        <Link
          to="/compare"
          className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
        >
          Compare
        </Link>
        <Link
          to="/cart"
          className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
        >
          Cart
        </Link>
        <Link
          to="/saved"
          className="bg-yellow-500 px-4 py-1 rounded hover:bg-yellow-600"
        >
          Saved
        </Link>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-gray-700 px-4 py-1 rounded hover:bg-gray-800"
        >
          Login
        </button>
      </div>

      {/* Login Modal */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </nav>
  );
}