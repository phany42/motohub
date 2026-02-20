import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCcw, Trash2, Trophy } from "lucide-react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import SmartImage from "../components/common/SmartImage";
import { allBikes } from "../data/bikes";
import {
  clearCompareSlugs,
  getCompareSlugs,
  MAX_COMPARE_BIKES,
  toggleCompareSlug,
  removeCompareSlug,
} from "../utils/compareStorage";
import { formatCurrency } from "../utils/format";
import { useAlert } from "../context/AlertContext";

const tableRows = [
  ["Price", (bike) => formatCurrency(bike.priceInr)],
  ["Engine", (bike) => `${bike.engineCc} cc`],
  ["Power", (bike) => `${bike.horsepower} hp`],
  ["Torque", (bike) => `${bike.torqueNm} Nm`],
  ["Mileage", (bike) => `${bike.mileageKmpl} kmpl`],
  ["Top speed", (bike) => `${bike.topSpeedKph} km/h`],
  ["Weight", (bike) => `${bike.kerbWeightKg} kg`],
  ["Seat height", (bike) => `${bike.seatHeightMm} mm`],
  ["Transmission", (bike) => bike.transmission],
  ["Cooling", (bike) => bike.cooling],
];

function averageScore(parts) {
  if (!parts.length) {
    return 0;
  }
  return parts.reduce((sum, value) => sum + value, 0) / parts.length;
}

function normalizeHigher(value, min, max) {
  if (max === min) {
    return 70;
  }
  const ratio = (value - min) / (max - min);
  return 40 + ratio * 60;
}

function normalizeLower(value, min, max) {
  if (max === min) {
    return 70;
  }
  const ratio = (max - value) / (max - min);
  return 40 + ratio * 60;
}

