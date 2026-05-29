// Minimal service worker stub — prevents 404 for /sw.js during development
self.addEventListener("install", (event) => {
  // Activate immediately
  self.skipWaiting();
  console.log("Service worker: installed");
});

self.addEventListener("activate", (event) => {
  // Take control of uncontrolled clients
  event.waitUntil(self.clients.claim());
  console.log("Service worker: activated");
});

// Default fetch handler — passthrough to network
self.addEventListener("fetch", (event) => {
  // You can add caching logic here if needed
});
