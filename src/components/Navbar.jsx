
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModel from "./LoginModel";
import { brands } from "../data/bikes";

export default function Navbar() {
  const [openLogin, setOpenLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [browseOpen, setBrowseOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/browse?search=${encodeURIComponent(q)}`);
    setSearch("");
  };

  return (
    <>
      <nav className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
           
            <div className="flex items-center gap-6">
              <Link to="/" className="text-lg font-bold">
                Mh
              </Link>

              <span className="hidden sm:inline text-sm text-gray-300">
                MotoHub | Compare, Browse & Explore Bikes
              </span>

              <div className="hidden md:flex items-center gap-4 ml-6">
                <Link to="/" className="hover:underline">
                  Home
                </Link>

                <Link to="/brands" className="hover:underline">
                  Brands
                </Link>

                
                <div
                  className="relative"
                  onMouseEnter={() => setBrowseOpen(true)}
                  onMouseLeave={() => setBrowseOpen(false)}
                >
                  <button className="hover:underline">Browse By ▾</button>
                  {browseOpen && (
                    <div className="absolute left-0 mt-2 bg-gray-800 rounded shadow-lg p-2 min-w-[200px] z-30">
                      <button
                        onClick={() => navigate("/browse?tab=brand")}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
                      >
                        Brand
                      </button>
                      <button
                        onClick={() => navigate("/browse?tab=budget")}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
                      >
                        Budget
                      </button>
                      <button
                        onClick={() => navigate("/browse?tab=displacement")}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
                      >
                        Displacement
                      </button>
                      <button
                        onClick={() => navigate("/browse?tab=bodystyle")}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
                      >
                        Body Style
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="hidden sm:block">
                <input
                  type="text"
                  placeholder="Search bikes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-1 rounded-md bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none"
                />
              </form>

              <Link to="/compare" className="text-sm px-3 py-1 rounded-md border border-gray-700 hover:bg-gray-800">
                Compare
              </Link>

              
              <button className="hidden sm:inline text-sm px-3 py-1 rounded-md border border-gray-700 hover:bg-gray-800">
                Cart
              </button>
              <button className="hidden sm:inline text-sm px-3 py-1 rounded-md border border-gray-700 hover:bg-gray-800">
                Saved
              </button>

              <button
                onClick={() => setOpenLogin(true)}
                className="text-sm px-3 py-1 rounded-md border bg-red-500 border-red-700 hover:bg-red-800"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      
      <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
}
