import React, { useMemo, useState } from "react";
import { CheckCircle2, Wrench } from "lucide-react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import SmartImage from "../components/common/SmartImage";
import { allBikes } from "../data/bikes";

const initialTasks = [
  { id: "task-1", label: "Engine oil check", done: true },
  { id: "task-2", label: "Chain cleaning and lubrication", done: false },
  { id: "task-3", label: "Brake pad inspection", done: false },
  { id: "task-4", label: "Tire pressure reset", done: true },
  { id: "task-5", label: "Coolant level verification", done: false },
];

export default function Garage() {
  const [selectedSlug, setSelectedSlug] = useState(allBikes[0]?.slug ?? "");
  const [tasks, setTasks] = useState(initialTasks);

  const selectedBike = useMemo(
    () => allBikes.find((bike) => bike.slug === selectedSlug) ?? allBikes[0],
    [selectedSlug]
  );

  const completion = Math.round(
    (tasks.filter((task) => task.done).length / Math.max(tasks.length, 1)) * 100
  );

  return (
    <div className="space-y-10">
      <PageHero
        badge="Personal Workspace"
        title="Rider Garage"
        subtitle="Create a simple maintenance dashboard and prep checklist for your bike."
        image="https://picsum.photos/seed/motohub-garage-hero/1500/680"
      />

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-5">
          <SectionHeader
            eyebrow="Bike Selector"
            title="Garage Bike"
            subtitle="Pick a model and manage maintenance progress."
          />

          <select
            value={selectedSlug}
            onChange={(event) => setSelectedSlug(event.target.value)}
            className="w-full rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            {allBikes.slice(0, 25).map((bike) => (
              <option key={bike.slug} value={bike.slug}>
                {bike.brand} - {bike.name}
              </option>
            ))}
          </select>

          {selectedBike ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/10 bg-slate-950/50">
              <SmartImage
                src={selectedBike.image}
                alt={selectedBike.name}
                wrapperClassName="h-52 w-full"
                className="h-52 w-full object-contain p-3"
              />
              <div className="space-y-1 p-4">
                <h3 className="text-xl font-semibold text-white">{selectedBike.name}</h3>
                <p className="text-sm text-slate-300">{selectedBike.brand}</p>
                <p className="text-xs text-slate-400">
                  {selectedBike.engineCc} cc | {selectedBike.horsepower} hp | {selectedBike.segmentName}
                </p>
              </div>
            </div>
          ) : null}
        </article>

        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-5">
          <SectionHeader
            eyebrow="Service Board"
            title="Maintenance Checklist"
            subtitle="Toggle tasks as completed to track readiness."
          />

          <div className="mb-4 rounded-2xl border border-slate-200/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Completion</p>
            <p className="mt-1 text-3xl font-semibold text-cyan-200">{completion}%</p>
            <div className="mt-3 h-2 rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() =>
                  setTasks((current) =>
                    current.map((item) =>
                      item.id === task.id ? { ...item, done: !item.done } : item
                    )
                  )
                }
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200/10 bg-slate-950/45 px-4 py-3 text-left"
              >
                <span className="text-sm text-slate-200">{task.label}</span>
                {task.done ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                ) : (
                  <Wrench className="h-5 w-5 text-orange-300" />
                )}
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
