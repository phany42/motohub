import React from "react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300/25 bg-slate-900/50 p-8 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
