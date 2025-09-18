import React, { useEffect, useState } from "react";
import { allBikes } from "../data/bikes";

export default function Compare() {
 
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mh_compare") || "[]");
    setCompareList(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("mh_compare", JSON.stringify(compareList));
  }, [compareList]);

  const toggleCompare = (slug) => {
    if (compareList.includes(slug)) {
      setCompareList(compareList.filter((s) => s !== slug));
    } else {
      setCompareList([...compareList, slug]);
    }
  };

  const clearAll = () => setCompareList([]);

  const selectedBikes = compareList.map((slug) => allBikes.find((b) => b.slug === slug)).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Compare Bikes</h1>

        <div className="flex gap-6">
          
          <aside className="w-80 shrink-0">
            <div className="bg-gray-900 rounded-lg p-4 h-[70vh] overflow-y-auto sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Add Bikes to Compare</h2>
                <button onClick={clearAll} className="text-xs px-2 py-1 rounded border border-gray-700">Clear</button>
              </div>

              <div className="space-y-3">
                {allBikes.map((b) => {
                  const added = compareList.includes(b.slug);
                  return (
                    <div key={b.slug} className="flex items-center gap-3 bg-gray-800 p-2 rounded">
                      <img src={b.image} alt={b.name} className="w-14 h-10 object-cover rounded" />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{b.name}</div>
                        <div className="text-xs text-gray-400">{b.brand} • ₹{b.price.toLocaleString("en-IN")}</div>
                      </div>
                      <button
                        onClick={() => toggleCompare(b.slug)}
                        className={`text-sm px-3 py-1 rounded ${added ? "bg-red-600" : "bg-rose-600"}`}
                      >
                        {added ? "Remove" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          
          <main className="flex-1">
            {selectedBikes.length === 0 ? (
              <div className="h-[60vh] flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <div className="text-lg font-semibold mb-2">No bikes selected for comparison</div>
                  <div className="text-sm">Use the left panel to add bikes you want to compare.</div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-gray-300">{selectedBikes.length} bikes selected</div>
                  <div>
                    <button onClick={() => setCompareList([])} className="text-xs px-3 py-1 rounded border border-gray-700">Clear All</button>
                  </div>
                </div>

                
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {selectedBikes.map((b) => (
                    <div key={b.slug} className="min-w-[260px] bg-gray-900 rounded-lg p-4">
                      <img src={b.image} alt={b.name} className="w-full h-36 object-cover rounded mb-3" />
                      <h3 className="font-semibold">{b.name}</h3>
                      <div className="text-xs text-gray-400 mb-2">{b.brand}</div>
                      <div className="text-sm">Price: ₹{b.price.toLocaleString("en-IN")}</div>
                      <div className="text-sm">Displacement: {b.displacement} cc</div>
                      <div className="text-sm">Body style: {b.bodyStyle}</div>
                      {b.year && <div className="text-sm">Year: {b.year}</div>}
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => setCompareList(compareList.filter((s) => s !== b.slug))} className="flex-1 px-2 py-1 rounded bg-red-600">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                
                <div className="mt-6 overflow-auto bg-gray-900 rounded-lg p-4">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="text-left text-sm text-gray-300">
                        <th className="w-48">Attribute</th>
                        {selectedBikes.map((b) => (
                          <th key={b.slug} className="px-4">{b.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-t border-gray-800">
                        <td className="py-2">Price</td>
                        {selectedBikes.map((b) => <td key={b.slug} className="px-4">₹{b.price.toLocaleString("en-IN")}</td>)}
                      </tr>
                      <tr className="border-t border-gray-800">
                        <td className="py-2">Displacement</td>
                        {selectedBikes.map((b) => <td key={b.slug} className="px-4">{b.displacement} cc</td>)}
                      </tr>
                      <tr className="border-t border-gray-800">
                        <td className="py-2">Body style</td>
                        {selectedBikes.map((b) => <td key={b.slug} className="px-4">{b.bodyStyle}</td>)}
                      </tr>
                      <tr className="border-t border-gray-800">
                        <td className="py-2">Year</td>
                        {selectedBikes.map((b) => <td key={b.slug} className="px-4">{b.year || "—"}</td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

