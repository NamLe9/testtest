const staticCacheName = 'site-static';
const dynamicCacheName = 'site-dynamic';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/js/location.js',
    '/css/materialize.min.css',
    '/css/styles.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
];

//cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
};

//storing in cache
self.addEventListener('install', evt => {
    console.log('service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

//cache versioning - deleting old assets
self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    )
});

//getting cache for offline usage
//fetch event
self.addEventListener('fetch', evt => {
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
        //console.log('fetch event', evt);
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        limitCacheSize(dynamicCacheName, 1);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if(evt.request.url.indexOf('.html') > -1){
                    return caches.match('/pages/fallback.html'); 
                }
            })
        );
    }
});