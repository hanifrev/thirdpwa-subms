importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

if (workbox) {
  workbox.precaching.precacheAndRoute([
    { url: "/", revision: "1" },
    { url: "/nav.html", revision: "1" },
    { url: "/index.html", revision: "1" },
    { url: "/article.html", revision: "1" },
    { url: "/pages/Home.html", revision: "1" },
    { url: "/pages/Standing.html", revision: "1" },
    { url: "/pages/Favorite_Teams.html", revision: "1" },
    { url: "/css/materialize.min.css", revision: "1" },
    { url: "/css/style.css", revision: "1" },
    { url: "/js/materialize.min.js", revision: "1" },
    { url: "/js/nav.js", revision: "1" },
    { url: "/js/api.js", revision: "1" },
    { url: "/js/db.js", revision: "1" },
    { url: "/js/idb.js", revision: "1" },
    { url: "/js/notif.js", revision: "1" },
    { url: "/node_modules/idb/lib/idb.js", revision: "1" },
    { url: "/sw.js", revision: "1" },
    { url: "/push.js", revision: "1" },
    { url: "/asset/logo/icon225.png", revision: "1" },
    { url: "/asset/logo/icon256.png", revision: "1" },
    { url: "/asset/logo/icon512.png", revision: "1" },
    { url: "/asset/img", revision: "1" },
    { url: "/manifest.json", revision: "1" },
    { url: "/favicon.ico", revision: "1" },
    { url: "/service-worker.js", revision: "1" },
  ]);

  workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/"),
    workbox.strategies.staleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /^https:\/\/unpkg\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "snarkdown",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "pages",
    })
  );

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: "image",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /\.(?:js)$/,
    workbox.strategies.cacheFirst({
      cacheName: "js",
    })
  );

  console.log(`Workbox berhasil dimuat`);
} else console.log(`Workbox gagal dimuat`);

// const CACHE_NAME = "football-v13";
// const urlsToCache = [
//   "/nav.html",
//   "/index.html",
//   "/article.html",
//   "/pages/Home.html",
//   "/pages/Standing.html",
//   "/pages/Favorite_Teams.html",
//   "/css/materialize.min.css",
//   "/css/style.css",
//   "/css/article.css",
//   "/js/materialize.min.js",
//   "/js/nav.js",
//   "/js/api.js",
//   "/js/db.js",
//   "/js/idb.js",
//   "/js/notif.js",
//   "/node_modules/idb/lib/idb.js",
//   "/sw.js",
//   "/push.js",
//   "/asset/logo/icon225.png",
//   "/asset/logo/icon256.png",
//   "/asset/logo/icon512.png",
//   "/asset/img",
//   "/manifest.json",
//   "/favicon.ico",
//   "/service-worker.js",
//   "https://fonts.googleapis.com/icon?family=Material+Icons",
//   "https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js",
//   "https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
// ];

// self.addEventListener("install", function (event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function (cache) {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// self.addEventListener("fetch", function (event) {
//   const base_url = "https://api.football-data.org/v2";

//   if (event.request.url.indexOf(base_url) > -1) {
//     event.respondWith(
//       caches.open(CACHE_NAME).then(function (cache) {
//         return fetch(event.request).then(function (response) {
//           cache.put(event.request.url, response.clone());
//           return response;
//         });
//       })
//     );
//   } else {
//     event.respondWith(
//       caches
//         .match(event.request, { ignoreSearch: true })
//         .then(function (response) {
//           return response || fetch(event.request);
//         })
//     );
//   }
// });

// self.addEventListener("activate", function (event) {
//   event.waitUntil(
//     caches.keys().then(function (cacheNames) {
//       return Promise.all(
//         cacheNames.map(function (cacheName) {
//           if (cacheName != CACHE_NAME) {
//             console.log("ServiceWorker: cache " + cacheName + " dihapus");
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

self.addEventListener("push", function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  var options = {
    body: body,
    icon: "img/notification.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
