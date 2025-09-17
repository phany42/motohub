import React, { useState } from "react";
import { Link } from "react-router-dom";
import { allBikes, brands } from "../data/bikes";

export default function Home() {
  const bikesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * bikesPerPage;
  const indexOfFirst = indexOfLast - bikesPerPage;
  const currentBikes = allBikes.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(allBikes.length / bikesPerPage);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex">
        {/* Popular Brands Sidebar */}
        <aside className="hidden lg:block w-64 bg-gray-800 rounded p-4 overflow-y-auto h-screen sticky top-0">
          <h2 className="text-xl font-semibold mb-4">Popular Brands</h2>
          <div className="space-y-3">
            {brands.map((b) => (
              <Link
                key={b.slug}
                to={`/brands/${b.slug}`}
                className=" bg-gray-700 rounded-lg p-2 flex items-center"
              >
                <img src={b.logo} alt={`${b.name}`} className="w-14 h-8 mr-3" />
                <span>{b.name}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-6">
          <header className="py-4">
            <h1 className="text-5xl font-extrabold">MotoHub</h1>
            <p className="mt-2 text-gray-300">
              Compare, browse and explore bikes — UI-only app.
            </p>
          </header>

          {/* Bikes Grid */}
          <section className="mt-6">
            <h2 className="text-2xl mb-4">Available Bikes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {currentBikes.map((bike) => (
                <div
                  key={bike.id}
                  className="bg-gray-900 rounded-lg p-4 flex flex-col"
                >
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="w-full h-32 object-contain mb-2"
                  />
                  <h3 className="text-lg font-semibold">{bike.name}</h3>
                  <p className="text-sm text-gray-400">{bike.brand}</p>
                  <p className="text-sm text-green-400">{bike.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

