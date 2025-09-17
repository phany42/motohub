
import React, { useState, useEffect } from "react";
import { brands, allBikes } from "../data/bikes";

export default function Compare() {
  const [selected, setSelected] = useState([]);
  const [available, setAvailable] = useState(allBikes);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("mh_compare") || "[]");
    if (stored.length) {
      setSelected(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mh_compare", JSON.stringify(selected));
  }, [selected]);

  const toggleSelect = (bike) => {
    const exists = selected.find(s => s.slug === bike.slug && s.brand === bike.brand);
    if (exists) {
      setSelected(selected.filter(s => !(s.slug === bike.slug && s.brand === bike.brand)));
    } else {
      if (selected.length >= 3) {
        alert("You can compare up to 3 bikes only.");
        return;
      }
      setSelected([...selected, bike]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl mb-4">Compare Bikes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {available.map(bike => (
            <div key={`${bike.brandSlug}-${bike.slug}`} className="bg-gray-900 p-3 rounded-md flex items-center gap-3">
              <img src={bike.image} alt={bike.name} className="w-20 h-12 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{bike.name}</div>
                <div className="text-sm text-gray-400">{bike.brand} • ₹{bike.price.toLocaleString()}</div>
              </div>
              <button
                className={`px-3 py-1 rounded ${selected.find(s => s.slug === bike.slug && s.brand === bike.brand) ? "bg-orange-600" : "bg-gray-800"}`}
                onClick={() => toggleSelect(bike)}
              >
                {selected.find(s => s.slug === bike.slug && s.brand === bike.brand) ? "Selected" : "Add"}
              </button>
            </div>
          ))}
        </div>

        <div>
          {selected.length === 0 ? (
            <div className="text-gray-400">No bikes selected for compare. Add up to 3 bikes from list above or from brand pages.</div>
          ) : (
            <div className="overflow-x-auto bg-gray-900 rounded p-4">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-left p-2">Feature</th>
                    {selected.map((s, i) => <th key={i} className="p-2 text-left">{s.brand} <div className="font-semibold">{s.name}</div></th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 font-medium">Price</td>{selected.map(s => <td key={s.slug} className="p-2">₹{s.price.toLocaleString()}</td>)}</tr>
                  <tr><td className="p-2 font-medium">Displacement</td>{selected.map(s => <td key={s.slug} className="p-2">{s.displacement} cc</td>)}</tr>
                  <tr><td className="p-2 font-medium">Body Style</td>{selected.map(s => <td key={s.slug} className="p-2">{s.bodyStyle}</td>)}</tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
