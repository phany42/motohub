import React, { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, RefreshCw } from "lucide-react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import SmartImage from "../components/common/SmartImage";
import BikeGearLoader from "../components/animation/BikeGearLoader";
import { useAlert } from "../context/AlertContext";
import { getContent, getLiveEvents } from "../services/apiClient";
import { eventTypes } from "../data/events";
import { formatCurrency, formatDate } from "../utils/format";

function normalizeLiveEvent(item) {
  return {
    id: item.id,
    name: item.name,
    city: item.location || "TBA",
    country: item.series || "Global",
    startDate: item.startDate,
    endDate: item.endDate,
    type: item.series || "Race",
    entryFeeInr: 0,
    summary: item.description || `${item.series || "Race"} official calendar event`,
    highlights: [item.series || "Race Calendar", "Official schedule"],
    image: "https://picsum.photos/seed/motohub-live-race-event/1200/700",
  };
}

function normalizeCmsEvent(item) {
  return {
    id: item.id,
    name: item.name,
    city: item.city,
    country: item.country,
    startDate: item.startDate,
    endDate: item.endDate,
    type: item.type,
    entryFeeInr: Number(item.entryFeeInr || 0),
    summary: item.summary,
    highlights: Array.isArray(item.highlights) ? item.highlights : [],
    image: item.image || "https://picsum.photos/seed/motohub-cms-event/1200/700",
  };
}

export default function Events() {
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [mode, setMode] = useState("live");
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const loadEvents = async (nextMode = mode) => {
    setLoading(true);
    try {
      if (nextMode === "live") {
        const response = await getLiveEvents({ series: "all", year: 2026 });
        setEventsData(response.data.map(normalizeLiveEvent));
      } else {
        const response = await getContent("events", { status: "published", limit: 200 });
        setEventsData(response.data.map(normalizeCmsEvent));
      }
    } catch {
      showAlert("Event feed is unavailable right now", "error");
      setEventsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents(mode);
  }, [mode]);

  const availableTypes = useMemo(() => {
    const dynamic = Array.from(new Set(eventsData.map((event) => event.type).filter(Boolean)));
    return Array.from(new Set([...eventTypes, ...dynamic]));
  }, [eventsData]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return eventsData.filter((event) => {
      const typeMatch = type === "All" ? true : event.type === type;
      const queryMatch = normalized
        ? `${event.name} ${event.city} ${event.summary}`.toLowerCase().includes(normalized)
        : true;

      return typeMatch && queryMatch;
    });
  }, [type, query, eventsData]);

  return (
    <div className="space-y-10">
      <PageHero
        badge="Live Calendar"
        title="Moto Events Hub"
        subtitle="Switch between live race calendars and CMS-managed local events."
        image="https://picsum.photos/seed/motohub-events-hero/1500/680"
      >
        <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events by city or topic"
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            <option value="All">All event types</option>
            {availableTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </PageHero>

      <section>
        <SectionHeader
          eyebrow="Schedule"
          title="Upcoming Events"
          subtitle="MotoGP/WSBK race feed + custom event campaigns."
          actions={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("live")}
                className={`bike-tap rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] ${
                  mode === "live"
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-slate-200/25 text-slate-100"
                }`}
              >
                Live races
              </button>
              <button
                type="button"
                onClick={() => setMode("cms")}
                className={`bike-tap rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] ${
                  mode === "cms"
                    ? "bg-orange-400 text-slate-950"
                    : "border border-slate-200/25 text-slate-100"
                }`}
              >
                CMS events
              </button>
              <button
                type="button"
                onClick={() => loadEvents(mode)}
                className="bike-tap inline-flex items-center gap-1 rounded-full border border-slate-200/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-slate-100"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
          }
        />

        {loading ? (
          <div className="rounded-3xl border border-slate-200/10 bg-slate-900/70 py-16">
            <BikeGearLoader label="Loading race calendar" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No events found" description="Try another filter or source mode." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-900/70"
              >
                <SmartImage
                  src={event.image}
                  alt={event.name}
                  wrapperClassName="h-48 w-full"
                  className="h-48 w-full object-cover"
                />
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-cyan-100">
                      {event.type}
                    </span>
                    {event.entryFeeInr > 0 ? (
                      <span className="text-xs text-slate-400">{formatCurrency(event.entryFeeInr)}</span>
                    ) : (
                      <span className="text-xs text-slate-400">Official schedule</span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                  <p className="text-sm text-slate-300">{event.summary}</p>

                  <div className="space-y-1 text-xs text-slate-400">
                    <p className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-orange-300" />
                      {formatDate(event.startDate)} to {formatDate(event.endDate || event.startDate)}
                    </p>
                    <p className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-cyan-300" />
                      {event.city}, {event.country}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(event.highlights || []).slice(0, 3).map((highlight) => (
                      <span
                        key={`${event.id}-${highlight}`}
                        className="rounded-full border border-slate-200/20 px-2.5 py-1 text-[10px] text-slate-300"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
