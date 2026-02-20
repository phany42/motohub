import React from "react";
import SmartImage from "./SmartImage";

export default function PageHero({ title, subtitle, badge, image, children, compact = false }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/10 bg-slate-900/70">
      {image ? (
        <div className="absolute inset-0">
          <SmartImage
            src={image}
            alt={title}
            priority
            wrapperClassName="h-full w-full"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/20" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.25),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.25),_transparent_40%)]" />
      )}

      <div
        className={`relative px-5 sm:px-8 lg:px-12 ${
          compact ? "py-7 sm:py-9 lg:py-10" : "py-8 sm:py-10 lg:py-12"
        }`}
      >
        {badge ? (
          <p className="mb-3 inline-flex rounded-full border border-cyan-200/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
            {badge}
          </p>
        ) : null}
        <h1
          className={`font-display uppercase tracking-[0.08em] text-white ${
            compact ? "text-3xl sm:text-4xl lg:text-5xl" : "text-4xl sm:text-5xl lg:text-6xl"
          }`}
        >
          {title}
        </h1>
        {subtitle ? <p className="mt-3 max-w-3xl text-sm text-slate-200 sm:text-base">{subtitle}</p> : null}
        {children ? <div className={compact ? "mt-5" : "mt-6"}>{children}</div> : null}
      </div>
    </section>
  );
}
