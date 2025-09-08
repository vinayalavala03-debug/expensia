// public/service-worker.js

const CACHE_NAME = "app-cache-v1";

const PRECACHE_ASSETS = ["/", "/index.html"];

// Install: cache assets
self.addEventListener("install", (event) => {
  console.log("SW installed");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("Precaching failed:", err);
      });
    })
  );
});

// Activate: remove old caches
self.addEventListener("activate", (event) => {
  console.log("SW activated");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/socket.io")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch((err) => {
          console.warn("Fetch failed:", err);
          return caches.match("/index.html"); // fallback
        });
    })
  );
});
