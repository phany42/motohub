import React, { useState } from "react";
import { Link } from "react-router-dom";
import { brands, allBikes } from "../data/bikes";
import { stickerIcons } from "../data/stickers";
import StickerRow from "./StickerRow";

export default function BrowseTabs() {
  const tabs = ["Brand", "Budget", "Displacement", "Body Style"];
  const [tab, setTab] = useState("Brand");
  const [filtered, setFiltered] = useState(null);

  const budgets = [
    { label: "Under ₹1 Lakh", max: 100000 },
    { label: "₹1 L – ₹2 L", min: 100000, max: 200000 },
    { label: "₹2 L – ₹3 L", min: 200000, max: 300000 },
    { label: "Above ₹3 Lakh", min: 300000 },
  ];

  const displacements = [
    { label: "Under 150cc", max: 150 },
    { label: "150cc – 250cc", min: 150, max: 250 },
    { label: "250cc – 400cc", min: 250, max: 400 },
    { label: "Above 400cc", min: 400 },
  ];

  const bodyStyles = [...new Set(allBikes.map((b) => b.bodyStyle))];

  const filterBikes = (filterType, rangeOrStyle) => {
    let result = [];
    if (filterType === "Budget") {
      result = allBikes.filter(
        (b) =>
          (!rangeOrStyle.min || b.price >= rangeOrStyle.min) &&
          (!rangeOrStyle.max || b.price <= rangeOrStyle.max)
      );
    } else if (filterType === "Displacement") {
      result = allBikes.filter(
        (b) =>
          (!rangeOrStyle.min || b.displacement >= rangeOrStyle.min) &&
          (!rangeOrStyle.max || b.displacement <= rangeOrStyle.max)
      );
    } else if (filterType === "Body Style") {
      result = allBikes.filter((b) => b.bodyStyle === rangeOrStyle);
    }
    setFiltered({ type: filterType, label: rangeOrStyle.label || rangeOrStyle, bikes: result });
  };

  return (
    <section className="py-12 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Browse Bikes By</h2>

        
        <div className="mt-6 flex items-center gap-6 text-sm">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setFiltered(null); 
              }}
              className={`pb-2 border-b-2 transition ${
                tab === t
                  ? "border-rose-500 text-white"
                  : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          
          {tab === "Brand" && !filtered && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  to={`/brands/${b.slug}`}
                  className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 hover:bg-white/10 transition relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl grid place-content-center ring-1 ring-black/5 text-neutral-900 font-semibold">
                      {b.name
                        .split(" ")
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-xs text-white/60">Explore bikes</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          
          {tab === "Budget" && !filtered && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {budgets.map((range, i) => {
                const count = allBikes.filter(
                  (b) =>
                    (!range.min || b.price >= range.min) &&
                    (!range.max || b.price <= range.max)
                ).length;
                return (
                  <div
                    key={i}
                    onClick={() => filterBikes("Budget", range)}
                    className={`rounded-xl p-6 text-center transition ${
                      count > 0
                        ? "bg-white/5 ring-1 ring-white/10 hover:bg-white/10 cursor-pointer"
                        : "bg-neutral-800 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    <div className="font-semibold">{range.label}</div>
                    <div className="mt-2 text-xs">{count} bikes</div>
                  </div>
                );
              })}
            </div>
          )}

          
          {tab === "Displacement" && !filtered && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displacements.map((range, i) => {
                const count = allBikes.filter(
                  (b) =>
                    (!range.min || b.displacement >= range.min) &&
                    (!range.max || b.displacement <= range.max)
                ).length;
                return (
                  <div
                    key={i}
                    onClick={() => filterBikes("Displacement", range)}
                    className={`rounded-xl p-6 text-center transition ${
                      count > 0
                        ? "bg-white/5 ring-1 ring-white/10 hover:bg-white/10 cursor-pointer"
                        : "bg-neutral-800 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    <div className="font-semibold">{range.label}</div>
                    <div className="mt-2 text-xs">{count} bikes</div>
                  </div>
                );
              })}
            </div>
          )}

         
          {tab === "Body Style" && !filtered && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bodyStyles.map((style) => {
                const count = allBikes.filter((b) => b.bodyStyle === style).length;
                return (
                  <div
                    key={style}
                    onClick={() => filterBikes("Body Style", style)}
                    className={`rounded-xl p-6 text-center transition ${
                      count > 0
                        ? "bg-white/5 ring-1 ring-white/10 hover:bg-white/10 cursor-pointer"
                        : "bg-neutral-800 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    <div className="font-semibold">{style}</div>
                    <div className="mt-2 text-xs">{count} bikes</div>
                  </div>
                );
              })}
            </div>
          )}

          
          {filtered && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                {filtered.type}: {filtered.label} ({filtered.bikes.length} bikes)
              </h3>
              {filtered.bikes.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filtered.bikes.map((b) => (
                    <Link
                      key={b.slug}
                      to={`/bike/${b.brandSlug}/${b.slug}`}
                      className="rounded-xl bg-white/5 ring-1 ring-white/10 p-5 hover:bg-white/10 transition card-float card-press"
                    >
                      <img
                        src={b.image}
                        alt={b.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-xs text-white/60">{b.brand}</div>
                      <div className="text-sm mt-1">
                        ₹{new Intl.NumberFormat("en-IN").format(b.price)}
                      </div>
                      <div className="mt-3">
                        <StickerRow items={stickerIcons.slice(0, 3)} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No bikes found for this filter.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
