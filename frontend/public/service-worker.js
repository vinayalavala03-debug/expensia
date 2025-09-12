// public/service-worker.js

const CACHE_NAME = "static-cache-v1"; // bump version on new deploy

self.addEventListener("install", (event) => {
  console.log("SW installed");
  // Activate new SW immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  console.log("SW activated");

  // Cleanup old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 🚫 Skip API & Socket.IO requests
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/socket.io")) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      // Try to update cache in background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => cachedResponse); // fallback to cache if offline

      return cachedResponse || fetchPromise;
    })
  );
});
