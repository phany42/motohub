import React from "react";
import { Link } from "react-router-dom";
import { brands, allBikes } from "../data/bikes";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="py-8">
          <h1 className="text-5xl font-extrabold">MotoHub</h1>
          <p className="mt-2 text-gray-300">Compare, browse and explore bikes — UI-only app.</p>
        </header>

        <section className="mt-8">
          <h2 className="text-2xl mb-4">Browse Brands</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
            {brands.map((b) => (
              <Link key={b.slug} to={`/brands/${b.slug}`} className="bg-gray-900 rounded-lg p-4 flex flex-col items-center">
                <img src={b.logo} alt={`${b.name} logo`} className="w-28 h-14 object-contain mb-2" />
                <div className="text-sm">{b.name}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
