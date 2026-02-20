const COMPARE_KEY = "motohub_compare";
export const MAX_COMPARE_BIKES = 3;

function readCompareState() {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const sanitized = parsed
      .filter((item) => typeof item === "string")
      .slice(0, MAX_COMPARE_BIKES);

    if (sanitized.length !== parsed.length) {
      writeCompareState(sanitized);
    }

    return sanitized;
  } catch {
    return [];
  }
}

function writeCompareState(slugs) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(slugs));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("motohub:compare-change", { detail: { slugs } }));
  }
}

export function getCompareSlugs() {
  return readCompareState();
}

export function setCompareSlugs(slugs, limit = MAX_COMPARE_BIKES) {
  const next = Array.isArray(slugs)
    ? slugs.filter((item) => typeof item === "string").slice(0, Math.max(1, limit))
    : [];
  writeCompareState(next);
  return next;
}

export function addCompareSlug(slug, limit = MAX_COMPARE_BIKES) {
  const state = readCompareState();
  if (state.includes(slug)) {
    return { slugs: state, status: "exists" };
  }

  if (state.length >= limit) {
    return { slugs: state, status: "limit" };
  }

  const next = [...state, slug];
  writeCompareState(next);
  return { slugs: next, status: "added" };
}

export function removeCompareSlug(slug) {
  const state = readCompareState();
  const next = state.filter((item) => item !== slug);
  writeCompareState(next);
  return next;
}

export function clearCompareSlugs() {
  writeCompareState([]);
  return [];
}

export function toggleCompareSlug(slug, limit = MAX_COMPARE_BIKES) {
  const state = readCompareState();

  if (state.includes(slug)) {
    const next = state.filter((item) => item !== slug);
    writeCompareState(next);
    return { slugs: next, status: "removed" };
  }

  if (state.length >= limit) {
    return { slugs: state, status: "limit" };
  }

  const next = [...state, slug];
  writeCompareState(next);
  return { slugs: next, status: "added" };
}
