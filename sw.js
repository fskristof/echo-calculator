// Bump this version string whenever ANY app file changes (index.html, manifest.json,
// icons, or this file itself). Cache-first means visitors keep the old version until
// the cache name changes, so a stale CACHE constant = a stuck app.
const CACHE = 'echo-calc-v4.11';

const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './wiki-data.js',
  './app.js',
  // Each wiki topic's body (see wiki-topics/ and loadWikiTopicBody() in
  // app.js) is loaded on demand rather than up front, but still has to be
  // listed here — precaching still downloads it during install/update, so
  // it works offline the moment a topic is first tapped, not only after a
  // successful online fetch. A new topic file goes here too.
  './wiki-topics/constrictive-pericarditis.js',
  './wiki-topics/pisa-method.js',
  './manifest.json',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './constriction-diagram.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle same-origin GET requests; let everything else pass through untouched.
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Only cache successful, basic (same-origin) responses.
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          // Offline and not cached: for page navigations, fall back to the
          // cached app shell so a cold offline launch still works.
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return undefined;
        });
    })
  );
});
