const CACHE_NAME = "steamy-dumplings-shell-v12";
const APP_SHELL = [
  "./app.html",
  "./manifest.webmanifest",
  "./app-icon-192-v2.png",
  "./app-icon-512-v2.png",
  "./app-icon-maskable-192-v2.png",
  "./app-icon-maskable-512-v2.png",
  "./apple-touch-icon-v2.png",
  "./favicon.png",
  "./startup-woven-lid.png",
  "./unified-sealed-bamboo-steamer.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // The app shell is network-first: shipped fixes must reach the installed
  // app on its next open instead of being pinned to the first cached copy.
  // Everything else stays cache-first and works offline as before.
  const isShell = request.mode === "navigate" || url.pathname.endsWith("/app.html");

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      if (isShell) {
        try {
          const fresh = await fetch(request);
          if (fresh && fresh.status === 200) cache.put(request, fresh.clone());
          return fresh;
        } catch {
          return (await cache.match(request)) || (await cache.match("./app.html")) || Response.error();
        }
      }
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && response.status === 200) cache.put(request, response.clone());
        return response;
      } catch {
        return Response.error();
      }
    })()
  );
});
