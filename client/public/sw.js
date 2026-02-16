// Service Worker for PWA
// Use timestamp to auto-update cache on every service worker update
const CACHE_NAME = `lumiere-cache-${Date.now()}`;
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - Delete ALL old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('Available caches:', cacheNames);
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any cache that doesn't match current cache name pattern
          if (!cacheName.startsWith('lumiere-cache-') || cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - Network first with aggressive cache busting
self.addEventListener('fetch', (event) => {
  // Skip caching for unsupported schemes and methods
  const url = new URL(event.request.url);
  const isHTTP = url.protocol === 'http:' || url.protocol === 'https:';
  const isGET = event.request.method === 'GET';
  
  if (!isHTTP || !isGET) {
    // Just fetch without caching for non-HTTP or non-GET requests
    event.respondWith(fetch(event.request));
    return;
  }

  // Skip caching for sw.js and index.html (always fetch fresh)
  const urlString = event.request.url;
  const isSWFile = urlString.includes('sw.js');
  const isIndexHTML = urlString.endsWith('index.html') || urlString.endsWith('/');
  
  if (isSWFile) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful complete responses
        if (response.status === 200 && response.type !== 'opaque') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch((err) => {
              // Silently fail cache writes
              console.debug('Cache write failed:', err.message);
            });
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});
