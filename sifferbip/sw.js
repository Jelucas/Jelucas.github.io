// sw.js
const CACHE_NAME = 'estoque-v1';
// Estratégia: Network First (Tenta baixar o novo, se falhar/offline, usa o cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});