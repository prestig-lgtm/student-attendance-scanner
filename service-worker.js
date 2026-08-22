const CACHE_NAME = "attendance-system-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json"
];




self.addEventListener(
    "install",
    event => {

        console.log(
            "Attendance Service Worker installing..."
        );

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(
                cache => {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                }
            )

        );

        self.skipWaiting();

    }
);




self.addEventListener(
    "activate",
    event => {

        console.log(
            "Attendance Service Worker activated."
        );

        event.waitUntil(

            caches.keys()
            .then(
                cacheNames => {

                    return Promise.all(

                        cacheNames
                        .filter(
                            name =>
                                name !==
                                CACHE_NAME
                        )
                        .map(
                            name =>
                                caches.delete(
                                    name
                                )
                        )

                    );

                }
            )

        );

        self.clients.claim();

    }
);




self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(
                cachedResponse => {

                    if (
                        cachedResponse
                    ) {

                        return cachedResponse;

                    }


                    return fetch(
                        event.request
                    );

                }
            )
            .catch(
                () => {

                    return caches.match(
                        "./index.html"
                    );

                }
            )

        );

    }
);
