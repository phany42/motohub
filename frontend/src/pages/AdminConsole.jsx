import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Plus, RefreshCw, Trash2 } from "lucide-react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import BikeGearLoader from "../components/animation/BikeGearLoader";
import { useAlert } from "../context/AlertContext";
import {
  createContent,
  deleteContent,
  getContent,
  getDashboardSummary,
  getLiveDealers,
  getLiveEvents,
  getLiveNews,
  patchContent,
  updateContent,
} from "../services/apiClient";

const tabConfig = {
  news: {
    label: "News CMS",
    fields: ["title", "excerpt", "category", "source", "url", "image", "publishedOn", "status"],
  },
  events: {
    label: "Events CMS",
    fields: [
      "name",
      "city",
      "country",
      "type",
      "startDate",
      "endDate",
      "entryFeeInr",
      "summary",
      "highlights",
      "image",
      "status",
    ],
  },
  dealers: {
    label: "Dealers CMS",
    fields: [
      "name",
      "city",
      "state",
      "address",
      "phone",
      "opensAt",
      "closesAt",
      "website",
      "services",
      "brands",
      "status",
    ],
  },
};

const initialForms = {
  news: {
    title: "",
    excerpt: "",
    category: "General",
    source: "MotoHub CMS",
    url: "",
    image: "",
    publishedOn: new Date().toISOString().slice(0, 10),
    status: "draft",
  },
  events: {
    name: "",
    city: "",
    country: "India",
    type: "Ride",
    startDate: "",
    endDate: "",
    entryFeeInr: 0,
    summary: "",
    highlights: "",
    image: "",
    status: "draft",
  },
  dealers: {
    name: "",
    city: "",
    state: "",
    address: "",
    phone: "",
    opensAt: "09:00",
    closesAt: "19:00",
    website: "",
    services: "",
    brands: "",
    status: "draft",
  },
};

function toInputPayload(tab, form) {
  const payload = { ...form };
  if (tab === "events") {
    payload.entryFeeInr = Number(form.entryFeeInr || 0);
  }

  return payload;
}

