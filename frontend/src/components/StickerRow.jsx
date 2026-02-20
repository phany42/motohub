import React from "react";

export default function StickerRow({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {items.map((s) => (
        <span key={s.url} className="sticker-chip">
          <img src={s.url} alt={s.name} className="sticker-icon" />
          <span className="sticker-label">{s.name}</span>
        </span>
      ))}
    </div>
  );
}
