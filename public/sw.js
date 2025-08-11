// Custom Service Worker for Performance Optimization

const CACHE_NAME = 'smmguru-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/ic/logo.svg',
  '/banner/banner0.webp',
  '/banner/banner1.webp',
  '/banner/banner2.webp',
  '/banner/banner3.webp'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and non-http(s) requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Skip requests that might cause redirect issues
  if (url.pathname.includes('redirect') || url.pathname.includes('auth') || url.search.includes('redirect')) {
    return;
  }

  // Handle different types of requests
  if (url.pathname === '/') {
    // Homepage - serve from cache first
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request).then(fetchResponse => {
            // Don't cache redirects
            if (fetchResponse.redirected || fetchResponse.status >= 300 && fetchResponse.status < 400) {
              return fetchResponse;
            }
            return caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
    );
  } else if (url.pathname.startsWith('/ic/') || url.pathname.startsWith('/banner/')) {
    // Static assets - cache first strategy
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((fetchResponse) => {
            // Don't cache redirects
            if (fetchResponse.redirected || fetchResponse.status >= 300 && fetchResponse.status < 400) {
              return fetchResponse;
            }
            return caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
    );
  } else if (url.pathname.startsWith('/assets/')) {
    // JavaScript/CSS assets - stale while revalidate
    event.respondWith(
      caches.match(request)
        .then((response) => {
          const fetchPromise = fetch(request).then((fetchResponse) => {
            // Don't cache redirects
            if (fetchResponse.redirected || fetchResponse.status >= 300 && fetchResponse.status < 400) {
              return fetchResponse;
            }
            return caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          });
          return response || fetchPromise;
        })
    );
  } else {
    // Other requests - network first, but don't cache redirects
    event.respondWith(
      fetch(request)
        .then((fetchResponse) => {
          // Don't cache redirects
          if (fetchResponse.redirected || fetchResponse.status >= 300 && fetchResponse.status < 400) {
            return fetchResponse;
          }
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/ic/logo.svg',
    badge: '/ic/logo.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('SmmGuru', options)
  );
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync any pending data when connection is restored
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
