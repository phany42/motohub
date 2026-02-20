import React, { useEffect, useMemo, useState } from "react";
import { Clock3, PhoneCall, RefreshCw } from "lucide-react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import BikeGearLoader from "../components/animation/BikeGearLoader";
import { useAlert } from "../context/AlertContext";
import { dealerCities } from "../data/dealers";
import { getContent, getLiveDealers } from "../services/apiClient";

function normalizeDealer(item) {
  return {
    id: item.id,
    name: item.name,
    city: item.city || "",
    state: item.state || "",
    address: item.address || "",
    phone: item.phone || "",
    services: Array.isArray(item.services) ? item.services : [],
    brands: Array.isArray(item.brands) ? item.brands : [],
    opensAt: item.opensAt || "",
    closesAt: item.closesAt || "",
    website: item.website || "",
    source: item.source || "CMS",
  };
}

export default function Dealers() {
  const [city, setCity] = useState("All");
  const [query, setQuery] = useState("");
  const [dealersData, setDealersData] = useState([]);
  const [mode, setMode] = useState("live");
  const [loading, setLoading] = useState(true);
  const [liveCityInput, setLiveCityInput] = useState("Bengaluru");
  const { showAlert } = useAlert();

  const loadDealers = async (nextMode = mode) => {
    setLoading(true);
    try {
      if (nextMode === "live") {
        const response = await getLiveDealers({ city: liveCityInput || "Bengaluru" });
        setDealersData(response.data.map(normalizeDealer));
      } else {
        const response = await getContent("dealers", { status: "published", limit: 200 });
        setDealersData(response.data.map(normalizeDealer));
      }
    } catch {
      showAlert("Dealer data unavailable", "error");
      setDealersData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDealers(mode);
  }, [mode]);

  const cityOptions = useMemo(() => {
    const dynamic = Array.from(new Set(dealersData.map((dealer) => dealer.city).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b)
    );
    return Array.from(new Set([...dealerCities, ...dynamic]));
  }, [dealersData]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return dealersData.filter((dealer) => {
      const cityMatch = city === "All" ? true : dealer.city === city;
      const queryMatch = normalized
        ? `${dealer.name} ${dealer.city} ${dealer.state} ${dealer.address} ${dealer.brands.join(" ")}`
            .toLowerCase()
            .includes(normalized)
        : true;

      return cityMatch && queryMatch;
    });
  }, [dealersData, city, query]);

  return (
    <div className="space-y-10">
      <PageHero
        badge="Dealer Network"
        title="Find Nearby Dealers"
        subtitle="Search real OSM dealer data or switch to CMS managed outlets."
        image="https://picsum.photos/seed/motohub-dealers-hero/1500/680"
      >
        <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city, outlet, or brand"
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            <option value="All">All cities</option>
            {cityOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </PageHero>

      <section>
        <SectionHeader
          eyebrow="Coverage"
          title="Dealer Directory"
          subtitle="OpenStreetMap-powered search with CMS fallback."
          actions={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode("live")}
                className={`bike-tap rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] ${
                  mode === "live"
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-slate-200/25 text-slate-100"
                }`}
              >
                Live OSM
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
                CMS dealers
              </button>
              {mode === "live" ? (
                <input
                  value={liveCityInput}
                  onChange={(event) => setLiveCityInput(event.target.value)}
                  placeholder="City for live API"
                  className="rounded-full border border-slate-200/25 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-100 outline-none"
                />
              ) : null}
              <button
                type="button"
                onClick={() => loadDealers(mode)}
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
            <BikeGearLoader label="Mapping nearby dealers" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No dealers found" description="Try another city or a broader query." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((dealer) => (
              <article
                key={dealer.id}
                className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-4"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/75">
                  {dealer.city}{dealer.state ? `, ${dealer.state}` : ""}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">{dealer.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{dealer.address || "Address unavailable"}</p>

                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  {(dealer.opensAt || dealer.closesAt) ? (
                    <p className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-orange-300" />
                      {dealer.opensAt || "--:--"} to {dealer.closesAt || "--:--"}
                    </p>
                  ) : null}
                  {dealer.phone ? (
                    <p className="inline-flex items-center gap-1">
                      <PhoneCall className="h-3.5 w-3.5 text-cyan-300" />
                      {dealer.phone}
                    </p>
                  ) : null}
                </div>

                {dealer.services.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Services</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {dealer.services.slice(0, 4).map((service) => (
                        <span
                          key={`${dealer.id}-${service}`}
                          className="rounded-full border border-slate-200/20 px-2.5 py-1 text-[10px] text-slate-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {dealer.brands.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Brands</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {dealer.brands.slice(0, 5).map((brand) => (
                        <span
                          key={`${dealer.id}-${brand}`}
                          className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-[10px] text-cyan-100"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <p className="mt-4 text-[10px] uppercase tracking-[0.1em] text-slate-500">Source: {dealer.source}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
