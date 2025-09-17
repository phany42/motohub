
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LoginModal from "./LoginModel";
import { brands } from "../data/bikes";

export default function Navbar() {
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo + Links */}
            <div className="flex items-center space-x-4">
              <div className="text-lg font-bold">Mh</div>
              <Link to="/" className="font-semibold text-xl">
                MotoHub
              </Link>

              <div className="hidden md:flex items-center ml-6 space-x-4">
                <Link to="/" className="hover:underline">
                  Home
                </Link>

                {/* Direct navigation to Brands */}
                <Link to="/brands" className="hover:underline">
                  Brands
                </Link>

                {/* Direct navigation to Browse */}
                <Link to="/browse" className="hover:underline">
                  Browse By
                </Link>

                {/* Compare stays the same */}
                <Link to="/compare" className="hover:underline">
                  Compare
                </Link>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setOpenLogin(true)}
                className="text-sm px-3 py-1 rounded-md border border-gray-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
}
