/* ============================================================
   VersoLibre — Service Worker para funcionamiento 100% offline
   ============================================================ */

const CACHE_NAME = 'versolibre-v1';
const ASSETS = [
  '/index.html',
  '/manifest.json',
  '/diccionario.txt',
  '/sinonimos.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalación: cachear todos los recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activación: limpiar caches antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: servir desde cache primero (offline-first)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});
