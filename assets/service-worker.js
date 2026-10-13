const CACHE_NAME = "steamy-dumplings-shell-v7";
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

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => {
        if (request.mode === "navigate") return caches.match("./app.html");
        return Response.error();
      });
    })
  );
});
