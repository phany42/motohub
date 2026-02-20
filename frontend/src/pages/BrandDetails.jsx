import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BarChart3, Filter } from "lucide-react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import BikeCard from "../components/bikes/BikeCard";
import EmptyState from "../components/common/EmptyState";
import { getBrandBySlug, getBrandBikes } from "../data/bikes";
import { formatCurrency } from "../utils/format";

export default function BrandDetails() {
  const { brandSlug } = useParams();
  const brand = getBrandBySlug(brandSlug);
  const bikes = getBrandBikes(brandSlug);

  const [segment, setSegment] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const segments = useMemo(
    () => ["all", ...Array.from(new Set(bikes.map((bike) => bike.segment)))],
    [bikes]
  );

  const visibleBikes = useMemo(() => {
    const filtered = bikes.filter((bike) => (segment === "all" ? true : bike.segment === segment));

    if (sortBy === "price-low") {
      return [...filtered].sort((a, b) => a.priceInr - b.priceInr);
    }

    if (sortBy === "price-high") {
      return [...filtered].sort((a, b) => b.priceInr - a.priceInr);
    }

    if (sortBy === "power") {
      return [...filtered].sort((a, b) => b.horsepower - a.horsepower);
    }

    return [...filtered].sort((a, b) => b.rating - a.rating);
  }, [bikes, segment, sortBy]);

  if (!brand) {
    return (
      <EmptyState
        title="Brand not found"
        description="This brand profile is unavailable. Open the brand index to continue browsing."
        action={
          <Link
            to="/brands"
            className="inline-flex rounded-xl border border-slate-200/20 px-4 py-2 text-sm text-slate-100"
          >
            Back to brands
          </Link>
        }
      />
    );
  }

  const minPrice = Math.min(...bikes.map((bike) => bike.priceInr));
  const maxPrice = Math.max(...bikes.map((bike) => bike.priceInr));

  return (
    <div className="space-y-10">
      <PageHero
        compact
        badge={`${brand.country} since ${brand.founded}`}
        title={brand.name}
        subtitle={brand.description}
        image={brand.logoImage || brand.heroImage}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/10 bg-slate-950/55 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/70">Models</p>
            <p className="mt-1 text-2xl font-semibold text-white">{bikes.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/10 bg-slate-950/55 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/70">Price Band</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/10 bg-slate-950/55 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/70">Core Focus</p>
            <p className="mt-1 text-sm font-semibold text-white">{brand.focus}</p>
          </div>
        </div>
      </PageHero>

      <section>
        <SectionHeader
          eyebrow="Lineup"
          title={`${brand.name} Models`}
          subtitle="Switch filters to explore each segment in the lineup."
          actions={
            <div className="flex flex-wrap gap-2">
              {segments.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSegment(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] ${
                    segment === item
                      ? "bg-cyan-400 text-slate-950"
                      : "border border-slate-200/20 text-slate-200"
                  }`}
                >
                  {item === "all" ? "All" : item}
                </button>
              ))}
            </div>
          }
        />

        <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200/10 bg-slate-900/60 px-4 py-3">
          <div className="inline-flex items-center gap-2 text-sm text-slate-300">
            <Filter className="h-4 w-4 text-cyan-300" />
            {visibleBikes.length} models displayed
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <BarChart3 className="h-4 w-4 text-orange-300" />
            Sort
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-lg border border-slate-200/15 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="power">Power output</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleBikes.map((bike) => (
            <BikeCard key={bike.slug} bike={bike} />
          ))}
        </div>
      </section>
    </div>
  );
}
