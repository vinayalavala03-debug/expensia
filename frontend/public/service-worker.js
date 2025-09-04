// public/service-worker.js

self.addEventListener("install", () => {
  console.log("Service Worker installed.");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service Worker activated.");
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  console.log("🔎 SW intercepted:", event.request.url);
  // Always pass the request through (no caching for now)
  event.respondWith(fetch(event.request));
});

// 🚫 Do NOT add a fetch listener
