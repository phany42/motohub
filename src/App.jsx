
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BrandsList from "./pages/BrandsList";
import BrandDetails from "./pages/BrandDetails";
import Compare from "./pages/Compare";
import BrowseBy from "./pages/BrowseBy";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0b0b0b]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/brands" element={<BrandsList />} />
          <Route path="/brands/:brandSlug" element={<BrandDetails />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/browse" element={<BrowseBy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
