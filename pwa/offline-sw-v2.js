/* GO WILD offline v2. Only explicitly saved public crags; no forms, PDFs or live media. */
'use strict';
const RELEASE = '2026.11.02.1', HASH_VERSION = 2;
const PREFIX = 'gw-offline-v1-', META = PREFIX+'meta', LIVE = PREFIX+'weather';
const CRAGS = ['/longdong','/defulan','/guanziling','/kenting'], SAVED_PAGES = ['/',...CRAGS];
const ORIGIN = self.location.origin;
const LIMIT_BYTES = 64*1024*1024, LIMIT_FILES = 200;
let saving = false, packIndex = null;
const pathOf = value => { try { return new URL(value,ORIGIN).pathname.replace(/\/$/,'')||'/'; } catch { return ''; } };
function assetAllowed(value) {
  let u; try { u=new URL(value,ORIGIN); } catch { return false; }
  if(!['https:','http:'].includes(u.protocol) || /(?:authorization|token|signature|password|email|key)=/i.test(u.search))return false;
  if(!/\.(?:css|m?js|json|svg|avif|png|jpe?g|webp|gif|ico|woff2?|ttf|otf)$/i.test(u.pathname))return false;
  if(/(?:analytics|gtag|gtm|turnstile|captcha|beacon|insights|adobe|acrobat|\.pdf)/i.test(u.href))return false;
  if(u.origin===ORIGIN)return /^\/(?:_repo\/|assets\/|pwa\/)/.test(u.pathname)||/^(localhost|127\.0\.0\.1)$/.test(u.hostname)&&/^\/[a-z0-9-]+-v\d+\.(?:js|css)$/i.test(u.pathname);
  if(u.hostname==='cdn.jsdelivr.net')return /^\/(?:gh\/designchen-tw\/gowild-web@[^/]+\/|npm\/@finsweet\/)/.test(u.pathname);
  if(['cdn.prod.website-files.com','cdn.prod.website-files.com','assets.website-files.com','d3e54v103j8qbb.cloudfront.net','cdn.webflow.com','ajax.googleapis.com','cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com','cdn.prod.website-files.com'].includes(u.hostname))return true;
  return false;
}
function weatherPath(value) {
  const u=new URL(value,ORIGIN);
  if(u.hostname==='cwa-weather.designchenme.workers.dev'&&/^\/api\/(longdong|defulan|guanziling|kenting)$/.test(u.pathname))return u.pathname;
  if(u.origin===ORIGIN&&/^\/(?:_weather|api)\/(longdong|defulan|guanziling|kenting)$/.test(u.pathname)&&/^(localhost|127\.0\.0\.1)$/.test(self.location.hostname))return '/api/'+u.pathname.split('/').pop();
  return null;
}
const metaURL=slug=>ORIGIN+'/gw-offline/meta'+slug;
async function record(slug){const r=await(await caches.open(META)).match(metaURL(slug));return r?r.json():null;}
async function store(slug,data){await(await caches.open(META)).put(metaURL(slug),Response.json(data));}
async function records(includeHome=false){const result=[];for(const slug of includeHome?SAVED_PAGES:CRAGS){let r=await record(slug);if(r){const exists=await caches.has(r.cache);const count=exists?(await(await caches.open(r.cache)).keys()).length:0;if(!exists||count!==r.files){await(await caches.open(META)).delete(metaURL(slug));if(exists)await caches.delete(r.cache);r=null;}}if(r)result.push(r);}return result;}
async function notify(data){for(const client of await self.clients.matchAll({type:'window',includeUncontrolled:true}))client.postMessage(data);}
async function digest(text){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
function emailIdentity(hex){
  // Cloudflare changes the XOR key per response. Retain the email identity,
  // so a real contact-address edit still counts as a content update.
  const key=parseInt(hex.slice(0,2),16),bytes=[];
  for(let i=2;i<hex.length;i+=2)bytes.push(parseInt(hex.slice(i,i+2),16)^key);
  return bytes.map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
function fingerprint(html){return digest(html
  .replace(/\snonce=(?:"[^"]*"|'[^']*')/gi,'')
  .replace(/<script\b[^>]*src=["'][^"']*(?:cloudflareinsights|cdn-cgi\/scripts)[^"']*["'][^>]*>[\s\S]*?<\/script>/gi,'')
  .replace(/(\bdata-cfemail\s*=\s*)(["'])((?:[\da-f]{2}){2,})\2/gi,(_,attr,quote,hex)=>attr+quote+emailIdentity(hex)+quote)
  .replace(/(\/cdn-cgi\/l\/email-protection#)((?:[\da-f]{2}){2,})(?=["'\s>])/gi,(_,path,hex)=>path+emailIdentity(hex)));
}
async function checkPack(r){
  // Upgrade old fingerprints from the saved HTML, never from the current site.
  // This preserves genuine changes and requires no repeat download of assets.
  if(r.hashVersion!==HASH_VERSION){
    const saved=await(await caches.open(r.cache)).match(ORIGIN+r.slug);
    if(!saved)throw Error('PAGE_UNAVAILABLE');
    r={...r,hash:await fingerprint(await saved.text()),hashVersion:HASH_VERSION};
    await store(r.slug,r);
  }
  const p=await fetchPage(r.slug);
  return {slug:r.slug,changed:p.hash!==r.hash,checkedAt:new Date().toISOString()};
}
async function network(request,ms=12000){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),ms);try{return await fetch(request,{signal:controller.signal});}finally{clearTimeout(timer);}}
async function fetchPage(slug){const r=await network(new Request(ORIGIN+slug,{credentials:'omit',cache:'no-store',headers:{Accept:'text/html'}}));if(!r.ok||!r.headers.get('Content-Type')?.includes('text/html')||/private|no-store/i.test(r.headers.get('Cache-Control')||'')||new URL(r.url||ORIGIN+slug).origin!==ORIGIN)throw Error('PAGE_UNAVAILABLE');const html=await r.text();if(!/<main\b/i.test(html)||/cf-chl-|Just a moment\.\.\./.test(html))throw Error('PAGE_UNAVAILABLE');return{html,headers:r.headers,hash:await fingerprint(html)};}
function cssDependencies(css,base,classes){
  const urls=[];for(const m of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)){try{const u=new URL(m[1],base);if(/\.(?:woff2?|ttf|otf|css)$/i.test(u.pathname))urls.push(u.href);}catch{}}
  for(const m of css.matchAll(/@import\s+["']([^"']+)["']/gi))try{urls.push(new URL(m[1],base).href);}catch{}
  // Only homepage classes actually in the saved HTML, not every Webflow image.
  if(classes)for(const block of css.matchAll(/([^{}]+)\{([^{}]*)\}/g))if([...block[1].matchAll(/\.([\w-]+)/g)].some(m=>classes.has(m[1])))for(const m of block[2].matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g))try{urls.push(new URL(m[1],base).href);}catch{}
  return urls;
}
function htmlAssets(html,slug){
  const found=new Set(),base=ORIGIN+slug,add=value=>{try{const u=new URL(value.replace(/&amp;/g,'&').replace(/&#38;/g,'&'),base).href;if(assetAllowed(u))found.add(u);}catch{}};
  for(const tag of html.matchAll(/<(?:script|link|img|source|[^\s>]+\b[^>]*\bdata-animation-type=["']lottie["'])\b[^>]*>/gi)){
    for(const m of tag[0].matchAll(/\b(?:src|href|data-src)\s*=\s*["']([^"']+)["']/gi))add(m[1]);
    for(const m of tag[0].matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi))for(const item of m[1].split(','))add(item.trim().split(/\s+/)[0]);
  }
  for(const m of html.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g))add(m[1]);
  // Both logos are needed when switching themes offline.
  for(const m of html.matchAll(/https:\/\/cdn\.prod\.website-files\.com\/[^\s"'<>]+logo_GW[^\s"'<>]+\.(?:avif|png)/g))add(m[0]);
  return [...found];
}
const estimates=new Map(),headSizes=new Map(),cssSources=new Map();
function fallbackSize(url){return /\.(avif|webp|jpe?g|png)$/i.test(new URL(url).pathname)?160000:/\.(woff2?|ttf|otf)$/i.test(new URL(url).pathname)?60000:80000;}
async function estimateSize(address){
  if(headSizes.has(address))return headSizes.get(address);
  const task=(async()=>{try{const r=await network(new Request(address,{method:'HEAD',mode:'cors',credentials:'omit',cache:'no-cache'}),5000);const size=Number(r.headers.get('Content-Length'));if(r.ok&&size>0)return size;}catch{}return fallbackSize(address);})();headSizes.set(address,task);return task;
}
async function estimatePack(slug,assets=[]){
  if(!SAVED_PAGES.includes(slug))throw Error('INVALID_CRAG');
  const prior=estimates.get(slug);if(prior&&Date.now()-prior.at<300000)return prior.value;
  const page=await fetchPage(slug),urls=[...new Set([...htmlAssets(page.html,slug),...assets.filter(assetAllowed)])],seen=new Set(urls);
  const classes=slug==='/'?new Set([...page.html.matchAll(/\bclass=["']([^"']+)["']/g)].flatMap(m=>m[1].split(/\s+/))):null;
  let bytes=new TextEncoder().encode(page.html).length,index=0;
  async function take(){while(index<urls.length){const address=urls[index++];if(seen.size>LIMIT_FILES)throw Error('PACK_TOO_LARGE');
    if(/\.css(?:\?|$)/i.test(address))try{
      if(!cssSources.has(address))cssSources.set(address,(async()=>{const r=await network(new Request(address,{mode:'cors',credentials:'omit',cache:'no-cache'}),5000);if(!r.ok)throw Error('css');return r.text();})());
      const css=await cssSources.get(address);bytes+=new TextEncoder().encode(css).length;
      for(const child of cssDependencies(css,address,classes))if(assetAllowed(child)&&!seen.has(child)){seen.add(child);urls.push(child);}continue;
    }catch{}
    bytes+=await estimateSize(address);
  }}
  await Promise.all([take(),take(),take()]);
  // Font/import dependencies may not expose HEAD sizes. Label all sizes as estimates.
  const value={slug,bytes:Math.ceil(bytes*1.12),files:urls.length+1};estimates.set(slug,{at:Date.now(),value});return value;
}
async function downloadPack(slug,assets,page,progress){
  const name=PREFIX+'pack-'+(slug==='/'?'home':slug.slice(1))+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),cache=await caches.open(name);
  try{
    page=page||await fetchPage(slug);
    const queue=[...new Set([...htmlAssets(page.html,slug),...assets.filter(assetAllowed).map(u=>new URL(u,ORIGIN).href)])];
    if(!queue.some(x=>/\.js(?:\?|$)/.test(x))||!queue.some(x=>/\.css(?:\?|$)/.test(x)))throw Error('PAGE_NOT_READY');
    let bytes=new TextEncoder().encode(page.html).length,done=0;const seen=new Set(queue),classes=slug==='/'?new Set([...page.html.matchAll(/\bclass=["']([^"']+)["']/g)].flatMap(m=>m[1].split(/\s+/))):null;
    async function take(){while(queue.length){if(seen.size>LIMIT_FILES)throw Error('PACK_TOO_LARGE');const address=queue.shift();const r=await network(new Request(address,{mode:'cors',credentials:'omit',cache:'reload'}));if(!r.ok||r.type==='opaque')throw Error('ASSET_UNAVAILABLE');const body=await r.arrayBuffer();bytes+=body.byteLength;if(bytes>LIMIT_BYTES)throw Error('PACK_TOO_LARGE');const headers=new Headers(r.headers);headers.delete('content-encoding');headers.delete('content-length');await cache.put(address,new Response(body,{status:200,headers}));if(/\.css(?:\?|$)/i.test(address)){for(const child of cssDependencies(new TextDecoder().decode(body),address,classes)){if(assetAllowed(child)&&!seen.has(child)){seen.add(child);queue.push(child);}}}done++;progress({done,total:seen.size,bytes});}}
    const settled=await Promise.allSettled([take(),take(),take()]);const error=settled.find(x=>x.status==='rejected');if(error)throw error.reason;
    const headers=new Headers(page.headers);headers.delete('content-encoding');headers.delete('content-length');await cache.put(ORIGIN+slug,new Response(page.html,{headers}));
    const old=await record(slug),next={slug,cache:name,savedAt:new Date().toISOString(),hash:page.hash,hashVersion:HASH_VERSION,bytes,files:done+1,release:RELEASE};
    await store(slug,next);packIndex=null;if(old&&old.cache!==name){try{await caches.delete(old.cache);}catch{}}estimates.delete(slug);return next;
  }catch(error){await caches.delete(name);throw error;}
}
async function savePack(slug,assets,progress){
  if(!SAVED_PAGES.includes(slug))throw Error('INVALID_CRAG');
  if(saving)throw Error('BUSY');saving=true;
  try{
    await records(true);
    const total=(await estimatePack(slug,assets)).bytes,homePage=slug==='/'?null:await fetchPage('/'),home=await record('/');
    const needHome=homePage&&(!home||home.hashVersion!==HASH_VERSION||homePage.hash!==home.hash);
    const homeSize=needHome?(await estimatePack('/')).bytes:0;let completed=0,completedWeight=0,phaseWeight=homeSize||total,percent=0;
    const report=p=>{percent=Math.max(percent,Math.min(99,Math.floor((completedWeight+phaseWeight*(p.done/Math.max(1,p.total)))/(total+homeSize)*100)));progress({...p,percent,bytes:completed+p.bytes});};
    // Shared homepage/menu is saved once and reused by every crag.
    if(needHome){const shared=await downloadPack('/',[],homePage,report);completed=shared.bytes;completedWeight=homeSize;phaseWeight=total;}
    const result=await downloadPack(slug,assets,null,report);progress({percent:100,bytes:completed+result.bytes,done:result.files,total:result.files});return result;
  }finally{saving=false;}
}
async function cachedAsset(request){const shell=await(await caches.open(PREFIX+'shell-'+RELEASE)).match(request,{ignoreVary:true});if(shell)return shell;if(!packIndex)packIndex=await records(true);for(const r of packIndex){const hit=await(await caches.open(r.cache)).match(request,{ignoreVary:true});if(hit)return hit;}return null;}
// Keep v1 pack/cache names: upgrading never deletes a successfully saved crag.
const CLIENT_BASE=self.GW_OFFLINE_ASSET_BASE||new URL('../pwa/',self.location.href).href;
const pageChecks=new Map(),weatherChecks=new Map(),pageStates=new Map(),weatherStates=new Map(),freshClients=new Set(),manualWeatherClients=new Map();
const CHECK_INTERVAL=300000;
function keep(event,job){if(event?.waitUntil)event.waitUntil(job.catch(()=>{}));}
async function tell(clientId,data){
  if(!clientId)return;
  const client=self.clients.get?await self.clients.get(clientId):(await self.clients.matchAll({type:'window',includeUncontrolled:true})).find(c=>c.id===clientId);
  client?.postMessage(data);
}
function remember(map,key,value){map.set(key,value);if(map.size>80)map.delete(map.keys().next().value);return value;}
function cleanHeaders(response){const h=new Headers(response.headers);['content-length','content-encoding','etag'].forEach(k=>h.delete(k));return h;}
// The deadline includes reading the response body, not only receiving headers.
async function readNetwork(request,ms){
  const controller=new AbortController();let timer;
  const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('NETWORK_TIMEOUT'));},ms);});
  try{return await Promise.race([(async()=>{const r=await fetch(request,{signal:controller.signal});const body=await r.arrayBuffer();return new Response(body,{status:r.status,statusText:r.statusText,headers:cleanHeaders(r)});})(),timeout]);}
  finally{clearTimeout(timer);}
}
function savedHTML(html,data){
  // Saved HTML may still reference an older footer. Upgrade just our offline/App
  // loaders, retaining the pack's own compatible map, styles and route assets.
  html=html.replace(/(?:https:\/\/cdn\.jsdelivr\.net\/gh\/designchen-tw\/gowild-web@[^/"'\s]+\/pwa\/|\/(?:_repo\/)?pwa\/)(offline-v\d+\.(?:js|css)|app-v\d+\.js)(?=["'])/g,(_,name)=>CLIENT_BASE+(name.startsWith('app-')?'app-v10.js':name.endsWith('.css')?'offline-v2.css':'offline-v2.js'));
  const safe=JSON.stringify(data).replace(/</g,'\\u003c');
  const boot='<script>window.GWStoredDocument='+safe+';</script>';
  return html.replace(/<head\b[^>]*>/i,m=>m+boot);
}
function offlineHTML(html,data){return savedHTML(html,{...data,state:'unavailable'});}
async function savedPage(slug){
  if(!SAVED_PAGES.includes(slug))return null;
  const data=await record(slug);if(!data||!await caches.has(data.cache))return null;
  const hit=await(await caches.open(data.cache)).match(ORIGIN+slug);
  return hit?{data,hit}:null;
}
function savedResponse(saved,state='checking'){
  const headers=cleanHeaders(saved.hit);headers.set('X-GW-Stored','1');headers.set('Cache-Control','no-store');
  return saved.hit.text().then(html=>new Response(savedHTML(html,{slug:saved.data.slug,savedAt:saved.data.savedAt,state}),{headers}));
}
async function inspectPage(slug,clientId,force=false){
  let entry=pageChecks.get(slug);
  if(force||!entry||Date.now()-entry.at>CHECK_INTERVAL){
    const task=(async()=>{
      const saved=await savedPage(slug);if(!saved)return null;
      remember(pageStates,slug,{type:'GW_PAGE_STATE',slug,state:'checking'});
      try{
        const response=await readNetwork(new Request(ORIGIN+slug,{credentials:'omit',cache:'no-store',headers:{Accept:'text/html'}}),5000);
        if(!response.ok||!response.headers.get('Content-Type')?.includes('text/html'))throw Error('PAGE_UNAVAILABLE');
        const html=await response.text();if(!/<main\b/i.test(html)||/cf-chl-|Just a moment\.\.\./.test(html))throw Error('PAGE_UNAVAILABLE');
        const changed=await fingerprint(html)!==await fingerprint(await saved.hit.text());
        return remember(pageStates,slug,{type:'GW_PAGE_STATE',slug,state:changed?'updated':'current',checkedAt:new Date().toISOString()});
      }catch{return remember(pageStates,slug,{type:'GW_PAGE_STATE',slug,state:'unavailable'});}
    })();
    entry={at:Date.now(),task};remember(pageChecks,slug,entry);
  }
  const result=await entry.task;if(result)await tell(clientId,result);return result;
}
async function refreshWeather(request,key,ms=5000){
  const cache=await caches.open(LIVE),url=ORIGIN+'/gw-offline/weather'+key;
  const response=await readNetwork(request,ms);if(!response.ok)throw Error('weather');
  const data=await response.clone().json();if(!data.fetchedAt||!data.threeHour)throw Error('weather');
  const h=cleanHeaders(response);h.set('X-GW-Saved-At',new Date().toISOString());h.set('X-GW-Weather-Time',data.fetchedAt);
  const result=new Response(await response.arrayBuffer(),{status:200,headers:h});await cache.put(url,result.clone());return result;
}
// Observations are a saved snapshot for at most 24 hours. Forecast validity
// is separate: a tide/weather prediction can still cover a later time.
function weatherMeta(data){
  const stamp=Date.parse(data?.fetchedAt),age=Date.now()-stamp;
  const times=[],ends=[];
  function scan(value,list){if(!value||typeof value!=='object')return;for(const [key,item] of Object.entries(value)){if(typeof item==='string'&&/^(?:DateTime|EndTime|endTime)$/i.test(key)){const t=Date.parse(item);if(Number.isFinite(t))list.push(t);}else if(item&&typeof item==='object')scan(item,list);}}
  scan(data?.tides,times);scan(data?.threeHour,ends);scan(data?.fiveDay,ends);
  return {savedAt:data?.fetchedAt||null,expired:!Number.isFinite(stamp)||age>86400000||age< -300000,tideFrom:times.length?Math.min(...times):0,tideUntil:times.length?Math.max(...times):0,forecastUntil:ends.length?Math.max(...ends):0};
}
function weatherState(clientId,key,value){return remember(weatherStates,clientId+'|'+key,{key,...value});}
async function weather(request,key,event){
  const clientId=event?.clientId||'',cache=await caches.open(LIVE),url=ORIGIN+'/gw-offline/weather'+key,hit=await cache.match(url);
  const manualAt=manualWeatherClients.get(clientId)||0;
  if(manualAt&&Date.now()-manualAt<15000){
    let entry=weatherChecks.get(key);
    if(!entry?.manual||entry.at<manualAt){
      const task=(async()=>{try{const r=await refreshWeather(request,key,3500);return {body:await r.text(),headers:[...r.headers]};}catch{return {error:true};}})();
      entry={at:Date.now(),manual:true,task};remember(weatherChecks,key,entry);
    }
    const result=await entry.task;
    if(!result.error){const state=weatherState(clientId,key,{type:'GW_WEATHER_ONLINE',...weatherMeta(JSON.parse(result.body))});await tell(clientId,state);return new Response(result.body,{headers:result.headers});}
    if(!hit)throw Error('weather');
    const data=await hit.clone().json().catch(()=>({}));const savedAt=data.fetchedAt||hit.headers.get('X-GW-Saved-At');
    const state=weatherState(clientId,key,{type:'GW_WEATHER_OFFLINE',state:'unavailable',...weatherMeta(data)});await tell(clientId,state);
    const headers=cleanHeaders(hit);headers.set('X-GW-Offline','1');return new Response(await hit.arrayBuffer(),{headers});
  }
  if(!hit){const response=await refreshWeather(request,key);const state=weatherState(clientId,key,{type:'GW_WEATHER_ONLINE',...weatherMeta(await response.clone().json())});await tell(clientId,state);return response;}
  const data=await hit.clone().json().catch(()=>({}));
  const savedAt=data.fetchedAt||hit.headers.get('X-GW-Saved-At');
  const cached=weatherState(clientId,key,{type:'GW_WEATHER_CACHED',...weatherMeta(data),state:'checking'});
  await tell(clientId,cached);
  const baseline=await hit.clone().text();
  let entry=weatherChecks.get(key);
  if(!entry||Date.now()-entry.at>CHECK_INTERVAL){
    const task=(async()=>{try{
      const result=await refreshWeather(request,key);return {body:await result.text()};
    }catch{return {error:true};}})();
    entry={at:Date.now(),task};remember(weatherChecks,key,entry);
  }
  keep(event,entry.task.then(async result=>{
    const value=result.error?{type:'GW_WEATHER_OFFLINE',state:'unavailable'}:result.body===baseline?{type:'GW_WEATHER_CURRENT',state:'current'}:{type:'GW_WEATHER_READY',state:'updated'};
    const state=weatherState(clientId,key,{...value,...weatherMeta(data)});await tell(clientId,state);
  }));
  const h=cleanHeaders(hit);h.set('X-GW-Stored','1');h.set('X-GW-Offline','1');
  return new Response(await hit.arrayBuffer(),{headers:h});
}
async function navigation(request,event){
  const slug=pathOf(request.url),clientId=event?.resultingClientId||event?.clientId||'';
  const fresh=freshClients.delete(event?.replacesClientId||event?.clientId)||request.cache==='reload'||request.cache==='no-cache'||new URL(request.url).searchParams.has('offline-save');
  if(fresh){weatherChecks.delete('/api'+slug);if(clientId)remember(manualWeatherClients,clientId,Date.now());}
  const saved=await savedPage(slug);
  if(saved&&!fresh){keep(event,inspectPage(slug,clientId));return savedResponse(saved);}
  try{
    const r=await readNetwork(request,saved?3500:8000);
    if(r.ok||r.status<500)return r;throw Error('server');
  }catch{
    if(saved){remember(pageStates,slug,{type:'GW_PAGE_STATE',slug,state:'unavailable'});return savedResponse(saved,'unavailable');}
    return new Response(await hubHTML(),{status:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-GW-Offline':'1'}});
  }
}
async function hubHTML(){
  const rows=(await records()).map(r=>'<a href="'+r.slug+'">'+({longdong:'龍洞 Long Dong',defulan:'德芙蘭 Defulan',guanziling:'關子嶺 Guanziling',kenting:'墾丁 Kenting'})[r.slug.slice(1)]+'<small>'+new Date(r.savedAt).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',hour12:false})+'</small></a>').join('');
  return '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0b0d0e"><script>try{var m=localStorage.getItem("gw-app-color-theme-v1");document.documentElement.dataset.theme=(m==="light"||m!=="dark"&&matchMedia("(prefers-color-scheme:light)").matches)?"light":"dark"}catch(e){}</script><title>離線資料 · GO WILD</title><style>*{box-sizing:border-box}body{margin:0;background:#0b0d0e;color:#adadad;font:16px/1.72 system-ui,sans-serif;padding:calc(36px + env(safe-area-inset-top)) 7vw 36px}main{max-width:560px;margin:8vh auto}h1{font-size:22px;color:#e8e8e8}p{margin:20px 0;font-size:14px}a{display:block;border-top:1px solid #ffffff26;padding:18px 0;color:#e8e8e8;text-decoration:none}small{display:block;color:#999;font-size:12px}button{border:1px solid #ffffff33;border-radius:99px;background:#252729;color:#ddd;padding:10px 20px;font:inherit;font-size:14px;margin-top:24px}html[data-theme="light"] body{background:#f6f7f3;color:#555}html[data-theme="light"] :is(h1,a){color:#262626}html[data-theme="light"] a{border-color:#0002}html[data-theme="light"] button{background:#edf0eb;color:#262626;border-color:#0003}</style></head><body><main><p>GO WILD | 夠野戶外</p><h1>離線資料 / Offline library</h1><p>目前無法連線。請選擇已儲存的岩場；其他頁面、即時影像與 PDF 需要網路。<br>You are offline. Open a saved crag below. Other pages, live media and PDFs require a connection.</p>'+ (rows||'<p>尚未儲存岩場。請連線後開啟選單的「離線資料」。<br>No saved crags. Go online and choose Offline library in the menu.</p>')+'<button onclick="location.reload()">重新連線 / Retry</button></main></body></html>';
}
self.addEventListener('install',event=>{
  // Save the small loader bridge before activation, so old packs still open
  // with the new UI even when the next visit is offline. Never skipWaiting.
  event.waitUntil((async()=>{const name=PREFIX+'shell-'+RELEASE,cache=await caches.open(name);try{await Promise.all(['offline-v2.js','offline-v2.css','app-v10.js'].map(async file=>{const response=await readNetwork(new Request(CLIENT_BASE+file,{credentials:'omit',mode:'cors',cache:'reload'}),8000);if(!response.ok)throw Error('SHELL_UNAVAILABLE');await cache.put(CLIENT_BASE+file,response);}));}catch(error){await caches.delete(name);throw error;}})());
});
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keep=new Set((await records(true)).map(r=>r.cache));for(const name of await caches.keys())if(name.startsWith(PREFIX+'pack-')&&!keep.has(name)&&Number(name.split('-').at(-2))<Date.now()-86400000)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
  const r=event.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(r.mode==='navigate'&&u.origin===ORIGIN){event.respondWith(navigation(r,event));return;}
  const key=weatherPath(u);if(key){event.respondWith(weather(r,key,event));return;}
  if(assetAllowed(u.href))event.respondWith((async()=>await cachedAsset(r)||fetch(r))());
});
self.addEventListener('message',event=>{
  const source=event.source,data=event.data||{},port=event.ports?.[0];
  if(!source?.url||new URL(source.url).origin!==ORIGIN||!port)return;
  const reply=value=>port.postMessage(value);
  event.waitUntil((async()=>{try{
    if(data.type==='GW_PREPARE_RELOAD'){freshClients.add(source.id);reply({ok:true});return;}
    if(data.type==='GW_WEATHER_CHECK'){if(!CRAGS.includes(data.slug))throw Error('INVALID_CRAG');const url=/^(localhost|127\.0\.0\.1)$/.test(self.location.hostname)?ORIGIN+'/api'+data.slug:'https://cwa-weather.designchenme.workers.dev/api'+data.slug;await weather(new Request(url),'/api'+data.slug,{clientId:source.id,waitUntil:p=>event.waitUntil(p)});reply({ok:true});return;}
    if(data.type==='GW_PAGE_STATE'){reply({ok:true,page:pageStates.get(data.slug)||null,weather:weatherStates.get(source.id+'|/api'+data.slug)||null});return;}
    if(data.type==='GW_PAGE_CHECK'){reply({ok:true,page:await inspectPage(data.slug,source.id)});return;}
    if(data.type==='GW_STATUS'){packIndex=await records(true);reply({ok:true,release:RELEASE,packs:packIndex.filter(r=>r.slug!=='/'),home:packIndex.find(r=>r.slug==='/')||null});return;}
    if(data.type==='GW_ESTIMATE'){const estimate=await estimatePack(data.slug,Array.isArray(data.assets)?data.assets:[]);reply({ok:true,...estimate});return;}
    if(data.type==='GW_SAVE'){const result=await savePack(data.slug,Array.isArray(data.assets)?data.assets:[],p=>reply({progress:p}));reply({ok:true,pack:result});return;}
    if(data.type==='GW_REMOVE'){if(!SAVED_PAGES.includes(data.slug))throw Error('INVALID_CRAG');if(saving)throw Error('BUSY');const r=await record(data.slug);if(r)await caches.delete(r.cache);await(await caches.open(META)).delete(metaURL(data.slug));packIndex=null;reply({ok:true});return;}
    if(data.type==='GW_CHECK'){const results=[];for(const r of await records(true)){try{results.push(await checkPack(r));}catch{results.push({slug:r.slug,error:true});}}reply({ok:true,results});return;}
    if(data.type==='GW_SKIP_WAITING'){reply({ok:true});await self.skipWaiting();return;}
    reply({ok:false,error:'UNKNOWN_REQUEST'});
  }catch(error){reply({ok:false,error:['BUSY','PAGE_UNAVAILABLE','PAGE_NOT_READY','PACK_TOO_LARGE','ASSET_UNAVAILABLE','INVALID_CRAG'].includes(error.message)?error.message:error.name==='QuotaExceededError'?'STORAGE_FULL':'SAVE_FAILED'});}})());
});
