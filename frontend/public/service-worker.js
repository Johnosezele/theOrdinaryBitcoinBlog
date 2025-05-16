// Cache names for different types of assets
const CACHE_NAMES = {
  CRITICAL: 'tobg-critical-cache-v1',  // Home page, essential UI assets
  CHARACTERS: 'tobg-characters-cache-v1', // Character images
  BACKGROUNDS: 'tobg-backgrounds-cache-v1', // Background images
  VISUAL_AIDS: 'tobg-visual-aids-cache-v1', // Visual aid images
  FALLBACK: 'tobg-fallback-cache-v1' // Fallback resources
};

// Cache size limits
const CACHE_LIMITS = {
  CRITICAL: 20,
  CHARACTERS: 50,
  BACKGROUNDS: 20,
  VISUAL_AIDS: 50
};

// URLs of critical assets to preload
const CRITICAL_ASSETS = [
  '/assets/fallback-image.svg'
];
const IMAGE_ASSETS_REGEX = /\.(?:png|jpg|jpeg|svg|gif|webp)$/i;

// Install event: Service worker is installed.
// We are not pre-caching specific assets here as the app's preloader handles it.
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  // Preload critical assets, especially the fallback image
  event.waitUntil(
    caches.open(CACHE_NAMES.FALLBACK).then(cache => {
      console.log('Service Worker: Preloading fallback assets');
      return cache.addAll(CRITICAL_ASSETS);
    }).then(() => {
      // Immediately activate this service worker
      return self.skipWaiting();
    })
  );
});

// Activate event: Service worker is activated.
// This is a good place to clean up old caches.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  // Get all valid cache names
  const validCacheNames = Object.values(CACHE_NAMES);
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete any cache that's not in our valid list
          if (!validCacheNames.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of uncontrolled clients
  );
});

// Helper: Determine which cache to use based on the request URL
function getCacheNameForRequest(url) {
  if (url.includes('/characters/')) {
    return CACHE_NAMES.CHARACTERS;
  } else if (url.includes('/visual-aids/')) {
    return CACHE_NAMES.VISUAL_AIDS;
  } else if (/\/(cafe|backgrounds)\//.test(url)) {
    return CACHE_NAMES.BACKGROUNDS;
  } else {
    // Default for other images like icons, logo, etc.
    return CACHE_NAMES.CRITICAL;
  }
}

// Helper: Update LRU metadata for a cached item
async function updateLRUMetadata(cacheName, request) {
  // We'll keep a simple approach: re-put the item to move it to the "newest" position
  try {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    if (response) {
      // Clone the response and put it back, effectively making it the "newest" entry
      await cache.put(request, response.clone());
    }
  } catch (error) {
    console.error('Error updating LRU metadata:', error);
  }
}

// Helper: Ensure cache doesn't exceed size limit
async function enforceCacheSizeLimit(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const limit = CACHE_LIMITS[Object.keys(CACHE_NAMES).find(key => 
      CACHE_NAMES[key] === cacheName)] || 100; // Default to 100 if not specified
    
    if (keys.length > limit) {
      // Delete oldest entries (those at the beginning of the keys array)
      const keysToDelete = keys.slice(0, keys.length - limit);
      await Promise.all(keysToDelete.map(key => cache.delete(key)));
      console.log(`Trimmed ${keysToDelete.length} items from ${cacheName}`);
    }
  } catch (error) {
    console.error('Error enforcing cache size limit:', error);
  }
}

// Fetch event: Intercept network requests.
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only apply cache-first for GET requests for images
  if (request.method === 'GET' && (IMAGE_ASSETS_REGEX.test(request.url) || request.destination === 'image')) {
    // Determine which cache to use based on the URL pattern
    const cacheName = getCacheNameForRequest(request.url);
    
    event.respondWith(
      caches.open(cacheName).then(cache => {
        return cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            // Update LRU metadata (mark as recently used)
            updateLRUMetadata(cacheName, request);
            return cachedResponse;
          }

          return fetch(request).then(networkResponse => {
            // Check if we received a valid response
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              // Cache the fetched response
              const responseToCache = networkResponse.clone();
              cache.put(request, responseToCache);
              
              // Enforce cache size limit after adding new item
              enforceCacheSizeLimit(cacheName);
            }
            return networkResponse;
          }).catch(error => {
            console.error('Service Worker: Fetching failed:', request.url, error);
            // Return our SVG fallback image
            return caches.match('/assets/fallback-image.svg', { cacheName: CACHE_NAMES.FALLBACK })
              .then(fallback => {
                if (fallback) {
                  return fallback;
                }
                console.error('Fallback image not available');
                return Promise.reject('No fallback image available');
              });
          });
        });
      })
    );
  } else {
    // For non-image requests, or non-GET requests, bypass the cache and go to the network.
    // This ensures that API calls, HTML documents, etc., are not aggressively cached by this logic.
    event.respondWith(fetch(request));
  }
});
