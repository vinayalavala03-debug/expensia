// public/service-worker.js

self.addEventListener("install", () => {
  console.log("SW installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("SW activated");
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 🚫 Skip API & Socket.IO requests (let them hit the network directly)
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/socket.io")) {
    return; // don’t intercept
  }

  // ✅ Optionally cache static assets (JS, CSS, images)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});


