import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Browse Bikes", to: "/browse" },
  { label: "Compare Center", to: "/compare" },
  { label: "Events Hub", to: "/events" },
  { label: "Route Atlas", to: "/routes" },
  { label: "Rider Academy", to: "/academy" },
  { label: "Dealers", to: "/dealers" },
];

export default function SiteFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-slate-200/10 bg-slate-950/90">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_40%),radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_40%)]" />
      <div className="relative grid w-full gap-10 px-[clamp(0.85rem,2.2vw,2rem)] py-14 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl uppercase tracking-[0.2em] text-white">MotoHub</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
            Bike discovery platform with deep catalogs, compare workflows, ride planning, events, and rider learning tracks.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-cyan-200/70">Ride informed. Ride further.</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Explore</p>
          <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-slate-300 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Newsletter</p>
          <p className="mt-3 text-sm text-slate-300">
            Weekly release notes, event updates, and route drops.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200/10 bg-slate-900/85 p-2">
            <input
              placeholder="rider@email.com"
              className="w-full bg-transparent px-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-orange-500 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-950">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="relative border-t border-slate-200/10 px-[clamp(0.85rem,2.2vw,2rem)] py-4 text-center text-xs text-slate-400">
        Copyright {new Date().getFullYear()} MotoHub. Built as a large-scale bike-first web experience.
      </div>
    </footer>
  );
}
