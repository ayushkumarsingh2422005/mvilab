// Legacy stub for browsers that still request /sw.js from a prior install.
// This site does not use a service worker.
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([self.clients.claim(), self.registration.unregister()]),
  );
});
