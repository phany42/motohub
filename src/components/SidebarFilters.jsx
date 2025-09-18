import React from "react";
import { filterOptions } from "../data/filters";

export default function SidebarFilters({ selected, setSelected }) {
  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-300 h-screen sticky top-0">
      <h3 className="text-lg font-bold mb-4">Filters</h3>

      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Model Year</h4>
        {filterOptions.years.map((year) => (
          <label key={year} className="block">
            <input
              type="radio"
              value={year}
              checked={selected.year === year.toString()}
              onChange={(e) => setSelected({ ...selected, year: e.target.value })}
              className="mr-2"
            />
            {year}
          </label>
        ))}
      </div>

      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Brand</h4>
        {filterOptions.brands.map((brand) => (
          <label key={brand} className="block">
            <input
              type="checkbox"
              value={brand}
              checked={selected.brands.includes(brand)}
              onChange={(e) => {
                const updated = selected.brands.includes(brand)
                  ? selected.brands.filter((b) => b !== brand)
                  : [...selected.brands, brand];
                setSelected({ ...selected, brands: updated });
              }}
              className="mr-2"
            />
            {brand}
          </label>
        ))}
      </div>
    </div>
  );
}
