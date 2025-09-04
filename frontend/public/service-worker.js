// public/service-worker.js

self.addEventListener("install", () => {
  console.log("Service Worker installed.");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service Worker activated.");
  clients.claim();
});

// 🚫 Do NOT add a fetch listener
