import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import SmartImage from "../components/common/SmartImage";
import { brandShowcase, getBrandBikes } from "../data/bikes";
import { formatCurrency } from "../utils/format";

export default function BrandsList() {
  const [query, setQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  const countries = useMemo(
    () => ["all", ...Array.from(new Set(brandShowcase.map((brand) => brand.country)))],
    []
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return brandShowcase.filter((brand) => {
      const matchesCountry = countryFilter === "all" ? true : brand.country === countryFilter;
      const matchesQuery = normalized
        ? `${brand.name} ${brand.focus} ${brand.country}`.toLowerCase().includes(normalized)
        : true;

      return matchesCountry && matchesQuery;
    });
  }, [countryFilter, query]);

  return (
    <div className="space-y-10">
      <PageHero
        compact
        badge="Brand Garage"
        title="Global Brand Registry"
        subtitle="Explore manufacturer DNA, segment focus, and lineup depth before you shortlist bikes."
      >
        <div className="grid gap-3 md:grid-cols-[1.2fr_0.7fr]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by brand, focus, country"
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <select
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value)}
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country === "all" ? "All countries" : country}
              </option>
            ))}
          </select>
        </div>
      </PageHero>

      <section>
        <SectionHeader
          eyebrow="Catalog"
          title="Brands in MotoHub"
          subtitle="Each brand includes model count, average value band, and top segments."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((brand) => {
            const bikes = getBrandBikes(brand.slug);
            const minPrice = Math.min(...bikes.map((bike) => bike.priceInr));
            const maxPrice = Math.max(...bikes.map((bike) => bike.priceInr));

            return (
              <Link
                key={brand.slug}
                to={`/brands/${brand.slug}`}
                className="hover-rise overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-900/75"
              >
                <div className="relative h-44 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800/90">
                  <SmartImage
                    src={brand.logoImage || brand.heroImage}
                    alt={`${brand.name} logo`}
                    wrapperClassName="h-full w-full"
                    className="h-full w-full object-contain px-6 py-5"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-slate-950/70 px-2.5 py-1 text-xs uppercase tracking-[0.14em] text-cyan-100">
                    {brand.country}
                  </span>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{brand.name}</h3>
                      <p className="text-sm text-slate-300">{brand.tagline}</p>
                    </div>
                    <div
                      className="h-10 w-10 rounded-xl"
                      style={{ backgroundColor: `${brand.accent}33`, border: `1px solid ${brand.accent}66` }}
                    />
                  </div>

                  <p className="text-sm text-slate-300">{brand.focus}</p>

                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200/10 bg-slate-950/40 p-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Models</p>
                      <p className="font-semibold text-slate-100">{brand.models}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Avg Price</p>
                      <p className="font-semibold text-slate-100">{formatCurrency(brand.avgPrice)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Price Band</p>
                      <p className="font-semibold text-slate-100">
                        {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {brand.topSegments.map((segment) => (
                      <span
                        key={`${brand.slug}-${segment}`}
                        className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-cyan-100"
                      >
                        {segment}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
