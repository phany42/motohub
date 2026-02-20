import React, { useMemo, useState } from "react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import { difficultyBands, routes } from "../data/routes";

export default function RoutesHub() {
  const [difficulty, setDifficulty] = useState("All");
  const [maxDistance, setMaxDistance] = useState(1000);

  const filtered = useMemo(
    () =>
      routes.filter((route) => {
        const difficultyMatch = difficulty === "All" ? true : route.difficulty === difficulty;
        return difficultyMatch && route.distanceKm <= maxDistance;
      }),
    [difficulty, maxDistance]
  );

  return (
    <div className="space-y-10">
      <PageHero
        badge="Route Atlas"
        title="Ride Route Planner"
        subtitle="Distance, terrain ratio, checkpoints, and season guidance for major touring corridors."
        image="https://picsum.photos/seed/motohub-routes-hero/1500/680"
      >
        <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            <option value="All">All levels</option>
            {difficultyBands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
            Max distance: <span className="font-semibold text-orange-200">{maxDistance} km</span>
            <input
              type="range"
              min={100}
              max={1000}
              step={10}
              value={maxDistance}
              onChange={(event) => setMaxDistance(Number(event.target.value))}
              className="mt-2 w-full"
            />
          </label>
        </div>
      </PageHero>

      <section>
        <SectionHeader
          eyebrow="Blueprints"
          title="Route Library"
          subtitle="Use the route cards for pre-ride planning and fuel stop strategy."
        />

        {filtered.length === 0 ? (
          <EmptyState title="No routes match" description="Increase max distance or switch difficulty." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((route) => (
              <article
                key={route.id}
                className="overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-900/70"
              >
                <img src={route.heroImage} alt={route.name} className="h-44 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase tracking-[0.12em] text-cyan-200/80">{route.region}</span>
                    <span className="text-slate-400">{route.distanceKm} km</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{route.name}</h3>
                  <p className="text-sm text-slate-300">{route.summary}</p>

                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200/10 bg-slate-950/50 p-3 text-xs text-slate-300">
                    <p>Difficulty: {route.difficulty}</p>
                    <p>Elevation: {route.elevationGainM} m</p>
                    <p>Fuel stops: {route.fuelStops}</p>
                    <p>Best season: {route.bestSeason}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {route.checkpoints.map((checkpoint) => (
                      <span
                        key={`${route.id}-${checkpoint}`}
                        className="rounded-full border border-slate-200/20 px-2.5 py-1 text-[10px] text-slate-300"
                      >
                        {checkpoint}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
