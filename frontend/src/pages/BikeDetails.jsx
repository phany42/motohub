import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CircleDollarSign, Gauge, Heart, ShoppingCart, Shuffle } from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import SectionHeader from "../components/common/SectionHeader";
import BikeCard from "../components/bikes/BikeCard";
import SmartImage from "../components/common/SmartImage";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { getOnRoadQuote, getOwnershipQuote, getPricingCities } from "../services/apiClient";
import { MAX_COMPARE_BIKES, addCompareSlug } from "../utils/compareStorage";
import { formatCurrency } from "../utils/format";
import { pushRecentlyViewedSlug } from "../utils/recentlyViewed";
import { getBikeBySlug, getBrandBySlug, getRelatedBikes } from "../data/bikes";

const specConfig = [
  ["Engine", (bike) => `${bike.engineCc} cc`],
  ["Power", (bike) => `${bike.horsepower} hp`],
  ["Torque", (bike) => `${bike.torqueNm} Nm`],
  ["Mileage", (bike) => `${bike.mileageKmpl} kmpl`],
  ["Top speed", (bike) => `${bike.topSpeedKph} km/h`],
  ["Transmission", (bike) => bike.transmission],
  ["Cooling", (bike) => bike.cooling],
  ["Fuel tank", (bike) => `${bike.fuelTankL} L`],
  ["Kerb weight", (bike) => `${bike.kerbWeightKg} kg`],
  ["Seat height", (bike) => `${bike.seatHeightMm} mm`],
];

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

const chargeLabelMap = {
  rtoInr: "RTO / road tax",
  insuranceInr: "Insurance",
  registrationInr: "Registration",
  handlingInr: "Dealer handling",
  hsrpInr: "HSRP plate",
  fastagInr: "FASTag",
  smartCardInr: "Smart card",
  hypothecationInr: "Hypothecation",
  greenCessInr: "Green cess",
  roadSafetyInr: "Road safety fee",
  accessoriesCostInr: "Accessories",
  warrantyCostInr: "Extended warranty",
};

