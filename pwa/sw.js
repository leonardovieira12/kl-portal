'use strict';
const CACHE='kl-portal-public-v1';
const PUBLIC=['/pwa/offline.html','/pwa/icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PUBLIC)))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('kl-portal-public-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
// Navigation responses are never cached. API, POST, scripts and customer data stay network-only.
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||req.mode!=='navigate'||url.pathname.includes('/api/'))return;event.respondWith(fetch(req).catch(()=>caches.open(CACHE).then(cache=>cache.match('/pwa/offline.html'))))});
