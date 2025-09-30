
import React from "react";
import { Link } from "react-router-dom";
import { brands, allBikes } from "../data/bikes";

export default function BrandsList() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl mb-6">All Brands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {brands.map(b => (
            <Link key={b.slug} to={`/brands/${b.slug}`} className="bg-gray-900 p-4 rounded-lg flex items-center hover:shadow-lg">
              <img src={b.logo} alt={b.name} className="w-20 h-12 object-contain mr-4"/>
              <div>
                <div className="text-lg font-semibold">{b.name}</div>
                <div className="text-sm text-gray-400">{b.bikes.length} models</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