export default function BikeDetails() {
  const { brandSlug, bikeSlug } = useParams();
  const bike = getBikeBySlug(brandSlug, bikeSlug);
  const brand = getBrandBySlug(brandSlug);

  const { addToCart, saveForLater } = useCart();
  const { showAlert } = useAlert();
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [cityOptions, setCityOptions] = useState([]);
  const [city, setCity] = useState("bengaluru");
  const [accessoriesInr, setAccessoriesInr] = useState(4500);
  const [warrantyInr, setWarrantyInr] = useState(2800);
  const [usageKmPerMonth, setUsageKmPerMonth] = useState(900);
  const [ownershipYears, setOwnershipYears] = useState(5);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRatePct, setInterestRatePct] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(48);
  const [onRoadQuote, setOnRoadQuote] = useState(null);
  const [ownershipQuote, setOwnershipQuote] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  useEffect(() => {
    if (!bike) {
      document.title = "Bike Not Found | MotoHub";
      return;
    }

    document.title = `${bike.name} | MotoHub`;
    pushRecentlyViewedSlug(bike.slug);
  }, [bike]);

  useEffect(() => {
    setActiveColorIndex(0);
  }, [bike?.slug]);

  useEffect(() => {
    let cancelled = false;

    async function fetchCities() {
      try {
        const response = await getPricingCities();
        if (cancelled) {
          return;
        }

        const cities = Array.isArray(response.data) ? response.data : [];
        setCityOptions(cities);
        if (cities.length && !cities.some((item) => item.slug === city)) {
          setCity(cities[0].slug);
        }
      } catch {
        if (!cancelled) {
          setCityOptions([]);
        }
      }
    }

    fetchCities();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!bike) {
      setOnRoadQuote(null);
      setOwnershipQuote(null);
      return;
    }

    const timer = window.setTimeout(async () => {
      setPricingLoading(true);
      try {
        const [onRoad, ownership] = await Promise.all([
          getOnRoadQuote({
            city,
            bike,
            accessoriesInr,
            extendedWarrantyInr: warrantyInr,
            includeHypothecation: true,
          }),
          getOwnershipQuote({
            city,
            bike,
            usageKmPerMonth,
            years: ownershipYears,
            downPaymentPct,
            interestRatePct,
            tenureMonths,
          }),
        ]);

        setOnRoadQuote(onRoad || null);
        setOwnershipQuote(ownership || null);
      } catch (error) {
        showAlert(error?.response?.data?.message || "Pricing engine unavailable", "error");
      } finally {
        setPricingLoading(false);
      }
    }, 260);

    return () => window.clearTimeout(timer);
  }, [
    accessoriesInr,
    bike,
    city,
    downPaymentPct,
    interestRatePct,
    ownershipYears,
    showAlert,
    tenureMonths,
    usageKmPerMonth,
    warrantyInr,
  ]);

  const colorOptions = useMemo(
    () => (bike?.colors || []).map((item, index) => normalizeColorOption(item, index)),
    [bike?.colors]
  );
  const activeColor = colorOptions[activeColorIndex] || colorOptions[0] || null;
  const onRoadBreakdown = useMemo(() => {
    if (!onRoadQuote?.charges) {
      return [];
    }

    return Object.entries(onRoadQuote.charges).map(([key, value]) => ({
      key,
      label: chargeLabelMap[key] || key,
      value: Number(value) || 0,
    }));
  }, [onRoadQuote]);

  if (!bike || !brand) {
    return (
      <EmptyState
        title="Bike profile not available"
        description="This model may have moved. Return to browse and select another bike."
        action={
          <Link
            to="/browse"
            className="inline-flex rounded-xl border border-slate-200/20 px-4 py-2 text-sm text-slate-100"
          >
            Open browse catalog
          </Link>
        }
      />
    );
  }

  const related = getRelatedBikes(bike, 4);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/10 bg-slate-900/70">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative">
            <SmartImage
              src={bike.image}
              alt={bike.name}
              priority
              wrapperClassName="h-full w-full"
              className="h-full w-full object-contain object-center bg-slate-900/40 px-4 pt-4"
            />
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: activeColor
                  ? `linear-gradient(180deg, ${activeColor.hex}1f 0%, rgba(2,6,23,0.06) 45%, rgba(2,6,23,0.72) 100%)`
                  : "linear-gradient(180deg, rgba(2,6,23,0.06), rgba(2,6,23,0.68))",
              }}
            />
            <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyan-100">
              {bike.segmentName}
            </span>
          </div>

          <div className="space-y-6 p-5 sm:p-7 lg:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/75">{brand.name}</p>
              <h1 className="font-display text-5xl uppercase tracking-[0.08em] text-white">{bike.name}</h1>
              <p className="mt-2 text-sm text-slate-300">{bike.synopsis}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyan-100">
                {bike.engineCc} cc
              </span>
              <span className="rounded-full border border-orange-300/35 bg-orange-400/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-orange-100">
                {bike.horsepower} hp
              </span>
              <span className="rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-emerald-100">
                Rating {bike.rating}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Ex-showroom</p>
              <p className="mt-1 text-3xl font-bold text-orange-300">{formatCurrency(bike.priceInr)}</p>
              <p className="text-xs text-slate-400">Inventory {bike.inventory} units</p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  addToCart(bike);
                  showAlert(`${bike.name} added to cart`, "success");
                }}
                className="bike-action-btn bike-action-cart inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold uppercase tracking-[0.08em]"
              >
                <ShoppingCart className="bike-action-icon h-4 w-4" />
                Add Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  saveForLater(bike);
                  showAlert(`${bike.name} saved`, "info");
                }}
                className="bike-action-btn bike-action-save inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold uppercase tracking-[0.08em]"
              >
                <Heart className="bike-action-icon h-4 w-4" />
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  const result = addCompareSlug(bike.slug, MAX_COMPARE_BIKES);
                  if (result.status === "added") {
                    showAlert(`${bike.name} added to compare`, "success");
                    return;
                  }
                  if (result.status === "exists") {
                    showAlert(`${bike.name} already in compare`, "info");
                    return;
                  }
                  showAlert(`Compare list is full (max ${MAX_COMPARE_BIKES})`, "error");
                }}
                className="bike-action-btn bike-action-compare inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold uppercase tracking-[0.08em]"
              >
                <Shuffle className="bike-action-icon h-4 w-4" />
                Compare
              </button>
            </div>

            <Link
              to={`/brands/${brand.slug}`}
              className="inline-flex rounded-xl border border-slate-200/20 px-4 py-2 text-sm text-slate-100"
            >
              Back to {brand.name}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-5">
          <SectionHeader
            eyebrow="Pricing"
            title="On-Road Price Engine"
            subtitle="City-level estimate with tax, insurance, registration, and extras."
          />

          <div className="grid gap-2 sm:grid-cols-3">
            <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
              City
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
              >
                {cityOptions.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
              Accessories
              <input
                type="number"
                value={accessoriesInr}
                onChange={(event) => setAccessoriesInr(Math.max(0, Number(event.target.value || 0)))}
                className="mt-1 w-full rounded-lg border border-slate-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </label>
            <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
              Warranty
              <input
                type="number"
                value={warrantyInr}
                onChange={(event) => setWarrantyInr(Math.max(0, Number(event.target.value || 0)))}
                className="mt-1 w-full rounded-lg border border-slate-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </label>
          </div>

          {onRoadQuote ? (
            <div className="mt-4 space-y-2 rounded-2xl border border-slate-200/10 bg-slate-950/48 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Ex-showroom</span>
                <span className="font-semibold text-white">{formatCurrency(onRoadQuote.exShowroomInr)}</span>
              </div>
              {onRoadBreakdown.map((charge) => (
                <div key={charge.key} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{charge.label}</span>
                  <span className="text-slate-200">{formatCurrency(charge.value)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-100">
                    <CircleDollarSign className="h-4 w-4" />
                    On-road estimate
                  </span>
                  <span className="text-lg font-bold text-orange-200">{formatCurrency(onRoadQuote.onRoadInr)}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Includes financing-ready charges for {onRoadQuote.city?.name || "selected city"}.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">Calculating on-road estimate...</p>
          )}
        </article>

        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-5">
          <SectionHeader
            eyebrow="Ownership"
            title="Cost Calculator"
            subtitle="Tune usage, tenure, and financing to project real outflow."
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
              Monthly km
              <input
                type="number"
                min={100}
                step={50}
                value={usageKmPerMonth}
                onChange={(event) => setUsageKmPerMonth(Math.max(100, Number(event.target.value || 0)))}
                className="mt-1 w-full rounded-lg border border-slate-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </label>
            <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
              Ownership years
              <input
                type="number"
                min={1}
                max={8}
                value={ownershipYears}
                onChange={(event) => setOwnershipYears(Math.max(1, Math.min(8, Number(event.target.value || 1))))}
                className="mt-1 w-full rounded-lg border border-slate-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </label>
            <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
              Down payment %
              <input
                type="number"
                min={0}
                max={80}
                value={downPaymentPct}
                onChange={(event) => setDownPaymentPct(Math.max(0, Math.min(80, Number(event.target.value || 0))))}
                className="mt-1 w-full rounded-lg border border-slate-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </label>
            <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
              Interest %
              <input
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={interestRatePct}
                onChange={(event) => setInterestRatePct(Math.max(0, Math.min(20, Number(event.target.value || 0))))}
                className="mt-1 w-full rounded-lg border border-slate-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </label>
            <label className="text-xs uppercase tracking-[0.08em] text-slate-400 sm:col-span-2">
              Loan tenure (months)
              <input
                type="range"
                min={12}
                max={84}
                step={6}
                value={tenureMonths}
                onChange={(event) => setTenureMonths(Number(event.target.value))}
                className="mt-2 w-full"
              />
              <span className="text-cyan-100">{tenureMonths} months</span>
            </label>
          </div>

          {ownershipQuote ? (
            <div className="mt-4 grid gap-2 rounded-2xl border border-slate-200/10 bg-slate-950/48 p-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/10 bg-slate-900/40 p-3">
                <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Monthly EMI</p>
                <p className="mt-1 text-lg font-semibold text-cyan-100">
                  {formatCurrency(ownershipQuote.finance?.emiInr || 0)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200/10 bg-slate-900/40 p-3">
                <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Monthly running</p>
                <p className="mt-1 text-lg font-semibold text-emerald-100">
                  {formatCurrency(ownershipQuote.monthly?.runningInr || 0)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200/10 bg-slate-900/40 p-3">
                <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Monthly total</p>
                <p className="mt-1 text-lg font-semibold text-orange-200">
                  {formatCurrency(ownershipQuote.monthly?.totalInr || 0)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200/10 bg-slate-900/40 p-3">
                <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Effective ownership</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatCurrency(ownershipQuote.totals?.effectiveOwnershipInr || 0)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200/10 bg-slate-900/40 p-3 sm:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Resale value projection</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  {formatCurrency(ownershipQuote.totals?.estimatedResaleInr || 0)}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">Calculating ownership estimate...</p>
          )}

          {pricingLoading ? (
            <p className="mt-3 text-xs text-cyan-200/80">Updating price engine...</p>
          ) : null}
        </article>
      </section>

      <section>
        <SectionHeader
          eyebrow="Spec Sheet"
          title="Detailed Metrics"
          subtitle="Everything you need to benchmark this bike against alternatives."
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {specConfig.map(([label, fn]) => (
            <article
              key={label}
              className="rounded-2xl border border-slate-200/10 bg-slate-900/65 p-4"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{fn(bike)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-5">
          <SectionHeader
            eyebrow="Technology"
            title="Feature Pack"
            subtitle="Factory-equipped systems that shape ride experience."
          />
          <div className="space-y-2">
            {bike.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-xl border border-slate-200/10 bg-slate-950/45 px-3 py-2"
              >
                <Gauge className="h-4 w-4 text-cyan-300" />
                <p className="text-sm text-slate-100">{feature}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-5">
          <SectionHeader
            eyebrow="Colors"
            title="Paint Schemes"
            subtitle="Tap any paint finish to preview your selection."
          />

          {colorOptions.length ? (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                {colorOptions.map((color, index) => {
                  const active = index === activeColorIndex;
                  return (
                    <button
                      key={`${bike.slug}-${color.name}`}
                      type="button"
                      onClick={() => setActiveColorIndex(index)}
                      className={`bike-color-option flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                        active
                          ? "is-active border-cyan-300/55 bg-cyan-400/10"
                          : "border-slate-200/12 bg-slate-950/45 hover:border-slate-200/28"
                      }`}
                    >
                      <span className="bike-color-swatch" style={colorStyle(color)} />
                      <span className="text-sm font-medium text-slate-100">{color.name}</span>
                    </button>
                  );
                })}
              </div>

              {activeColor ? (
                <div className="mt-3 rounded-xl border border-slate-200/12 bg-slate-950/45 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Selected paint</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="bike-color-swatch h-6 w-6" style={colorStyle(activeColor)} />
                    <span className="text-sm text-slate-100">{activeColor.name}</span>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-slate-400">Color data unavailable for this model.</p>
          )}
        </article>
      </section>

      <section>
        <SectionHeader
          eyebrow="Suggested"
          title="Related Bikes"
          subtitle="Similar segment or same-brand alternatives worth checking next."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <BikeCard key={item.slug} bike={item} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
