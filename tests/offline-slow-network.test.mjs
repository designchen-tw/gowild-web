import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const source=fs.readFileSync(new URL('../pwa/offline-sw-v2.js',import.meta.url),'utf8');
class Cache{data=new Map();async match(r){return this.data.get(typeof r==='string'?r:r.url)?.clone()}async put(r,v){this.data.set(typeof r==='string'?r:r.url,v.clone())}async keys(){return [...this.data.keys()].map(x=>new Request(x))}async delete(r){return this.data.delete(typeof r==='string'?r:r.url)}}
const storage=new Map(),handlers={},messages=[];let fetches=[],mode='hold',release;
const gate=()=>new Promise(resolve=>release=resolve);let pending=gate();
const html='<html><head><script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@old/pwa/app-v9.js" defer></script><script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@old/pwa/offline-v1.js" defer></script><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@old/pwa/offline-v1.css"></head><body><main>儲存的地圖和路線</main></body></html>';
const latest='<html><head></head><body><main>新版路線</main></body></html>';
const weatherOld={threeHour:{temperature:22},fetchedAt:'2026-11-01T08:00:00+08:00'},weatherNew={threeHour:{temperature:24},fetchedAt:'2026-11-02T09:00:00+08:00'};
const caches={open:async n=>{if(!storage.has(n))storage.set(n,new Cache());return storage.get(n)},has:async n=>storage.has(n),keys:async()=>[...storage.keys()],delete:async n=>storage.delete(n)};
const fetch=async(request,options)=>{const url=typeof request==='string'?request:request.url;fetches.push(url);
 if(url.includes('/pwa/'))return new Response('shell',{headers:{'Content-Type':'application/javascript'}});
 if(mode==='hold')await pending;if(mode==='fail')throw Error('network');
 if(mode==='body-stall')return new Response(new ReadableStream({start(){}}),{headers:{'Content-Type':'text/html'}});
 if(url.includes('/api/'))return Response.json(weatherNew);
 if(mode==='404')return new Response('Not found',{status:404});
 return new Response(latest,{headers:{'Content-Type':'text/html'}});
};
const self={GW_OFFLINE_ASSET_BASE:'https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@release/pwa/',location:new URL('https://gowild.one/gw-offline/sw.js'),addEventListener:(name,handler)=>handlers[name]=handler,clients:{get:async id=>({postMessage:data=>messages.push({id,...data})}),claim:async()=>{},matchAll:async()=>[]},skipWaiting:async()=>assert.fail('must not auto-activate')};
const context=vm.createContext({self,caches,fetch,Response,Request,Headers,URL,TextDecoder,TextEncoder,crypto:webcrypto,AbortController,Date,ReadableStream,console,setTimeout:(fn,ms)=>setTimeout(fn,ms>=3000?100:ms),clearTimeout});
vm.runInContext(source,context);const run=code=>vm.runInContext(code,context);
const name='gw-offline-v1-pack-longdong-existing',pack=await caches.open(name);await pack.put('https://gowild.one/longdong',new Response(html,{headers:{'Content-Type':'text/html'}}));await pack.put('https://cdn.prod.website-files.com/x/map.svg',new Response('<svg/>'));
context.saved={slug:'/longdong',cache:name,savedAt:'2026-11-01T08:00:00+08:00',files:2,bytes:200,hashVersion:2,hash:'old'};await run("store('/longdong',saved)");
let installed;handlers.install({waitUntil:p=>installed=p});await installed;assert.equal((await caches.open('gw-offline-v1-shell-2026.11.02.1')).data.size,3);
const navEvent={clientId:'previous',resultingClientId:'reader',waitUntil:p=>jobs.push(p)};let jobs=[];context.event=navEvent;context.req=new Request('https://gowild.one/longdong');
let result=await run('navigation(req,event)');const text=await result.text();assert(text.includes('儲存的地圖和路線'));assert(text.includes('GWStoredDocument'));assert(!text.includes('data-gw-offline'));assert(text.includes('@release/pwa/offline-v2.js'));assert(text.includes('@release/pwa/app-v10.js'));assert.equal(result.headers.get('X-GW-Stored'),'1');await new Promise(r=>setTimeout(r,0));assert.equal(fetches.filter(x=>x.endsWith('/longdong')).length,1);
// Another saved-page open shares the outstanding check and still responds immediately.
await run('navigation(req,event)');assert.equal(fetches.filter(x=>x.endsWith('/longdong')).length,1);assert(!messages.some(x=>x.type==='GW_PAGE_STATE'));
mode='online';release();await Promise.all(jobs);assert(messages.some(x=>x.id==='reader'&&x.type==='GW_PAGE_STATE'&&x.state==='updated'));assert.equal((await pack.match('https://gowild.one/longdong')).headers.get('X-GW-Stored'),null);assert((await(await pack.match('https://gowild.one/longdong')).text()).includes('儲存的地圖'));
// Explicit App reload uses replacesClientId and bypasses the saved document once.
let rpcJob,reply;handlers.message({source:{id:'previous',url:'https://gowild.one/longdong'},data:{type:'GW_PREPARE_RELOAD'},ports:[{postMessage:data=>reply=data}],waitUntil:p=>rpcJob=p});await rpcJob;assert(reply.ok);
context.event={clientId:'',replacesClientId:'previous',resultingClientId:'next',waitUntil:p=>jobs.push(p)};
result=await run('navigation(req,event)');assert.equal(await result.text(),latest);
// Normal browser reload does too; an explicit 404 is never replaced by old content.
context.reloadReq=new Request('https://gowild.one/longdong',{cache:'reload'});mode='404';result=await run('navigation(reloadReq,event)');assert.equal(result.status,404);
// A server that sends headers but never finishes its body must hit the deadline.
mode='body-stall';result=await run('navigation(reloadReq,event)');assert((await result.text()).includes('"state":"unavailable"'));
// Weather displays saved data without awaiting the network; updates are stored,
// never falsely announced as already rendered and never broadcast to other tabs.
mode='hold';pending=gate();await(await caches.open('gw-offline-v1-weather')).put('https://gowild.one/gw-offline/weather/api/longdong',Response.json(weatherOld,{headers:{'X-GW-Saved-At':'2026-11-01T08:02:00+08:00'}}));
context.weatherReq=new Request('https://cwa-weather.designchenme.workers.dev/api/longdong');jobs=[];context.event={clientId:'weather-reader',waitUntil:p=>jobs.push(p)};
result=await run("weather(weatherReq,'/api/longdong',event)");assert.deepEqual(await result.json(),weatherOld);assert(messages.some(x=>x.id==='weather-reader'&&x.type==='GW_WEATHER_CACHED'&&x.savedAt===weatherOld.fetchedAt));
const count=fetches.filter(x=>x.includes('/api/')).length;await run("weather(weatherReq,'/api/longdong',event)");assert.equal(fetches.filter(x=>x.includes('/api/')).length,count);
mode='online';release();await Promise.all(jobs);assert(messages.some(x=>x.type==='GW_WEATHER_READY'&&x.id==='weather-reader'));assert(!messages.some(x=>x.type==='GW_WEATHER_ONLINE'));
assert.deepEqual(await(await(await caches.open('gw-offline-v1-weather')).match('https://gowild.one/gw-offline/weather/api/longdong')).json(),weatherNew);
// A second page already receiving the refreshed cache must not be told its
// data is old or labelled with the previous page's observation time.
context.secondEvent={clientId:'second-reader',waitUntil:p=>jobs.push(p)};
result=await run("weather(weatherReq,'/api/longdong',secondEvent)");assert.deepEqual(await result.json(),weatherNew);await Promise.all(jobs);assert(messages.some(x=>x.id==='second-reader'&&x.type==='GW_WEATHER_CURRENT'&&x.savedAt===weatherNew.fetchedAt));
// The UI can recover messages sent before its script loaded.
handlers.message({source:{id:'weather-reader',url:'https://gowild.one/longdong'},data:{type:'GW_PAGE_STATE',slug:'/longdong'},ports:[{postMessage:data=>reply=data}],waitUntil:p=>rpcJob=p});await rpcJob;assert.equal(reply.weather.type,'GW_WEATHER_READY');
// Explicit reload obtains fresh HTML AND weather in one reload, not a second
// reload prompt after the page has already been refreshed.
context.reloadEvent={resultingClientId:'manual-weather-reader',waitUntil:p=>jobs.push(p)};
await run('navigation(reloadReq,reloadEvent)');
context.manualEvent={clientId:'manual-weather-reader',waitUntil:p=>jobs.push(p)};
result=await run("weather(weatherReq,'/api/longdong',manualEvent)");assert.deepEqual(await result.json(),weatherNew);assert.equal(messages.at(-1).type,'GW_WEATHER_ONLINE');
// Fully offline pages/assets still work and POST remains outside the SW.
mode='fail';result=await run('navigation(req,event)');assert((await result.text()).includes('儲存的地圖'));let response;handlers.fetch({request:new Request('https://cdn.prod.website-files.com/x/map.svg'),respondWith:p=>response=p});assert.equal(await(await response).text(),'<svg/>');
let intercepted=false;handlers.fetch({request:new Request('https://gowild.one/form',{method:'POST',body:'private'}),respondWith(){intercepted=true}});assert.equal(intercepted,false);assert(await caches.has(name));
context.unknown=new Request('https://gowild.one/photography');result=await run('navigation(unknown,event)');assert((await result.text()).includes('Offline library'));
assert.equal((await run('records()')).length,1);
// Saved observations expire only after a full 24 hours, not at midnight.
context.now=Date.now();
assert.equal(await run('weatherMeta({fetchedAt:new Date(now-23*3600000).toISOString()}).expired'),false);
assert.equal(await run('weatherMeta({fetchedAt:new Date(now-25*3600000).toISOString()}).expired'),true);
assert.equal(await run('weatherMeta({fetchedAt:"invalid"}).expired'),true);
const meta=await run('weatherMeta({fetchedAt:new Date(now-25*3600000).toISOString(),tides:{Time:[{DateTime:new Date(now-3600000).toISOString()},{DateTime:new Date(now+3600000).toISOString()}]}})');assert(meta.expired);assert(meta.tideFrom<Date.now()&&meta.tideUntil>Date.now());
console.log('PASS: immediate old-pack navigation, deduplicated background checks, no silent overwrite, App/browser reload bypass, real 404, stalled body deadline, immediate saved weather + timestamps, targeted update notices, early-message recovery, cached assets, offline fallback, POST exclusion, existing-pack compatibility, loader pre-cache.');
