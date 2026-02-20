import React from "react";

export default function SectionHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">{eyebrow}</p>
        ) : null}
        <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-white sm:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-slate-300">{subtitle}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
