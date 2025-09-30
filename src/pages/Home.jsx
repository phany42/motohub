import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { brands, allBikes } from "../data/bikes";

export default function Home() {
  const BIKES_PER_PAGE = 12;
  const [page, setPage] = useState(1);

  const [year, setYear] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [style, setStyle] = useState("");

  const bodyStyles = useMemo(() => {
    return Array.from(new Set(allBikes.map((b) => b.bodyStyle).filter(Boolean)));
  }, []);

  const filtered = useMemo(() => {
    return allBikes.filter((b) => {
      const matchYear = year ? String(b.year) === String(year) : true;
      const matchStyle = style ? b.bodyStyle === style : true;
      const matchPrice = (() => {
        if (!priceRange) return true;
        if (priceRange === "under1") return b.price < 100000;
        if (priceRange === "1to2") return b.price >= 100000 && b.price <= 200000;
        if (priceRange === "above2") return b.price > 200000;
        return true;
      })();
      return matchYear && matchStyle && matchPrice;
    });
  }, [year, style, priceRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / BIKES_PER_PAGE));
  const start = (page - 1) * BIKES_PER_PAGE;
  const pageItems = filtered.slice(start, start + BIKES_PER_PAGE);

  React.useEffect(() => {
    setPage(1);
  }, [year, style, priceRange]);

  return ( 
     <div className="relative min-h-screen overflow-hidden">
    {/* Background Video */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover -z-10"
    >
      
      <source src="https://cdn.pixabay.com/video/2020/08/30/48569-454825064_tiny.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* Overlay (to make text visible) */}
    <div className="absolute inset-0 bg-black/60 -z-10"></div>
      <div className="max-w-7x1 mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64">
          <div className="bg-black/60 rounded-lg p-4 h-[80vh] overflow-y-auto sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Popular Brands</h3>
            <div className="space-y-3">
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  to={`/brands/${b.slug}`}
                  className="flex items-center gap-3 bg-gray-800 rounded p-2 hover:bg-gray-700"
                >
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="w-16 h-8 object-contain"
                  />
                  <div className="text-sm">{b.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        
        <main className="flex-1">
          
          <div className="bg-gray-900 rounded-lg p-4 mb-6 flex flex-wrap items-center gap-3">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="">All Prices</option>
              <option value="under1">Under ₹1 Lakh</option>
              <option value="1to2">₹1 L – ₹2 L</option>
              <option value="above2">Above ₹2 Lakh</option>
            </select>

            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="">All Body Styles</option>
              {bodyStyles.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setYear("");
                setPriceRange("");
                setStyle("");
              }}
              className="ml-auto px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            >
              Clear
            </button>
          </div>

         
          <h2 className="text-2xl font-semibold mb-4">Available Bikes</h2>

          {pageItems.length === 0 ? (
            <p className="text-gray-400">No bikes match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {pageItems.map((bike) => (
                <Link
                  key={`${bike.brandSlug}-${bike.slug}`}
                  to={`/brands/${bike.brandSlug}`}
                  state={{ highlight: bike.slug }}
                  className="block"
                >
                  <article
                    className="bg-gray-900 rounded-lg p-4 h-full flex flex-col
                               transform transition duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-lg hover:shadow-orange-600/30"
                  >
                    <div className="w-full h-40 bg-gray-800 rounded overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src={bike.image}
                        alt={bike.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="mt-auto">
                      <h3 className="font-semibold">{bike.name}</h3>
                      <div className="text-sm text-gray-400">{bike.brand}</div>
                      <div className="text-sm text-red-600 font-semibold mt-2">
                        ₹{new Intl.NumberFormat("en-IN").format(bike.price)}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-gray-800 border border-gray-700"
            >
              Prev
            </button>
            <div className="text-sm text-gray-300 px-3">
              Page {page} of {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-gray-800 border border-gray-700"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    
    </div>
  );
}
