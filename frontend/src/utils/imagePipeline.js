const warmedImages = new Set();
const connectedOrigins = new Set();

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function preconnectOrigins(origins = []) {
  if (!isBrowser()) {
    return;
  }

  for (const origin of origins) {
    if (!origin || connectedOrigins.has(origin)) {
      continue;
    }

    connectedOrigins.add(origin);

    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = origin;
    preconnect.crossOrigin = "anonymous";
    document.head.appendChild(preconnect);

    const dnsPrefetch = document.createElement("link");
    dnsPrefetch.rel = "dns-prefetch";
    dnsPrefetch.href = origin;
    document.head.appendChild(dnsPrefetch);
  }
}

function preloadWithLink(url, priority = "auto") {
  if (!isBrowser()) {
    return;
  }

  const existing = document.querySelector(`link[rel="preload"][as="image"][href="${url}"]`);
  if (existing) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = url;
  if (priority === "high") {
    link.fetchPriority = "high";
  }
  document.head.appendChild(link);
}

function warmImage(url) {
  if (!isBrowser()) {
    return;
  }

  const image = new Image();
  image.decoding = "async";
  image.src = url;
}

export function warmImageCache(urls = [], options = {}) {
  if (!isBrowser() || !Array.isArray(urls) || !urls.length) {
    return;
  }

  const highPriorityCount = Math.max(0, Number(options.highPriorityCount || 0));

  urls.forEach((url, index) => {
    if (!url || warmedImages.has(url)) {
      return;
    }

    warmedImages.add(url);

    const priority = index < highPriorityCount ? "high" : "auto";
    preloadWithLink(url, priority);

    if (index < Math.max(highPriorityCount, 8)) {
      warmImage(url);
    } else {
      const enqueue = () => warmImage(url);
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(enqueue, { timeout: 900 });
      } else {
        window.setTimeout(enqueue, 180 + index * 12);
      }
    }
  });
}
