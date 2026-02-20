import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import SectionHeader from "../components/common/SectionHeader";
import BikeCard from "../components/bikes/BikeCard";
import EmptyState from "../components/common/EmptyState";
import { brandShowcase, budgetBands, filterBikes, segmentList } from "../data/bikes";

const PAGE_SIZE = 12;

export default function BrowseBy() {
  const [search, setSearch] = useState("");
  const [brandSlug, setBrandSlug] = useState("all");
  const [segment, setSegment] = useState("all");
  const [budget, setBudget] = useState("all");
  const [minCc, setMinCc] = useState(0);
  const [maxCc, setMaxCc] = useState(1800);
  const [page, setPage] = useState(1);

  const selectedBudget = budgetBands.find((band) => band.slug === budget) ?? null;

  const filtered = useMemo(() => {
    const list = filterBikes({
      brandSlug: brandSlug === "all" ? undefined : brandSlug,
      segment: segment === "all" ? undefined : segment,
      minPrice: selectedBudget?.min,
      maxPrice: selectedBudget?.max,
      minCc,
      maxCc,
      search,
    });

    return list;
  }, [brandSlug, segment, selectedBudget, minCc, maxCc, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setSearch("");
    setBrandSlug("all");
    setSegment("all");
    setBudget("all");
    setMinCc(0);
    setMaxCc(1800);
    setPage(1);
  };

  React.useEffect(() => {
    setPage(1);
  }, [brandSlug, segment, budget, minCc, maxCc, search]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-4 sm:p-6">
        <SectionHeader
          eyebrow="Filter Lab"
          title="Browse Bikes"
          subtitle="Direct controls only. Hero banner removed to keep focus on filters and results."
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search model, brand, segment"
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />

          <select
            value={brandSlug}
            onChange={(event) => setBrandSlug(event.target.value)}
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            <option value="all">All brands</option>
            {brandShowcase.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={segment}
            onChange={(event) => setSegment(event.target.value)}
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            <option value="all">All segments</option>
            {segmentList.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            <option value="all">All budgets</option>
            {budgetBands.map((band) => (
              <option key={band.slug} value={band.slug}>
                {band.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200/10 bg-slate-950/45 p-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Min displacement: <span className="font-semibold text-cyan-200">{minCc} cc</span>
            <input
              type="range"
              min={0}
              max={1800}
              step={10}
              value={minCc}
              onChange={(event) => setMinCc(Number(event.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <label className="text-sm text-slate-300">
            Max displacement: <span className="font-semibold text-orange-200">{maxCc} cc</span>
            <input
              type="range"
              min={0}
              max={1800}
              step={10}
              value={maxCc}
              onChange={(event) => setMaxCc(Number(event.target.value))}
              className="mt-2 w-full"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm text-slate-300">
            <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
            {filtered.length} bikes matched
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-slate-200/20 px-4 py-2 text-sm text-slate-100"
          >
            Reset filters
          </button>
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Results"
          title="Filtered Catalog"
          subtitle="Use compare and saved lists as you shortlist."
        />

        {currentItems.length === 0 ? (
          <EmptyState
            title="No bikes found"
            description="Try widening budget or engine range filters."
            action={
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-slate-200/20 px-4 py-2 text-sm text-slate-100"
              >
                Reset filters
              </button>
            }
          />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {currentItems.map((bike) => (
                <BikeCard key={bike.slug} bike={bike} compact />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200/20 px-3 py-2 text-sm text-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <p className="text-sm text-slate-300">
                Page {page} of {totalPages}
              </p>
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200/20 px-3 py-2 text-sm text-slate-100"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
