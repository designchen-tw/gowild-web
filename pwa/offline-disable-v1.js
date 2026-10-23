/* Optional administrator rollback. Serve at the SAME /gw-offline/sw.js URL. */
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const name of await caches.keys())if(name.startsWith('gw-offline-v1-'))await caches.delete(name);
  await self.registration.unregister();
})()));
