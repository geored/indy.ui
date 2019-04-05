var CACHE_NAME = 'indy-cache-v2';
var urlsToCache = [
    'index.html',
    'js/app.js',
    'js/controllers.js',
    'js/directives.js' ,
    'js/filters.js',
    'js/services.js',
    'js/utils.js',
    'css/indy.css',
    'partials/cache-delete.html',
    'partials/footer.html',
    'partials/group-detail.html',
    'partials/group-edit.html',
    'partials/group-list.html',
    'partials/hosted-detail.html',
    'partials/hosted-edit.html',
    'partials/hosted-list.html',
    'partials/nfc.html',
    'partials/remote-detail.html',
    'partials/remote-edit.html',
    'partials/remote-list.html',
    'partials/dialogs/changelog-dialog.html',
    'partials/dialogs/confirm-dialog.html',
    'partials/dialogs/save-dialog.html',
    'partials/directives/ap-group-available.html',
    'partials/directives/ap-group-constituent.html',
    "partials/includes/group-view.html",
    "partials/includes/hosted-view.html",
    "partials/includes/remote-view.html",
    "partials/includes/store-control-panel.html"
];


self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// self.onfetch = function(event) {
//     if (event.request.url.includes('-ui-')) {
//         var init = {
//             method: 'GET',
//             mode: 'no-cors',
//             cache: 'default'
//         };
//         var url = event.request.url.replace('-ui-','-perf-')
//         console.log('DEBUG: proxying', url);
//         event.respondWith(fetch(url, init));
//     } else {
//         event.respondWith(fetch(event.request));
//     }
// };

// self.addEventListener("fetch" , function (evt) {
//     console.log("DEBUG: Fetch event request: \n" , evt.request);
//     evt.respondWith(fetch(evt.response));
// })

self.addEventListener('fetch' ,function (event) {
    var req = event.request;
    return event.respondWith(function cacheFirst() {
      return self.caches.open('v1').then(function (cache) {
        return cache.match(req).then(function (res) {
          if (!res) {
            return fetch(req.clone()).then(function (res) {
              return cache.put(req, res.clone()).then(function () {
                return res;
              });
            });
          }
          return res;
        });
      });
    });
  })

self.addEventListener('activate', function (event) {
    var cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});