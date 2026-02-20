import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin, Newspaper, RefreshCw, SlidersHorizontal } from "lucide-react";
import SectionHeader from "../components/common/SectionHeader";
import BikeCard from "../components/bikes/BikeCard";
import { allBikes, brandShowcase, findBikeBySlug, segmentList, topRatedBikes } from "../data/bikes";
import { upcomingEvents } from "../data/events";
import { routes } from "../data/routes";
import { editorialNews } from "../data/news";
import { formatCurrency } from "../utils/format";
import { preconnectOrigins, warmImageCache } from "../utils/imagePipeline";
import { getRecentlyViewedSlugs } from "../utils/recentlyViewed";

export default function Home() {
  const [segment, setSegment] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState(() => getRecentlyViewedSlugs());

  useEffect(() => {
    preconnectOrigins(["https://wsrv.nl", "https://cdn.bikedekho.com", "https://upload.wikimedia.org"]);
    warmImageCache(
      topRatedBikes.slice(0, 8).map((bike) => bike.image),
      { highPriorityCount: 4 }
    );
  }, []);

  const stats = useMemo(
    () => [
      { label: "Bikes in Catalog", value: allBikes.length },
      { label: "Global Brands", value: brandShowcase.length },
      { label: "Upcoming Events", value: upcomingEvents.length },
      { label: "Route Blueprints", value: routes.length },
    ],
    []
  );

  const filteredBikes = useMemo(() => {
    const filtered = topRatedBikes
      .filter((bike) => (segment === "all" ? true : bike.segment === segment))
      .filter((bike) => (inStockOnly ? bike.inventory >= 5 : true));

    const sorted = [...filtered].sort((left, right) => {
      if (sortBy === "price-low") {
        return left.priceInr - right.priceInr;
      }
      if (sortBy === "price-high") {
        return right.priceInr - left.priceInr;
      }
      if (sortBy === "mileage") {
        return right.mileageKmpl - left.mileageKmpl;
      }
      if (sortBy === "power") {
        return right.horsepower - left.horsepower;
      }

      return right.rating - left.rating || right.horsepower - left.horsepower;
    });

    return sorted.slice(0, 9);
  }, [inStockOnly, segment, sortBy]);

  useEffect(() => {
    warmImageCache(
      filteredBikes.slice(0, 6).map((bike) => bike.image),
      { highPriorityCount: 2 }
    );
  }, [filteredBikes]);

  useEffect(() => {
    const syncRecent = () => setRecentSlugs(getRecentlyViewedSlugs());
    syncRecent();

    window.addEventListener("motohub:recent-change", syncRecent);
    window.addEventListener("storage", syncRecent);
    return () => {
      window.removeEventListener("motohub:recent-change", syncRecent);
      window.removeEventListener("storage", syncRecent);
    };
  }, []);

  const recentlyViewedBikes = useMemo(
    () => recentSlugs.map((slug) => findBikeBySlug(slug)).filter(Boolean).slice(0, 6),
    [recentSlugs]
  );

  useEffect(() => {
    if (!recentlyViewedBikes.length) {
      return;
    }

    warmImageCache(recentlyViewedBikes.map((bike) => bike.image), { highPriorityCount: 1 });
  }, [recentlyViewedBikes]);

  const resetFilters = () => {
    setSegment("all");
    setSortBy("score");
    setInStockOnly(false);
  };

  return (
    <div className="pb-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="space-y-10">
          {recentlyViewedBikes.length ? (
            <section>
              <SectionHeader
                eyebrow="Quick Return"
                title="Recently Viewed Bikes"
                subtitle="Jump back into bikes you inspected in the latest session."
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recentlyViewedBikes.map((bike) => (
                  <BikeCard key={`recent-${bike.slug}`} bike={bike} compact showCompactInsights={false} />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <SectionHeader
              eyebrow="Discovery"
              title="Featured Performance Grid"
              subtitle="Filter controls are on the left. Cards are wider for better proportions."
            />

            <div className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
              <aside className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-4 h-fit lg:sticky lg:top-24">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/12 bg-slate-950/50 px-3 py-2">
                  <SlidersHorizontal className="h-4 w-4 text-cyan-200/75" />
                  <span className="text-xs uppercase tracking-[0.1em] text-slate-300">Filters</span>
                </div>

                <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-slate-400">Segment</p>
                <div className="mt-2 grid gap-2">
                  <button
                    type="button"
                    onClick={() => setSegment("all")}
                    className={`bike-filter-pill rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] ${
                      segment === "all"
                        ? "bg-orange-500 text-slate-950"
                        : "border border-slate-200/20 text-slate-200"
                    }`}
                  >
                    All
                  </button>
                  {segmentList.slice(0, 7).map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setSegment(item.slug)}
                      className={`bike-filter-pill rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] ${
                        segment === item.slug
                          ? "bg-cyan-400 text-slate-950"
                          : "border border-slate-200/20 text-slate-200"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-slate-400">Sort</p>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200/15 bg-slate-950/75 px-3 py-2 text-sm text-slate-100 outline-none"
                >
                  <option value="score">Top rated</option>
                  <option value="price-low">Price: Low to high</option>
                  <option value="price-high">Price: High to low</option>
                  <option value="mileage">Best mileage</option>
                  <option value="power">Highest power</option>
                </select>

                <label className="mt-4 inline-flex w-full items-center gap-2 rounded-xl border border-slate-200/15 bg-slate-950/75 px-3 py-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(event) => setInStockOnly(event.target.checked)}
                    className="h-4 w-4 accent-cyan-400"
                  />
                  In-stock only
                </label>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="bike-tap mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-200 hover:border-slate-200/40"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </aside>

              {filteredBikes.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200/25 bg-slate-900/40 p-8 text-center text-slate-300">
                  No bikes match this filter.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredBikes.map((bike) => (
                    <BikeCard key={bike.slug} bike={bike} compact showCompactInsights={false} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
          <article className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">Catalog Snapshot</p>
            <div className="mt-3 space-y-2">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-slate-200/10 bg-slate-950/45 px-3 py-2"
                >
                  <span className="text-xs uppercase tracking-[0.08em] text-slate-300">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">Upcoming Events</p>
            <div className="mt-3 space-y-2">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-200/10 bg-slate-950/45 px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{event.type}</p>
                  <p className="text-sm font-semibold text-white">{event.name}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-300">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {event.city}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/events" className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-200">
              Open events
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>

          <article className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">Popular Routes</p>
            <div className="mt-3 space-y-2">
              {routes.slice(0, 3).map((route) => (
                <div key={route.id} className="rounded-xl border border-slate-200/10 bg-slate-950/45 px-3 py-2">
                  <p className="text-sm font-semibold text-white">{route.name}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-300">
                    <MapPin className="h-3.5 w-3.5" />
                    {route.region}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/routes" className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-200">
              Open routes
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>

          <article className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">News Desk</p>
            <div className="mt-3 space-y-2">
              {editorialNews.slice(0, 3).map((article) => (
                <div key={article.id} className="rounded-xl border border-slate-200/10 bg-slate-950/45 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">{article.category}</p>
                  <p className="text-sm font-semibold text-white line-clamp-2">{article.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-300">
                    <Newspaper className="h-3.5 w-3.5" />
                    {article.source}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/news" className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-200">
              Open news
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>

          <article className="rounded-3xl border border-slate-200/10 bg-gradient-to-br from-slate-900/80 via-cyan-950/20 to-orange-950/20 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Quick Actions</p>
            <p className="mt-2 text-sm text-slate-300">
              Avg catalog price {formatCurrency(Math.round(allBikes.reduce((sum, bike) => sum + bike.priceInr, 0) / allBikes.length))}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/compare"
                className="inline-flex rounded-lg bg-orange-400 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-950"
              >
                Compare
              </Link>
              <Link
                to="/brands"
                className="inline-flex rounded-lg border border-slate-200/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-100"
              >
                Brands
              </Link>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
