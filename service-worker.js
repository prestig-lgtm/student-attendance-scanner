const CACHE_NAME = "student-attendance-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",

    // QR scanner library
    "https://unpkg.com/html5-qrcode"
];


// =====================================================
// INSTALL SERVICE WORKER
// =====================================================

self.addEventListener("install", event => {

    console.log("Service Worker: Installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                console.log(
                    "Service Worker: Caching application files..."
                );

                return cache.addAll([
                    "./",
                    "./index.html",
                    "./manifest.json"
                ]);

            })

    );

    self.skipWaiting();

});


// =====================================================
// ACTIVATE SERVICE WORKER
// =====================================================

self.addEventListener("activate", event => {

    console.log("Service Worker: Activated.");

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(
                            cacheName =>
                                cacheName !== CACHE_NAME
                        )
                        .map(
                            cacheName =>
                                caches.delete(cacheName)
                        )

                );

            })

    );

    self.clients.claim();

});


// =====================================================
// FETCH
// =====================================================

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                // Use cached file if available
                if (cachedResponse) {

                    return cachedResponse;

                }


                // Otherwise try the internet
                return fetch(event.request)
                    .then(networkResponse => {

                        /*
                         * Save successful requests
                         * into the cache.
                         */

                        if (
                            networkResponse &&
                            networkResponse.status === 200 &&
                            networkResponse.type !== "opaque"
                        ) {

                            const responseClone =
                                networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(
                                        event.request,
                                        responseClone
                                    );

                                });

                        }

                        return networkResponse;

                    })
                    .catch(() => {

                        /*
                         * If internet is unavailable,
                         * return the cached index page.
                         */

                        return caches.match(
                            "./index.html"
                        );

                    });

            })

    );

});
