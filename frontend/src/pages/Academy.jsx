import React from "react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import { academyTracks, practiceDrills, quickGuides } from "../data/guides";

export default function Academy() {
  return (
    <div className="space-y-10">
      <PageHero
        badge="Rider Development"
        title="Moto Academy"
        subtitle="Structured learning tracks, quick guides, and practical drills for every riding level."
        image="https://picsum.photos/seed/motohub-academy-hero/1500/680"
      />

      <section>
        <SectionHeader
          eyebrow="Tracks"
          title="Learning Programs"
          subtitle="Move from basic control to advanced track and expedition competence."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {academyTracks.map((track) => (
            <article
              key={track.id}
              className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-5"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/75">{track.level}</p>
              <h3 className="mt-1 text-2xl font-semibold text-white">{track.name}</h3>
              <p className="mt-2 text-sm text-slate-300">Duration {track.durationHours} hours</p>
              <div className="mt-3 space-y-1 text-sm text-slate-300">
                {track.modules.map((module) => (
                  <p key={`${track.id}-${module}`}>- {module}</p>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200/10 bg-slate-950/45 p-3 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Outcomes</p>
                {track.outcomes.map((outcome) => (
                  <p key={`${track.id}-${outcome}`}>- {outcome}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-5">
          <SectionHeader
            eyebrow="Quick Reads"
            title="Field Guides"
            subtitle="Actionable short reads you can use before your next ride."
          />
          <div className="space-y-3">
            {quickGuides.map((guide) => (
              <div
                key={guide.id}
                className="rounded-2xl border border-slate-200/10 bg-slate-950/50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/75">{guide.category}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{guide.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{guide.summary}</p>
                <p className="mt-2 text-xs text-slate-400">{guide.readTime}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-5">
          <SectionHeader
            eyebrow="Practice"
            title="Session Drills"
            subtitle="Repeat these drills weekly to improve control consistency."
          />
          <div className="space-y-3">
            {practiceDrills.map((drill) => (
              <div
                key={drill.id}
                className="rounded-2xl border border-slate-200/10 bg-slate-950/50 p-4"
              >
                <h3 className="text-lg font-semibold text-white">{drill.name}</h3>
                <p className="text-sm text-slate-300">Focus: {drill.focus}</p>
                <p className="text-xs text-slate-400">{drill.durationMinutes} min per session</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
