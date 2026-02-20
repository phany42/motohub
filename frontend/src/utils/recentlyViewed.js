const RECENTLY_VIEWED_KEY = "motohub_recently_viewed";
export const MAX_RECENT_BIKES = 8;

function readRecentState() {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => typeof item === "string");
  } catch {
    return [];
  }
}

function writeRecentState(slugs) {
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(slugs));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("motohub:recent-change", { detail: { slugs } }));
  }
}

export function getRecentlyViewedSlugs(limit = MAX_RECENT_BIKES) {
  return readRecentState().slice(0, Math.max(1, limit));
}

export function pushRecentlyViewedSlug(slug, limit = MAX_RECENT_BIKES) {
  if (!slug) {
    return getRecentlyViewedSlugs(limit);
  }

  const state = readRecentState();
  const deduped = state.filter((item) => item !== slug);
  const next = [slug, ...deduped].slice(0, Math.max(1, limit));
  writeRecentState(next);
  return next;
}

export function setRecentlyViewedSlugs(slugs, limit = MAX_RECENT_BIKES) {
  const next = Array.isArray(slugs)
    ? slugs.filter((item) => typeof item === "string").slice(0, Math.max(1, limit))
    : [];
  writeRecentState(next);
  return next;
}

export function clearRecentlyViewed() {
  writeRecentState([]);
  return [];
}