export default function Compare() {
  const [search, setSearch] = useState("");
  const [compareSlugs, setCompareSlugs] = useState(() => getCompareSlugs());
  const { showAlert } = useAlert();

  const selectedBikes = useMemo(
    () => compareSlugs.map((slug) => allBikes.find((bike) => bike.slug === slug)).filter(Boolean),
    [compareSlugs]
  );

  const searchable = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return allBikes
      .filter((bike) => !compareSlugs.includes(bike.slug))
      .filter((bike) => {
        if (!normalized) {
          return true;
        }
        return `${bike.name} ${bike.brand} ${bike.segmentName}`
          .toLowerCase()
          .includes(normalized);
      })
      .slice(0, 14);
  }, [compareSlugs, search]);

  const scoreBySlug = useMemo(() => {
    if (!selectedBikes.length) {
      return {};
    }

    const range = {
      price: selectedBikes.map((bike) => bike.priceInr),
      mileage: selectedBikes.map((bike) => bike.mileageKmpl),
      power: selectedBikes.map((bike) => bike.horsepower),
      torque: selectedBikes.map((bike) => bike.torqueNm),
      topSpeed: selectedBikes.map((bike) => bike.topSpeedKph),
      weight: selectedBikes.map((bike) => bike.kerbWeightKg),
      seatHeight: selectedBikes.map((bike) => bike.seatHeightMm),
      tank: selectedBikes.map((bike) => bike.fuelTankL),
      rating: selectedBikes.map((bike) => bike.rating),
      inventory: selectedBikes.map((bike) => bike.inventory),
    };

    const bounds = Object.fromEntries(
      Object.entries(range).map(([key, values]) => [key, [Math.min(...values), Math.max(...values)]])
    );

    const bySlug = {};
    for (const bike of selectedBikes) {
      const valueScore = averageScore([
        normalizeLower(bike.priceInr, ...bounds.price),
        normalizeHigher(bike.mileageKmpl, ...bounds.mileage),
        normalizeHigher(bike.rating, ...bounds.rating),
        normalizeHigher(bike.inventory, ...bounds.inventory),
      ]);

      const performanceScore = averageScore([
        normalizeHigher(bike.horsepower, ...bounds.power),
        normalizeHigher(bike.torqueNm, ...bounds.torque),
        normalizeHigher(bike.topSpeedKph, ...bounds.topSpeed),
      ]);

      const comfortScore = averageScore([
        normalizeLower(bike.kerbWeightKg, ...bounds.weight),
        normalizeLower(Math.abs(bike.seatHeightMm - 805), 0, Math.max(1, ...selectedBikes.map((item) => Math.abs(item.seatHeightMm - 805)))),
        normalizeHigher(bike.fuelTankL, ...bounds.tank),
      ]);

      const ownershipScore = averageScore([
        normalizeLower(bike.priceInr, ...bounds.price),
        normalizeHigher(bike.mileageKmpl, ...bounds.mileage),
        normalizeLower(bike.kerbWeightKg, ...bounds.weight),
      ]);

      const overall = valueScore * 0.28 + performanceScore * 0.3 + comfortScore * 0.22 + ownershipScore * 0.2;

      bySlug[bike.slug] = {
        valueScore: Math.round(valueScore),
        performanceScore: Math.round(performanceScore),
        comfortScore: Math.round(comfortScore),
        ownershipScore: Math.round(ownershipScore),
        overallScore: Math.round(overall),
      };
    }

    return bySlug;
  }, [selectedBikes]);

  const bestOverallSlug = useMemo(() => {
    return selectedBikes
      .slice()
      .sort((left, right) => (scoreBySlug[right.slug]?.overallScore || 0) - (scoreBySlug[left.slug]?.overallScore || 0))[0]
      ?.slug;
  }, [scoreBySlug, selectedBikes]);

  const matrixTemplate = `minmax(170px, 220px) repeat(${Math.max(selectedBikes.length, 1)}, minmax(220px, 1fr))`;
  const matrixMinWidth = 220 + Math.max(selectedBikes.length, 1) * 240;

  const handleToggle = (slug) => {
    const result = toggleCompareSlug(slug, MAX_COMPARE_BIKES);
    setCompareSlugs(result.slugs);

    if (result.status === "added") {
      showAlert("Bike added to compare", "success");
      return;
    }

    if (result.status === "removed") {
      showAlert("Bike removed from compare", "info");
      return;
    }

    showAlert(`Compare list limit is ${MAX_COMPARE_BIKES}`, "error");
  };

  const clearAll = () => {
    setCompareSlugs(clearCompareSlugs());
    showAlert("Compare list cleared", "info");
  };

  return (
    <div className="space-y-10">
      <PageHero
        compact
        badge="Comparison Center"
        title="Multi Bike Compare"
        subtitle={`Add up to ${MAX_COMPARE_BIKES} bikes and benchmark specs with weighted value, performance, comfort, and ownership scoring.`}
        image="https://picsum.photos/seed/motohub-compare-hero/1500/680"
      >
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-cyan-100">
            {selectedBikes.length} bikes selected
          </span>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200/20 px-3 py-1 text-slate-100"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Clear all
          </button>
        </div>
      </PageHero>

      <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-4">
          <SectionHeader
            eyebrow="Selector"
            title="Add Bikes"
            subtitle="Use search to add models to your compare matrix."
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bike to compare"
            className="w-full rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />

          <div className="mt-4 max-h-[620px] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
            {searchable.map((bike) => (
              <button
                key={bike.slug}
                type="button"
                onClick={() => handleToggle(bike.slug)}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/10 bg-slate-950/45 p-2 text-left hover:bg-slate-900"
              >
                <SmartImage
                  src={bike.image}
                  alt={bike.name}
                  wrapperClassName="h-16 w-20 rounded-lg overflow-hidden bg-slate-900/70"
                  className="h-16 w-20 object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{bike.name}</p>
                  <p className="truncate text-xs text-slate-400">{bike.brand}</p>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-400/10 text-cyan-200">
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-5">
          {selectedBikes.length === 0 ? (
            <EmptyState
              title="No bikes selected"
              description="Add bikes from the selector panel to generate the compare matrix."
              action={
                <Link to="/browse" className="rounded-xl border border-slate-200/20 px-4 py-2 text-sm text-slate-100">
                  Browse catalog
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {selectedBikes.map((bike) => {
                  const score = scoreBySlug[bike.slug] || {};
                  const isTop = bike.slug === bestOverallSlug;
                  return (
                    <article
                      key={`score-${bike.slug}`}
                      className={`rounded-2xl border p-4 ${
                        isTop
                          ? "border-amber-300/45 bg-amber-400/10"
                          : "border-slate-200/10 bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{bike.name}</p>
                          <p className="text-xs text-slate-300">{bike.brand}</p>
                        </div>
                        {isTop ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/45 bg-amber-400/12 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-amber-100">
                            <Trophy className="h-3.5 w-3.5" />
                            Top
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg border border-slate-200/10 bg-slate-950/45 px-2 py-2">
                          <p className="text-slate-400">Value</p>
                          <p className="font-semibold text-cyan-100">{score.valueScore || 0}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200/10 bg-slate-950/45 px-2 py-2">
                          <p className="text-slate-400">Performance</p>
                          <p className="font-semibold text-cyan-100">{score.performanceScore || 0}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200/10 bg-slate-950/45 px-2 py-2">
                          <p className="text-slate-400">Comfort</p>
                          <p className="font-semibold text-cyan-100">{score.comfortScore || 0}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200/10 bg-slate-950/45 px-2 py-2">
                          <p className="text-slate-400">Ownership</p>
                          <p className="font-semibold text-cyan-100">{score.ownershipScore || 0}</p>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg border border-orange-300/35 bg-orange-400/10 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-orange-100/80">Overall score</p>
                        <p className="text-lg font-bold text-orange-100">{score.overallScore || 0}/100</p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-200/10 bg-slate-900/65">
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: matrixTemplate,
                    minWidth: `${matrixMinWidth}px`,
                  }}
                >
                  <div className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 bg-slate-950/55">
                    Specification
                  </div>
                  {selectedBikes.map((bike) => (
                    <div
                      key={`head-${bike.slug}`}
                      className="border-l border-slate-200/10 bg-slate-950/55 px-3 py-3"
                    >
                      <SmartImage
                        src={bike.image}
                        alt={bike.name}
                        wrapperClassName="h-32 w-full rounded-xl overflow-hidden bg-slate-900/70"
                        className="h-32 w-full object-contain p-2"
                      />
                      <p className="mt-2 text-lg font-semibold text-white">{bike.name}</p>
                      <p className="text-sm text-slate-300">{bike.brand}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setCompareSlugs(removeCompareSlug(bike.slug));
                          showAlert(`${bike.name} removed`, "info");
                        }}
                        className="bike-tap mt-2 inline-flex items-center gap-1 rounded-lg border border-rose-300/35 bg-rose-400/10 px-2.5 py-1 text-xs text-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  ))}

                  <div className="border-t border-slate-200/10 bg-slate-950/42 px-4 py-3 text-sm font-semibold text-slate-200">
                    Overall score
                  </div>
                  {selectedBikes.map((bike) => (
                    <div
                      key={`overall-${bike.slug}`}
                      className="border-l border-t border-slate-200/10 px-4 py-3 text-sm font-semibold text-orange-100"
                    >
                      {(scoreBySlug[bike.slug]?.overallScore || 0)}/100
                    </div>
                  ))}

                  {tableRows.map(([label, fn]) => (
                    <React.Fragment key={label}>
                      <div className="border-t border-slate-200/10 bg-slate-950/42 px-4 py-3 text-sm font-semibold text-slate-200">
                        {label}
                      </div>
                      {selectedBikes.map((bike) => (
                        <div
                          key={`${label}-${bike.slug}`}
                          className="border-l border-t border-slate-200/10 px-4 py-3 text-sm text-slate-300"
                        >
                          {fn(bike)}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
