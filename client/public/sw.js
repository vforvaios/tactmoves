let cacheName = 'v1';
let urlsToCache = [
  '/',
  'manifest.json',
  'favicon.ico',
  '../offline.html',
  'icons/logo192.png',
];

this.addEventListener('install', (event) => {
  console.log('service worker installed');
  this.skipWaiting();
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.log(err)),
  );
});

this.addEventListener('activate', (event) => {
  console.log('New service worker activating...');
});

this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        //If the response is found in the cache
        if (!event.request.url.startsWith('http://localhost:3002/.next')) {
          if (response) {
            console.log('Found ', event.request.url, ' in cache');
            return response;
          }

          return fetch(event.request).then((response) => {
            // If a response is not found
            // if (response.status === 404) {
            //   return caches.open(cacheName).then((cache) => {
            //     return cache.match('404.html');
            //   });
            // }

            //Caching and returning the response if it doesn't exist in the cache
            return caches.open(cacheName).then((cache) => {
              cache.put(event.request.url, response.clone());
              return response;
            });
          });
        }
      })
      .catch(async (error) => {
        console.log('Error, ', error);
        //If page is offline/ Network failure
        return caches
          .open(cacheName)
          .then((cache) => cache.match('../offline.html'));
      }),
  );
});

this.addEventListener('push', async function (event) {
  event.waitUntil(self.registration.showNotification('Hello World2'));
});
