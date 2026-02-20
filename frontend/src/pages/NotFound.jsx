import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="grid min-h-[58vh] place-items-center">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200/10 bg-slate-900/70 p-8 text-center">
        <p className="font-display text-7xl uppercase tracking-[0.1em] text-cyan-200">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Route not mapped</h1>
        <p className="mt-2 text-sm text-slate-300">
          This page does not exist in the current MotoHub route map.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950"
          >
            Home
          </Link>
          <Link
            to="/browse"
            className="rounded-xl border border-slate-200/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-100"
          >
            Browse
          </Link>
        </div>
      </div>
    </section>
  );
}
