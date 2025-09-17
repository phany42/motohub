import React from "react";
import { Link } from "react-router-dom";
import { brands, allBikes } from "../data/bikes";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-4 text-gray-400">Page not found</p>
        <Link to="/" className="inline-block mt-6 bg-orange-600 px-4 py-2 rounded">Back to Home</Link>
      </div>
    </div>
  );
}
