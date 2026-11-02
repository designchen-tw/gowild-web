import assert from 'node:assert/strict';import worker from '../pwa-offline-worker.js';
const saved=globalThis.fetch,urls=[];globalThis.fetch=async url=>{urls.push(String(url));return new Response('<script src="__GW_UPDATE_ASSET_BASE__update-v1.js"></script>',{headers:{'Content-Type':'application/javascript'}})};
try{const request=path=>new Request('https://gowild.one'+path),env={OFFLINE_ASSET_COMMIT:'a'.repeat(40)};
assert.equal((await worker.fetch(request('/longdong'),env)).status,404);
assert.equal((await(await worker.fetch(request('/gw-offline/health'),{})).json()).release,'2026.11.02.4');
assert.equal((await worker.fetch(request('/gw-offline/sw.js'),{OFFLINE_ASSET_COMMIT:'invalid'})).status,503);
let r=await worker.fetch(request('/gw-offline/sw.js'),env);assert.equal(r.status,200);assert.equal(r.headers.get('Service-Worker-Allowed'),'/');assert(r.headers.get('Content-Type').includes('javascript'));assert.equal(r.headers.get('Cache-Control'),'no-cache');assert(urls[0].endsWith('/pwa/offline-sw-v5.js'));assert((await r.text()).includes('self.GW_OFFLINE_ASSET_BASE="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@'+'a'.repeat(40)+'/pwa/";'));
await worker.fetch(request('/gw-offline/sw.js'),{...env,OFFLINE_DISABLED:'true'});assert(urls.at(-1).endsWith('/pwa/offline-disable-v1.js'));
assert.equal((await worker.fetch(new Request('https://gowild.one/gw-offline/sw.js',{method:'POST'}),env)).status,405);assert.equal(await(await worker.fetch(new Request('https://gowild.one/gw-offline/sw.js',{method:'HEAD'}),env)).text(),'');
assert.equal((await worker.fetch(request('/gw-offline/sw.js'),{})).status,200);
r=await worker.fetch(request('/gw-offline/update'),env);assert(r.headers.get('Content-Type').includes('text/html'));assert.equal(r.headers.get('Cache-Control'),'no-store');assert((await r.text()).includes('https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@'+'a'.repeat(40)+'/pwa/update-v1.js'));assert(urls.at(-1).endsWith('/pwa/update-v1.html'));assert.equal(await(await worker.fetch(new Request('https://gowild.one/gw-offline/update',{method:'HEAD'}),env)).text(),'');
console.log('PASS: dedicated route, v5 asset and bootstrap base, validated commit, correct SW headers, rollback, GET/HEAD only.');}finally{globalThis.fetch=saved}
