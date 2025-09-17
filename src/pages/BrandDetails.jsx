
import React from "react";
import { useParams, Link } from "react-router-dom";
import { brands, allBikes } from "../data/bikes";

export default function BrandDetails() {
  const { brandSlug } = useParams();
  const brand = brands.find(b => b.slug === brandSlug);
  if (!brand) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div>
          <h2 className="text-4xl">Brand not found</h2>
          <Link to="/brands" className="text-orange-500 mt-4 block">Back to brands</Link>
        </div>
      </div>
    );
  }

  const addToCompare = (bike) => {
    const stored = JSON.parse(localStorage.getItem("mh_compare") || "[]");
    const exists = stored.find(s => s.slug === bike.slug && s.brand === brand.name);
    if (!exists) {
      if (stored.length >= 3) {
        alert("You can compare up to 3 bikes. Remove one from compare first.");
        return;
      }
      stored.push({ ...bike, brand: brand.name, brandSlug: brand.slug });
      localStorage.setItem("mh_compare", JSON.stringify(stored));
      alert(`${bike.name} added to compare (UI-only).`);
    } else {
      alert("Bike already in compare.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4">
          <img src={brand.logo} alt={brand.name} className="w-20 h-12 object-contain rounded-md bg-gray-800 p-2" />
          <div>
            <h1 className="text-3xl font-bold">{brand.name}</h1>
            <p className="text-gray-400">Curated models, specs, colours and prices.</p>
          </div>
          <div className="ml-auto">
            <Link to="/compare" className="bg-orange-600 px-3 py-2 rounded-md">View Compare</Link>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl mb-4">Popular {brand.name} Bikes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brand.bikes.map(bike => (
              <div key={bike.slug} className="bg-gray-900 p-6 rounded-lg">
                <img src={bike.image} alt={bike.name} className="w-full h-40 object-cover rounded-md mb-4" />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{bike.name}</h3>
                    <p className="text-sm text-gray-400">{bike.bodyStyle}</p>
                  </div>
                  <div className="text-right text-gray-300">₹{bike.price.toLocaleString()}</div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={() => addToCompare(bike)} className="flex-1 bg-gray-800 px-3 py-2 rounded-md">Compare</button>
                  <button className="flex-1 bg-orange-600 px-3 py-2 rounded-md">Get Offers</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
