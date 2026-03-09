var CACHE = "nashbus-v1";
self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(["./" ]); }));
  self.skipWaiting();
});
self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(function(k) { return Promise.all(k.filter(function(x) { return x !== CACHE; }).map(function(x) { return caches.delete(x); })); }));
  self.clients.claim();
});
self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(function(r) { caches.open(CACHE).then(function(c) { c.put(e.request, r.clone()); }); return r; }).catch(function() { return caches.match(e.request); }));
});
