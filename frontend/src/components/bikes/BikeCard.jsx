import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Shuffle } from "lucide-react";
import SmartImage from "../common/SmartImage";
import { useCart } from "../../context/CartContext";
import { useAlert } from "../../context/AlertContext";
import { MAX_COMPARE_BIKES, addCompareSlug } from "../../utils/compareStorage";
import { formatCurrency } from "../../utils/format";

const namedColorMap = {
  "graphite black": "#12151b",
  "titan silver": "#a5acb5",
  "racing red": "#bf1e2e",
  "storm blue": "#3558b8",
  "matte olive": "#4f5c47",
  "pearl white": "#eef2f6",
  "neon green": "#60d040",
  "burnt orange": "#ca6b2e",
  "midnight teal": "#0e6a74",
  "desert sand": "#c8a270",
  "matte grey": "#6a727f",
  "electric yellow": "#f2c42f",
  "carbon black": "#0b0d12",
  "factory lime": "#47bb3a",
};

const fallbackColorCycle = ["#12151b", "#a5acb5", "#bf1e2e", "#3558b8", "#ca6b2e"];

function normalizeColorOption(color, index) {
  if (typeof color === "string") {
    const fallback = fallbackColorCycle[index % fallbackColorCycle.length];
    return {
      name: color,
      hex: namedColorMap[color.toLowerCase()] || fallback,
      secondaryHex: null,
    };
  }

  if (color && typeof color === "object") {
    return {
      name: color.name || `Color ${index + 1}`,
      hex: color.hex || fallbackColorCycle[index % fallbackColorCycle.length],
      secondaryHex: color.secondaryHex || null,
    };
  }

  return {
    name: `Color ${index + 1}`,
    hex: fallbackColorCycle[index % fallbackColorCycle.length],
    secondaryHex: null,
  };
}

function colorStyle(option) {
  if (option.secondaryHex) {
    return {
      background: `linear-gradient(135deg, ${option.hex} 0%, ${option.hex} 48%, ${option.secondaryHex} 52%, ${option.secondaryHex} 100%)`,
    };
  }

  return { backgroundColor: option.hex };
}

export default function BikeCard({
  bike,
  compact = false,
  hideActions = false,
  showCompactInsights = true,
}) {
  const { addToCart, saveForLater } = useCart();
  const { showAlert } = useAlert();

  const paintOptions = (bike.colors || []).map(normalizeColorOption);
  const estimatedRangeKm = bike.fuelTankL > 0
    ? Math.max(0, Math.round(bike.fuelTankL * bike.mileageKmpl))
    : Math.max(60, Math.round((bike.mileageKmpl || 20) * 4));

  const handleAddCompare = () => {
    const result = addCompareSlug(bike.slug, MAX_COMPARE_BIKES);
    if (result.status === "added") {
      showAlert(`${bike.name} added to compare`, "success");
      return;
    }

    if (result.status === "exists") {
      showAlert(`${bike.name} is already in compare`, "info");
      return;
    }

    showAlert(`Compare list is full (max ${MAX_COMPARE_BIKES}). Remove one bike first.`, "error");
  };

  return (
    <article className="bike-card-shell group overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-900/75 shadow-xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-cyan-200/30">
      <Link to={`/bike/${bike.brandSlug}/${bike.slug}`} className="bike-card-media relative block overflow-hidden">
        <div className={`bike-card-image-stage ${compact ? "h-40" : "h-52"}`}>
          <SmartImage
            src={bike.image}
            alt={bike.name}
            priority={!compact}
            wrapperClassName="h-full w-full"
            className="bike-card-bike-image h-full w-full object-contain object-center px-2 pt-2 pb-0"
          />
        </div>
        <div className="bike-card-image-vignette" />
        <div className="bike-card-image-seam-fix" />

        <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-slate-950/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-cyan-100">
          {bike.segmentName}
        </span>
      </Link>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{bike.name}</h3>
            <p className="text-sm text-slate-300">{bike.brand}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-orange-300">{formatCurrency(bike.priceInr)}</p>
            <p className="text-xs text-slate-400">{bike.year} model</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200/10 bg-slate-950/40 p-2 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Engine</p>
            <p className="text-xs font-semibold text-slate-100">{bike.engineCc} cc</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Power</p>
            <p className="text-xs font-semibold text-slate-100">{bike.horsepower} hp</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Mileage</p>
            <p className="text-xs font-semibold text-slate-100">{bike.mileageKmpl} kmpl</p>
          </div>
        </div>

        {compact && showCompactInsights ? (
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200/10 bg-slate-950/38 px-3 py-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Est range</p>
              <p className="text-xs font-semibold text-cyan-100">{estimatedRangeKm} km</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Top speed</p>
              <p className="text-xs font-semibold text-orange-100">{bike.topSpeedKph} km/h</p>
            </div>
          </div>
        ) : null}

        {paintOptions.length ? (
          <div className="flex items-center justify-between rounded-xl border border-slate-200/10 bg-slate-950/40 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Colors</p>
            <div className="flex items-center gap-1.5">
              {paintOptions.slice(0, 4).map((color) => (
                <span
                  key={`${bike.slug}-${color.name}`}
                  title={color.name}
                  className="bike-color-dot"
                >
                  <span className="bike-color-dot-fill" style={colorStyle(color)} />
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {hideActions ? null : (
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                addToCart(bike);
                showAlert(`${bike.name} added to cart`, "success");
              }}
              className="bike-action-btn bike-action-cart bike-tap inline-flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold"
            >
              <ShoppingCart className="bike-action-icon h-3.5 w-3.5" />
              Cart
            </button>
            <button
              type="button"
              onClick={() => {
                saveForLater(bike);
                showAlert(`${bike.name} saved`, "info");
              }}
              className="bike-action-btn bike-action-save bike-tap inline-flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold"
            >
              <Heart className="bike-action-icon h-3.5 w-3.5" />
              Save
            </button>
            <button
              type="button"
              onClick={handleAddCompare}
              className="bike-action-btn bike-action-compare bike-tap inline-flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold"
            >
              <Shuffle className="bike-action-icon h-3.5 w-3.5" />
              Compare
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
