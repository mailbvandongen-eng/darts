const CACHE_NAME = 'darts-planner-v10';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg', './data.js', './app.js'];
const NETWORK_FIRST_ASSETS = new Set(['', 'index.html', 'app.js', 'data.js', 'manifest.webmanifest', 'sw.js']);

function isNetworkFirstRequest(url) {
  if (url.origin !== self.location.origin) return false;
  const scopePath = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scopePath)) return false;
  const relativePath = url.pathname.slice(scopePath.length);
  return NETWORK_FIRST_ASSETS.has(relativePath);
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (isNetworkFirstRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});

