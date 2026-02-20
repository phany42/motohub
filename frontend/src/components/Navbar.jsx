
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModel from "./LoginModel";
import { brands } from "../data/bikes";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [openLogin, setOpenLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [placeholder, setPlaceholder] = useState("Search bikes...");
  const navigate = useNavigate();
  const { cart, saved } = useCart();

  const handleSearch = (e) => {
    e?.preventDefault?.();
    const q = (search || "").trim().toLowerCase();
    if (!q) return;

    const found = brands.find(
      (b) =>
        b.name.toLowerCase() === q ||
        b.slug.toLowerCase() === q ||
        b.name.toLowerCase().includes(q)
    );

    if (found) {
      setSearch("");
      setSearchError("");
      setPlaceholder("Search bikes...");
      navigate(`/brands/${found.slug}`);
      return;
    }

    setSearch("");
    setSearchError("Brand not found");
    setPlaceholder("Brand not found");
    setTimeout(() => {
      setSearchError("");
      setPlaceholder("Search bikes...");
    }, 2500);
  };

  return (
    <>
      <nav className="bg-[#06101a] text-white border-b border-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 h-14">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-semibold text-lg">Mh</Link>
              <Link to="/" className="text-sm text-white/90">MotoHub</Link>
              <Link to="/" className="text-sm text-white/70">Home</Link>
              <Link to="/brands" className="text-sm text-white/70">Brands</Link>
              <Link to="/browseby" className="text-sm text-white/70">Browse By</Link>
              <Link to="/news" className="text-sm text-white/70">News</Link>
             

            </div>

            <form onSubmit={handleSearch} className="flex-1">
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full rounded-md px-3 py-2 bg-[#0b1013] border ${
                      searchError ? "border-rose-500" : "border-neutral-700"
                    } outline-none text-white placeholder:text-neutral-400`}
                  />
                  <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-neutral-800 text-sm">
                    Search
                  </button>
                </div>
                {searchError && <div className="mt-1 text-rose-400 text-sm">{searchError}</div>}
              </div>
            </form>

            <div className="ml-auto flex items-center gap-3">
              <Link to="/compare" className="text-sm px-3 py-1 rounded-md border">Compare</Link>
              <Link to="/cart" className="text-sm px-3 py-1 rounded-md border">Cart ({cart.length})</Link>
              <Link to="/saved" className="text-sm px-3 py-1 rounded-md border">Saved ({saved.length})</Link>
              <button onClick={() => setOpenLogin(true)} className="text-sm px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-500">Login</button>
            </div>
          </div>
        </div>
      </nav>

      <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
}