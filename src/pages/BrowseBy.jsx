
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { brands, allBikes } from "../data/bikes";


function BudgetBucket(price) {
  if (price < 100000) return "<100k";
  if (price < 200000) return "100k-200k";
  return ">200k";
}

export default function BrowseBy() {
  const [q] = useSearchParams();
  const tab = q.get("tab") || "brand";

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl mb-6">Browse By</h2>

        <div className="flex gap-4 mb-6">
          <Link to="/browse?tab=brand" className={`px-3 py-1 ${tab==="brand" ? "bg-orange-600" : "bg-gray-800"} rounded`}>Brand</Link>
          <Link to="/browse?tab=budget" className={`px-3 py-1 ${tab==="budget" ? "bg-orange-600" : "bg-gray-800"} rounded`}>Budget</Link>
          <Link to="/browse?tab=displacement" className={`px-3 py-1 ${tab==="displacement" ? "bg-orange-600" : "bg-gray-800"} rounded`}>Displacement</Link>
          <Link to="/browse?tab=bodystyle" className={`px-3 py-1 ${tab==="bodystyle" ? "bg-orange-600" : "bg-gray-800"} rounded`}>Body Style</Link>
        </div>

        {tab === "brand" && (
          <div>
            <h3 className="text-xl mb-4">By Brand</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {brands.map(b => (
                <Link key={b.slug} to={`/brands/${b.slug}`} className="bg-gray-900 p-4 rounded flex items-center gap-3">
                  <img src={b.logo} alt={b.name} className="w-20 h-12 object-contain"/>
                  <div>{b.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "budget" && (
          <div>
            <h3 className="text-xl mb-4">By Budget</h3>
            {["<100k", "100k-200k", ">200k"].map(bucket => (
              <div key={bucket} className="mb-6">
                <h4 className="font-semibold mb-2">{bucket}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {allBikes.filter(b => BudgetBucket(b.price) === bucket).map(b => (
                    <Link key={`${b.brandSlug}-${b.slug}`} to={`/brands/${b.brandSlug}`} className="bg-gray-900 p-4 rounded flex">
                      <img src={b.image} alt={b.name} className="w-28 h-18 object-cover rounded mr-4" />
                      <div>
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-sm text-gray-400">{b.brand} • ₹{b.price.toLocaleString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "displacement" && (
          <div>
            <h3 className="text-xl mb-4">By Displacement</h3>
            {[
              { key: "100-150", label: "100–150cc", fn: (d) => d >= 100 && d <= 150 },
              { key: "150-250", label: "150–250cc", fn: (d) => d > 150 && d <= 250 },
              { key: "250-400", label: "250–400cc", fn: (d) => d > 250 && d <= 400 },
              { key: "400+", label: "400cc+", fn: (d) => d > 400 },
            ].map(group => (
              <div key={group.key} className="mb-6">
                <h4 className="font-semibold mb-2">{group.label}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {allBikes.filter(b => group.fn(b.displacement)).map(b => (
                    <Link key={`${b.brandSlug}-${b.slug}`} to={`/brands/${b.brandSlug}`} className="bg-gray-900 p-4 rounded flex">
                      <img src={b.image} alt={b.name} className="w-28 h-18 object-cover rounded mr-4" />
                      <div>
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-sm text-gray-400">{b.brand} • {b.displacement}cc</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "bodystyle" && (
          <div>
            <h3 className="text-xl mb-4">By Body Style</h3>
            {["Cruiser", "Naked", "Sports", "Adventure", "Retro", "Commuter"].map(style => (
              <div key={style} className="mb-6">
                <h4 className="font-semibold mb-2">{style}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {allBikes.filter(b => b.bodyStyle === style).map(b => (
                    <Link key={`${b.brandSlug}-${b.slug}`} to={`/brands/${b.brandSlug}`} className="bg-gray-900 p-4 rounded flex">
                      <img src={b.image} alt={b.name} className="w-28 h-18 object-cover rounded mr-4" />
                      <div>
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-sm text-gray-400">{b.brand}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
