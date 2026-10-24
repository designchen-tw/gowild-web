import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';
const source=fs.readFileSync(new URL('../pwa/offline-sw-v1.js',import.meta.url),'utf8');
const storage=new Map();class Cache{constructor(){this.data=new Map()}async match(r){return this.data.get(typeof r==='string'?r:r.url)?.clone()}async put(r,v){this.data.set(typeof r==='string'?r:r.url,v.clone())}async delete(r){return this.data.delete(typeof r==='string'?r:r.url)}async keys(){return [...this.data.keys()].map(x=>new Request(x))}}
const caches={open:async n=>{if(!storage.has(n))storage.set(n,new Cache());return storage.get(n)},has:async n=>storage.has(n),keys:async()=>[...storage.keys()],delete:async n=>storage.delete(n)};
const handlers={},messages=[];let mode='online',brokenAsset=false;
const html='<html><head></head><body><main>龍洞</main></body></html>';
let pageHTML=html;const homeHTML='<html><head><link rel="stylesheet" href="https://cdn.prod.website-files.com/x/home.css"><script src="https://cdn.prod.website-files.com/x/home.js"></script></head><body><nav>Menu</nav><main class="hero">首頁<img src="https://cdn.prod.website-files.com/x/home.jpg"></main></body></html>';let homeDownloads=0;
const fetch=async request=>{const u=typeof request==='string'?request:request.url;if(mode==='offline')throw Error('network');if(request.method==='HEAD')return new Response(null,{headers:{'Content-Length':'1000'}});if(u==='https://gowild.one/')return new Response(homeHTML,{headers:{'Content-Type':'text/html'}});if(u.endsWith('/home.js'))homeDownloads++;if(u.includes('/api/'))return Response.json({threeHour:{},fetchedAt:'2026-10-24T01:00:00+08:00'});if(u.endsWith('/longdong'))return new Response(pageHTML,{headers:{'Content-Type':'text/html'}});if(brokenAsset&&u.endsWith('/a.js'))return new Response('bad',{status:503});if(u.endsWith('.css'))return new Response('@font-face{src:url("./f.woff2")} .x{background:url("./unused.jpg")}',{headers:{'Content-Type':'text/css'}});return new Response('asset',{headers:{'Content-Type':'application/javascript'}})};
const self={location:new URL('https://gowild.one/gw-offline/sw.js'),addEventListener:(n,f)=>handlers[n]=f,clients:{claim:async()=>{},matchAll:async()=>[{postMessage:x=>messages.push(x)}]},skipWaiting:async()=>{throw Error('skipWaiting was not approved')}};
const context=vm.createContext({self,caches,fetch,Response,Request,Headers,URL,TextDecoder,TextEncoder,crypto:webcrypto,setTimeout,clearTimeout,AbortController,Date,console});vm.runInContext(source,context);
const run=(code)=>vm.runInContext(code,context);
assert.equal(run("assetAllowed('https://cdn.prod.website-files.com/x/a.avif')"),true);
for(const bad of ['https://evil.example/a.js','https://cdn.jsdelivr.net/gh/evil/repo@main/a.js','https://gowild.one/login','https://cdn.prod.website-files.com/x/a.pdf','https://cdn.prod.website-files.com/x/a.jpg?token=private','https://challenges.cloudflare.com/turnstile.js'])assert.equal(run(`assetAllowed(${JSON.stringify(bad)})`),false);
const assets=['https://cdn.prod.website-files.com/x/a.css','https://cdn.prod.website-files.com/x/a.js','https://cdn.prod.website-files.com/x/a.jpg'];context.assets=assets;
const beforeEstimate=storage.size;const estimate=await run("estimatePack('/longdong',assets)");assert(estimate.bytes>0);assert.equal(storage.size,beforeEstimate);assert.equal(homeDownloads,0);context.progress=[];
let result=await run("savePack('/longdong',assets,p=>progress.push(p))");assert.equal(context.progress.at(-1).percent,100);assert(context.progress.slice(0,-1).every(p=>p.percent<100));assert(context.progress.every((p,i,a)=>!i||p.percent>=a[i-1].percent));assert.equal(homeDownloads,1);assert.equal((await run("record('/')")).slug,'/');assert.equal(result.files,5);assert(result.bytes>0);let oldName=result.cache;
assert.equal((await run('records()')).length,1);assert(![...storage.get(oldName).data.keys()].some(x=>x.endsWith('unused.jpg')));
brokenAsset=true;await assert.rejects(run("savePack('/longdong',assets,()=>{})"),/ASSET_UNAVAILABLE/);assert.equal((await run("record('/longdong')")).cache,oldName);assert(storage.has(oldName));assert.equal([...storage.keys()].filter(x=>x.includes('pack-')).length,2);brokenAsset=false;
const updated=await run("savePack('/longdong',assets,()=>{})");assert.notEqual(updated.cache,oldName);assert(!storage.has(oldName));oldName=updated.cache;assert.equal(homeDownloads,1);
assert.notEqual(await run("fingerprint('<main>old</main>')"),await run("fingerprint('<main>new</main>')"));
// Real production examples: Cloudflare rotates email XOR keys on every request.
const contact=(href,span)=>html.replace('</main>',`<a href="/cdn-cgi/l/email-protection#${href}"><span class="__cf_email__" data-cfemail="${span}">[email&#160;protected]</span></a></main>`);
const encodedA=contact('f0979f87999c94de8487b0979d91999cde939f9d','ee89819987828ac09a99ae89838f8782c08d8183');
const encodedB=contact('e5828a928c8981cb9192a58288848c89cb868a88','4b2c243c22272f653f3c0b2c262a222765282426');
context.encodedA=encodedA;context.encodedB=encodedB;
assert.notEqual(encodedA,encodedB);
assert.equal(await run('fingerprint(encodedA)'),await run('fingerprint(encodedB)'));
// A different actual email, route description or versioned map URL must count.
assert.notEqual(await run('fingerprint(encodedA)'),await run('fingerprint(encodedB.replace("4b2c243c22272f653f3c0b2c262a222765282426","4b2d243c22272f653f3c0b2c262a222765282426"))'));
assert.notEqual(await run('fingerprint(encodedA)'),await run('fingerprint(encodedB.replace("龍洞","龍洞新版"))'));
context.withMapA=encodedA+'<script src="map-v1.js"></script>';context.withMapB=encodedB+'<script src="map-v2.js"></script>';assert.notEqual(await run('fingerprint(withMapA)'),await run('fingerprint(withMapB)'));
// Existing v1 packages are rehashed from saved HTML without replacing the pack.
await storage.get(oldName).put('https://gowild.one/longdong',new Response(encodedA,{headers:{'Content-Type':'text/html'}}));
await run("store('/longdong',{..."+JSON.stringify(updated)+",hash:'legacy-full-html-hash',hashVersion:undefined})");
pageHTML=encodedB;
assert.equal((await run("record('/longdong').then(checkPack)")).changed,false);
assert.equal((await run("record('/longdong').then(checkPack)")).changed,false);
assert.equal((await run("record('/longdong')")).hashVersion,2);
assert.equal((await run("record('/longdong')")).cache,oldName);
assert.equal((await run("record('/longdong')")).savedAt,updated.savedAt);
pageHTML=encodedB.replace('龍洞','龍洞新版');
assert.equal((await run("record('/longdong').then(checkPack)")).changed,true);
assert.equal((await run("record('/longdong').then(checkPack)")).changed,true);
const savedNew=await run("savePack('/longdong',assets,()=>{})");oldName=savedNew.cache;
assert.equal((await run("record('/longdong').then(checkPack)")).changed,false);
pageHTML=html;
const req=new Request('https://cwa-weather.designchenme.workers.dev/api/longdong');context.weatherReq=req;await run("weather(weatherReq,'/api/longdong')");mode='offline';const response=await run("weather(weatherReq,'/api/longdong')");assert.equal(response.headers.get('X-GW-Offline'),'1');assert.equal((await response.json()).fetchedAt,'2026-10-24T01:00:00+08:00');assert(messages.some(x=>x.type==='GW_WEATHER_OFFLINE'));
context.pageReq=new Request('https://gowild.one/longdong?source=app');let page=await run('navigation(pageReq)');assert((await page.text()).includes('GWOfflineDocument'));assert.equal(page.headers.get('X-GW-Offline'),'1');context.pageReq=new Request('https://gowild.one/');page=await run('navigation(pageReq)');const offlineHome=await page.text();assert(offlineHome.includes('首頁'));assert(offlineHome.includes('<nav>Menu</nav>'));assert(offlineHome.includes('GWOfflineDocument'));context.pageReq=new Request('https://gowild.one/photography');page=await run('navigation(pageReq)');assert((await page.text()).includes('Offline library'));
let intercepted=false;handlers.fetch({request:new Request('https://gowild.one/form',{method:'POST',body:'private form data'}),respondWith(){intercepted=true}});assert(!intercepted);
let waited;handlers.install({waitUntil(){throw Error('install must not auto-activate updates')}});handlers.activate({waitUntil:p=>waited=p});await waited;assert(storage.has(oldName));assert(await run("record('/')"));
// Missing assets cannot remain labelled ready after storage eviction.
await storage.get(oldName).delete(assets[0]);assert.equal((await run('records()')).length,0);assert(!storage.has(oldName));
console.log('PASS: estimates without downloading assets, shared homepage/menu saved once, monotonic progress to committed 100%, offline homepage, rotating Cloudflare email keys, real content changes, legacy-pack hash migration, repeated checks and resave, public-asset allowlist, staged downloads, stale weather, offline pages, POST exclusion, update lifecycle, eviction detection.');
new vm.Script(fs.readFileSync(new URL('../pwa/offline-v1.js',import.meta.url),'utf8'));new vm.Script(fs.readFileSync(new URL('../pwa/app-v8.js',import.meta.url),'utf8'));
