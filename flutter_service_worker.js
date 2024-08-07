'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "7f3ee6703f2f2fdea5457eeee4225e33",
"version.json": "692322028ce5417083c8554c3ba3971e",
"index.html": "97f3d138f5b7b80d3db0bd92b2127117",
"/": "97f3d138f5b7b80d3db0bd92b2127117",
"main.dart.js": "95e7f1ec8709034c5aa0d2d2091b438a",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"favicon.png": "e0487b8387d3f8dd76d5699c6e89d99b",
"icons/Icon-192.png": "572b168c7b6d4acd411d5f4dd9e02393",
"icons/Icon-maskable-192.png": "572b168c7b6d4acd411d5f4dd9e02393",
"icons/Icon-maskable-512.png": "3bde932c6554071bf684c99304b61ee5",
"icons/Icon-512.png": "3bde932c6554071bf684c99304b61ee5",
"manifest.json": "24ecb915a33ed10b1a71a9b8be26e3e4",
"assets/AssetManifest.json": "4656ce225b36d289f982b33bee391ce9",
"assets/NOTICES": "dc07bc5a519992788ff5d7ddb1a80061",
"assets/FontManifest.json": "a1720a5185374e87f3994602695cdb61",
"assets/AssetManifest.bin.json": "d0746c665975300f36a4f8eb606342d9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "aa03ea75dacbbe7a82c4df3aa9cc956c",
"assets/fonts/NotoSans-Bold.ttf": "ef4b39fb4d49db8beed2966debc0f477",
"assets/fonts/RubikScribble-Regular.ttf": "8e9b296e5c386f7884852d6412f375b6",
"assets/fonts/RubikDoodleShadow-Regular.ttf": "ada3eb3b10a011e7175954ec8ccec0f8",
"assets/fonts/MaterialIcons-Regular.otf": "e2b9dacbadbe5599ed4723c7ca7d960e",
"assets/fonts/MonomaniacOne-Regular.ttf": "d1aa12eab9a887949329fa4648dd9957",
"assets/assets/rules.png": "e4436fbd0e45f43292d7356661e96f93",
"assets/assets/login.png": "793999bb8ea8ecdd4e2f68dbcc8b4f98",
"assets/assets/ghost_landscape.png": "99e09eb8c19e48cb0df340bc264f5d31",
"assets/assets/restart.png": "d13fcb709aeb252a979305ddc355d84b",
"assets/assets/ghost.png": "b33b3107d6b512cef7061a9fe4d5ae59",
"assets/assets/cell_background.png": "8fba779dc75b15acba9c8b61ba84bc1c",
"assets/assets/stats.png": "89f15b86779f92cd956da66def187213",
"assets/assets/audio/Sweet_Fruits.mp3": "6a203107e23be92519f8c3b4c6ea91a8",
"assets/assets/audio/cancel.mp3": "cb665215c4e7ba3bca8246ae0dabc647",
"assets/assets/audio/elimination.mp3": "73004498e2ef9e395813b65b8fa61d9c",
"assets/assets/mathblitz_title.png": "28f7ce3926d93e9f23c04aedbf0a0a94",
"assets/assets/mathblitz.png": "bb2f38a24284dfc497d56522150c23d5",
"assets/assets/rank.png": "10b5cf9e3a06d1501282c35e7106b586",
"assets/assets/default.png": "1bbf6185fca81b2565711bfb206d42f6",
"assets/assets/play.png": "bee79576df411160e2da34a6d41a5446",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
