import React, { useEffect, useMemo, useState } from "react";
import { MessageSquare, RefreshCw } from "lucide-react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import SmartImage from "../components/common/SmartImage";
import BikeGearLoader from "../components/animation/BikeGearLoader";
import { useAlert } from "../context/AlertContext";
import { getContent, getLiveNews } from "../services/apiClient";
import { editorialNews, newsCategories } from "../data/news";
import { formatDate } from "../utils/format";

const PAGE_SIZE = 6;

function normalizeNewsItem(item) {
  return {
    id: item.id || item.url,
    category: item.category || "News",
    publishedOn: item.publishedOn || item.pubDate || new Date().toISOString(),
    title: item.title || "Untitled",
    excerpt: item.excerpt || item.description || "",
    readTime: item.readTime || "4 min",
    source: item.source || "MotoHub",
    url: item.url || "",
    image: item.image || "https://picsum.photos/seed/motohub-news-fallback/900/560",
  };
}

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [feedbackLog, setFeedbackLog] = useState([]);
  const [sourceMode, setSourceMode] = useState("live");
  const { showAlert } = useAlert();

  const loadNews = async (mode = sourceMode) => {
    setLoading(true);
    try {
      if (mode === "live") {
        const response = await getLiveNews({ limit: 80 });
        const normalized = response.data.map(normalizeNewsItem);
        setArticles(normalized.length ? normalized : editorialNews.map(normalizeNewsItem));
      } else {
        const response = await getContent("news", { status: "published", limit: 120 });
        const normalized = response.data.map(normalizeNewsItem);
        setArticles(normalized.length ? normalized : editorialNews.map(normalizeNewsItem));
      }
    } catch {
      setArticles(editorialNews.map(normalizeNewsItem));
      showAlert("Live news unavailable, showing local fallback", "info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(sourceMode);
  }, [sourceMode]);

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(articles.map((item) => item.category).filter(Boolean)));
    const merged = Array.from(new Set([...newsCategories, ...dynamic]));
    return merged;
  }, [articles]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return articles.filter((article) => {
      const categoryMatch = category === "All" ? true : article.category === category;
      const queryMatch = normalized
        ? `${article.title} ${article.excerpt} ${article.source}`
            .toLowerCase()
            .includes(normalized)
        : true;

      return categoryMatch && queryMatch;
    });
  }, [articles, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [category, query, sourceMode]);

  const onSubmitFeedback = (event) => {
    event.preventDefault();
    const trimmed = feedback.trim();
    if (!trimmed) {
      return;
    }

    setFeedbackLog((current) => [
      { id: Date.now(), message: trimmed, createdAt: new Date().toISOString() },
      ...current,
    ].slice(0, 4));
    setFeedback("");
  };

  return (
    <div className="space-y-10">
      <PageHero
        badge="Editorial Desk"
        title="MotoHub News"
        subtitle="Live motorcycle news stream plus CMS-curated content from the admin console."
        image="https://picsum.photos/seed/motohub-news-hero/1500/680"
      >
        <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search news"
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            <option value="All">All categories</option>
            {categories.map((item) => (
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
          title="Latest Articles"
          subtitle="Switch between live RSS feed and CMS content."
          actions={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSourceMode("live")}
                className={`bike-tap rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] ${
                  sourceMode === "live"
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-slate-200/25 text-slate-100"
                }`}
              >
                Live RSS
              </button>
              <button
                type="button"
                onClick={() => setSourceMode("cms")}
                className={`bike-tap rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] ${
                  sourceMode === "cms"
                    ? "bg-orange-400 text-slate-950"
                    : "border border-slate-200/25 text-slate-100"
                }`}
              >
                CMS
              </button>
              <button
                type="button"
                onClick={() => loadNews(sourceMode)}
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
            <BikeGearLoader label="Syncing motorcycle feeds" />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState title="No articles found" description="Try broadening your search filters." />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((article) => (
                <article
                  key={article.id}
                  className="overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-900/70"
                >
                  <SmartImage
                    src={article.image}
                    alt={article.title}
                    wrapperClassName="h-48 w-full"
                    className="h-48 w-full object-cover"
                  />
                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="uppercase tracking-[0.12em] text-cyan-200/80">{article.category}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                    <p className="text-sm text-slate-300">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{article.source}</span>
                      <span>{formatDate(article.publishedOn)}</span>
                    </div>
                    {article.url ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bike-tap inline-flex rounded-lg border border-slate-200/20 px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-slate-100"
                      >
                        Open article
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="bike-tap rounded-xl border border-slate-200/20 px-3 py-2 text-sm text-slate-100"
              >
                Prev
              </button>
              <p className="text-sm text-slate-300">
                Page {page} of {totalPages}
              </p>
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                className="bike-tap rounded-xl border border-slate-200/20 px-3 py-2 text-sm text-slate-100"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <article className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-5">
          <SectionHeader
            eyebrow="Feedback"
            title="Coverage Requests"
            subtitle="Tell us which segment or topic you want in upcoming stories."
          />
          <form onSubmit={onSubmitFeedback} className="space-y-3">
            <textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Example: More beginner track prep articles under 400cc"
              rows={4}
              className="w-full rounded-2xl border border-slate-200/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <button className="bike-tap rounded-xl bg-gradient-to-r from-cyan-400 to-orange-400 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950">
              Submit request
            </button>
          </form>
        </article>

        <aside className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-5">
          <SectionHeader eyebrow="Recent" title="Feedback Log" />
          {feedbackLog.length === 0 ? (
            <p className="text-sm text-slate-400">No feedback yet.</p>
          ) : (
            <div className="space-y-3">
              {feedbackLog.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200/10 bg-slate-950/45 p-3"
                >
                  <div className="mb-1 inline-flex items-center gap-1 text-xs text-cyan-200/80">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {formatDate(item.createdAt)}
                  </div>
                  <p className="text-sm text-slate-200">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
