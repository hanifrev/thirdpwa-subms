importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

if (workbox) {
  console.log(`Workbox berhasil dimuat`);
} else console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute(
  [
    { url: "/", revision: "1" },
    { url: "/nav.html", revision: "1" },
    { url: "/index.html", revision: "1" },
    { url: "/article.html", revision: "1" },
    { url: "/pages/Home.html", revision: "1" },
    { url: "/pages/Standing.html", revision: "1" },
    { url: "/pages/Favorite_Teams.html", revision: "1" },
    { url: "/css/materialize.min.css", revision: "1" },
    { url: "/css/style.css", revision: "1" },
    { url: "/css/article.css", revision: "1" },
    { url: "/js/materialize.min.js", revision: "1" },
    { url: "/js/nav.js", revision: "1" },
    { url: "/js/api.js", revision: "1" },
    { url: "/js/db.js", revision: "1" },
    { url: "/js/idb.js", revision: "1" },
    { url: "/js/notif.js", revision: "1" },
    { url: "/sw.js", revision: "1" },
    { url: "/push.js", revision: "1" },
    { url: "/asset/logo/icon225.png", revision: "1" },
    { url: "/asset/logo/icon256.png", revision: "1" },
    { url: "/asset/logo/icon512.png", revision: "1" },
    { url: "/asset/img", revision: "1" },
    { url: "/manifest.json", revision: "1" },
    { url: "/favicon.ico", revision: "1" },
    { url: "/service-worker.js", revision: "1" },
  ],
  {
    ignoreURLParametersMatching: [/.*/],
  }
);

workbox.routing.registerRoute(
  new RegExp("https://api.football-data.org/v2"),
  workbox.strategies.networkFirst({
    cacheName: "footballdata-api",
  })
);

workbox.routing.registerRoute(
  new RegExp("https://crests.football-data.org/"),
  workbox.strategies.networkFirst({
    cacheName: "footballdata-api-image",
  })
);

workbox.routing.registerRoute(
  new RegExp("/article.html"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "article",
  })
);

workbox.routing.registerRoute(
  new RegExp("/Standing.html"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "standing",
  })
);

workbox.routing.registerRoute(
  new RegExp("/Favorite_Teams.html"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "fav",
  })
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
  /.*(?:png|gif|jpg|jpeg|svg|ico)$/,
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
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "js",
  })
);

workbox.routing.registerRoute(
  /\.(?:html)$/,
  workbox.strategies.cacheFirst({
    cacheName: "html",
  })
);

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
