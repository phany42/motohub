const SW_VERSION = "motohub-v4";
const STATIC_CACHE = `${SW_VERSION}-static`;
const IMAGE_CACHE = `${SW_VERSION}-images`;
const API_CACHE = `${SW_VERSION}-api`;

const STATIC_ASSETS = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => !name.startsWith(SW_VERSION))
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

function isApiRequest(url) {
  return url.pathname.includes("/api/");
}

function isStaticAsset(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/assets/") ||
      url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".html") ||
      url.pathname.endsWith(".svg") ||
      url.pathname.endsWith(".woff2"))
  );
}

function isImageRequest(request, url) {
  if (request.destination === "image") {
    return true;
  }

  return /\.(png|jpg|jpeg|webp|avif|gif|svg)(\?|$)/i.test(url.pathname + url.search);
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === "opaque")) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    networkPromise.catch(() => null);
    return cached;
  }

  const network = await networkPromise;
  return network || new Response("Offline", { status: 503, statusText: "Offline" });
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === "opaque")) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response && (response.ok || response.type === "opaque")) {
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (isApiRequest(url)) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (isImageRequest(request, url)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});
