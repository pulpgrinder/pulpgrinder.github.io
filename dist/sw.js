self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v0.95-build_13').then(function(cache) {
      return cache.addAll([
        'fronkensteen.html'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open('v0.95-build_13').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/fronkensteen.html');
      });
    }
  }));
});

/*
self.addEventListener("activate", event => {
  console.log("activate")
  event.waitUntil(
    caches.keys().then (cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== 'v0.95-build_13'){
            console.log("deleting old cache: " + cacheName)
            return caches.delete(cacheName);
          }
        });
      );
    }));
  }); */