function fromRecordToForm(tab, record) {
  if (tab === "events") {
    return {
      ...record,
      highlights: Array.isArray(record.highlights) ? record.highlights.join(", ") : record.highlights || "",
      entryFeeInr: Number(record.entryFeeInr || 0),
    };
  }

  if (tab === "dealers") {
    return {
      ...record,
      services: Array.isArray(record.services) ? record.services.join(", ") : record.services || "",
      brands: Array.isArray(record.brands) ? record.brands.join(", ") : record.brands || "",
    };
  }

  return { ...record };
}

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState("news");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [formState, setFormState] = useState(initialForms.news);
  const [summary, setSummary] = useState(null);
  const [liveItems, setLiveItems] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveDealerCity, setLiveDealerCity] = useState("Bengaluru");
  const { showAlert } = useAlert();

  const activeConfig = tabConfig[activeTab];

  const loadTabRows = async (tab = activeTab) => {
    setLoading(true);
    try {
      const [cmsResponse, summaryResponse] = await Promise.all([
        getContent(tab, { limit: 200 }),
        getDashboardSummary(),
      ]);
      setRows(cmsResponse.data);
      setSummary(summaryResponse);
    } catch (error) {
      showAlert(error?.response?.data?.message || "Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabRows(activeTab);
    setSelectedId("");
    setFormState(initialForms[activeTab]);
    setLiveItems([]);
  }, [activeTab]);

  const selectedRecord = useMemo(
    () => rows.find((row) => row.id === selectedId) || null,
    [rows, selectedId]
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (selectedId) {
        await updateContent(activeTab, selectedId, toInputPayload(activeTab, formState));
        showAlert("Record updated", "success");
      } else {
        await createContent(activeTab, toInputPayload(activeTab, formState));
        showAlert("Record created", "success");
      }

      await loadTabRows(activeTab);
      setSelectedId("");
      setFormState(initialForms[activeTab]);
    } catch (error) {
      showAlert(error?.response?.data?.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const onToggleStatus = async (record) => {
    try {
      const nextStatus = record.status === "published" ? "draft" : "published";
      await patchContent(activeTab, record.id, { status: nextStatus });
      await loadTabRows(activeTab);
      showAlert(`Status changed to ${nextStatus}`, "info");
    } catch (error) {
      showAlert(error?.response?.data?.message || "Status update failed", "error");
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteContent(activeTab, id);
      if (selectedId === id) {
        setSelectedId("");
        setFormState(initialForms[activeTab]);
      }
      await loadTabRows(activeTab);
      showAlert("Record deleted", "info");
    } catch (error) {
      showAlert(error?.response?.data?.message || "Delete failed", "error");
    }
  };

  const fetchLive = async () => {
    setLiveLoading(true);
    try {
      if (activeTab === "news") {
        const response = await getLiveNews({ limit: 30 });
        setLiveItems(response.data.slice(0, 10));
      } else if (activeTab === "events") {
        const response = await getLiveEvents({ series: "all", year: 2026 });
        setLiveItems(response.data.slice(0, 10));
      } else {
        const response = await getLiveDealers({ city: liveDealerCity || "Bengaluru" });
        setLiveItems(response.data.slice(0, 10));
      }
    } catch (error) {
      showAlert(error?.response?.data?.message || "Live fetch failed", "error");
    } finally {
      setLiveLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <PageHero
        badge="Admin Control"
        title="Content Management Console"
        subtitle="Manage CMS records, publish updates, and preview live feeds from external APIs."
        image="https://picsum.photos/seed/motohub-admin-hero/1500/680"
      >
        <div className="flex flex-wrap gap-2">
          {Object.entries(tabConfig).map(([key, config]) => (
            <motion.button
              key={key}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(key)}
              className={`bike-tap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                activeTab === key
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-slate-200/25 text-slate-100"
              }`}
            >
              {config.label}
            </motion.button>
          ))}
        </div>
      </PageHero>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-5">
          <SectionHeader
            eyebrow="CMS Editor"
            title={selectedId ? `Edit ${activeConfig.label}` : `Create ${activeConfig.label}`}
            subtitle="Fields update based on the active tab."
          />

          <form onSubmit={onSubmit} className="grid gap-3">
            {activeConfig.fields.map((field) => (
              <label key={field} className="text-xs uppercase tracking-[0.1em] text-slate-400">
                {field}
                {field.includes("summary") || field.includes("excerpt") || field === "address" ? (
                  <textarea
                    value={formState[field] ?? ""}
                    onChange={(event) => setFormState((current) => ({ ...current, [field]: event.target.value }))}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-slate-200/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none"
                  />
                ) : (
                  <input
                    type={field.includes("Date") || field.toLowerCase().includes("date") ? "date" : field === "entryFeeInr" ? "number" : "text"}
                    value={formState[field] ?? ""}
                    onChange={(event) => setFormState((current) => ({ ...current, [field]: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none"
                  />
                )}
              </label>
            ))}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bike-tap inline-flex items-center gap-1 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-950"
              >
                <Plus className="h-3.5 w-3.5" />
                {saving ? "Saving..." : selectedId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedId("");
                  setFormState(initialForms[activeTab]);
                }}
                className="bike-tap rounded-xl border border-slate-200/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-100"
              >
                Reset form
              </button>
              <button
                type="button"
                onClick={() => loadTabRows(activeTab)}
                className="bike-tap inline-flex items-center gap-1 rounded-xl border border-slate-200/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-100"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
          </form>
        </article>

        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-5">
          <SectionHeader eyebrow="Dashboard" title="Content Stats" />
          {summary ? (
            <div className="space-y-3 text-sm">
              {Object.entries(summary).map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-slate-200/10 bg-slate-950/45 p-3">
                  <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/80">{key}</p>
                  <p className="mt-1 text-slate-200">Total: {value.total}</p>
                  <p className="text-slate-400">Published: {value.published}</p>
                </div>
              ))}
            </div>
          ) : (
            <BikeGearLoader compact label="Loading stats" />
          )}

          <div className="mt-5 rounded-2xl border border-slate-200/10 bg-slate-950/45 p-3">
            <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/80">Live Preview</p>
            {activeTab === "dealers" ? (
              <input
                value={liveDealerCity}
                onChange={(event) => setLiveDealerCity(event.target.value)}
                placeholder="City for live dealer API"
                className="mt-2 w-full rounded-lg border border-slate-200/15 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
              />
            ) : null}
            <button
              type="button"
              onClick={fetchLive}
              className="bike-tap mt-3 rounded-xl border border-slate-200/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-100"
            >
              Fetch live {activeTab}
            </button>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-5">
          <SectionHeader
            eyebrow="CMS Records"
            title={`${activeConfig.label} List`}
            subtitle="Edit, toggle status, or delete records."
          />

          {loading ? (
            <BikeGearLoader label="Loading records" compact />
          ) : (
            <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1 scrollbar-thin">
              {rows.map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-slate-200/10 bg-slate-950/45 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{record.title || record.name}</p>
                      <p className="text-xs text-slate-400">{record.id}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${
                        record.status === "published"
                          ? "bg-emerald-500/20 text-emerald-100"
                          : "bg-amber-500/20 text-amber-100"
                      }`}
                    >
                      {record.status || "draft"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(record.id);
                        setFormState(fromRecordToForm(activeTab, record));
                      }}
                      className="bike-tap inline-flex items-center gap-1 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-100"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(record)}
                      className="bike-tap rounded-lg border border-slate-200/20 px-2.5 py-1 text-[11px] text-slate-100"
                    >
                      Toggle status
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(record.id)}
                      className="bike-tap inline-flex items-center gap-1 rounded-lg border border-rose-300/30 bg-rose-400/10 px-2.5 py-1 text-[11px] text-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/70 p-5">
          <SectionHeader
            eyebrow="Live API"
            title={`Live ${activeTab} Preview`}
            subtitle="Fetched from real external APIs through backend adapters."
          />

          {liveLoading ? (
            <BikeGearLoader label="Syncing live feed" compact />
          ) : liveItems.length === 0 ? (
            <p className="text-sm text-slate-400">No live items loaded yet.</p>
          ) : (
            <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1 scrollbar-thin">
              {liveItems.map((item, index) => (
                <motion.div
                  key={item.id || item.url || `${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.03 }}
                  className="rounded-2xl border border-slate-200/10 bg-slate-950/45 p-3"
                >
                  <p className="text-sm font-semibold text-white">
                    {item.title || item.name || item.series || item.source || "Live item"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.excerpt || item.description || item.location || item.address || ""}
                  </p>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex rounded-lg border border-slate-200/20 px-2 py-1 text-[11px] text-cyan-100"
                    >
                      Open source
                    </a>
                  ) : null}
                </motion.div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
