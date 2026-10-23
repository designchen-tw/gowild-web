/* GO WILD offline v1. Only explicitly saved public crags; no forms, PDFs or live media. */
'use strict';
const RELEASE = '2026.10.24.1';
const PREFIX = 'gw-offline-v1-', META = PREFIX+'meta', LIVE = PREFIX+'weather';
const CRAGS = ['/longdong','/defulan','/guanziling','/kenting'];
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
async function records(){const result=[];for(const slug of CRAGS){let r=await record(slug);if(r){const exists=await caches.has(r.cache);const count=exists?(await(await caches.open(r.cache)).keys()).length:0;if(!exists||count!==r.files){await(await caches.open(META)).delete(metaURL(slug));if(exists)await caches.delete(r.cache);r=null;}}if(r)result.push(r);}return result;}
async function notify(data){for(const client of await self.clients.matchAll({type:'window',includeUncontrolled:true}))client.postMessage(data);}
async function digest(text){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
function fingerprint(html){return digest(html.replace(/\snonce=(?:"[^"]*"|'[^']*')/gi,'').replace(/<script\b[^>]*src=["'][^"']*(?:cloudflareinsights|cdn-cgi\/scripts)[^"']*["'][^>]*>[\s\S]*?<\/script>/gi,''));}
async function network(request,ms=12000){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),ms);try{return await fetch(request,{signal:controller.signal});}finally{clearTimeout(timer);}}
async function fetchPage(slug){const r=await network(new Request(ORIGIN+slug,{credentials:'omit',cache:'no-store',headers:{Accept:'text/html'}}));if(!r.ok||!r.headers.get('Content-Type')?.includes('text/html')||/private|no-store/i.test(r.headers.get('Cache-Control')||'')||new URL(r.url||ORIGIN+slug).origin!==ORIGIN)throw Error('PAGE_UNAVAILABLE');const html=await r.text();if(!/<main\b/i.test(html)||/cf-chl-|Just a moment\.\.\./.test(html))throw Error('PAGE_UNAVAILABLE');return{html,headers:r.headers,hash:await fingerprint(html)};}
function cssDependencies(css,base){const urls=[];for(const m of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)){const u=new URL(m[1],base);if(/\.(?:woff2?|ttf|otf|css)$/i.test(u.pathname))urls.push(u.href);}for(const m of css.matchAll(/@import\s+["']([^"']+)["']/gi))urls.push(new URL(m[1],base).href);return urls;}
async function savePack(slug,assets,progress){
  if(!CRAGS.includes(slug))throw Error('INVALID_CRAG');
  if(saving)throw Error('BUSY');saving=true;
  const name=PREFIX+'pack-'+slug.slice(1)+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),cache=await caches.open(name);
  try{
    const page=await fetchPage(slug),queue=[...new Set(assets.filter(assetAllowed).map(u=>new URL(u,ORIGIN).href))];
    if(!queue.some(x=>/\.js(?:\?|$)/.test(x))||!queue.some(x=>/\.css(?:\?|$)/.test(x)))throw Error('PAGE_NOT_READY');
    let bytes=new TextEncoder().encode(page.html).length,done=0;const seen=new Set(queue);
    // Explicit downloads only; three concurrent requests avoid saturating mobile networks.
    async function take(){while(queue.length){if(seen.size>LIMIT_FILES)throw Error('PACK_TOO_LARGE');const address=queue.shift();const r=await network(new Request(address,{mode:'cors',credentials:'omit',cache:'reload'}));if(!r.ok||r.type==='opaque')throw Error('ASSET_UNAVAILABLE');const body=await r.arrayBuffer();bytes+=body.byteLength;if(bytes>LIMIT_BYTES)throw Error('PACK_TOO_LARGE');const headers=new Headers(r.headers);headers.delete('content-encoding');headers.delete('content-length');await cache.put(address,new Response(body,{status:200,headers}));if(/\.css(?:\?|$)/i.test(address)){for(const child of cssDependencies(new TextDecoder().decode(body),address)){if(assetAllowed(child)&&!seen.has(child)){seen.add(child);queue.push(child);}}}done++;progress({done,total:seen.size,bytes});}}
    // Do not delete a failed staging cache while another request is still writing to it.
    const settled=await Promise.allSettled([take(),take(),take()]);const error=settled.find(x=>x.status==='rejected');if(error)throw error.reason;
    const headers=new Headers(page.headers);headers.delete('content-encoding');headers.delete('content-length');await cache.put(ORIGIN+slug,new Response(page.html,{headers}));
    const old=await record(slug),next={slug,cache:name,savedAt:new Date().toISOString(),hash:page.hash,bytes,files:done+1,release:RELEASE};
    await store(slug,next);packIndex=null;if(old&&old.cache!==name){try{await caches.delete(old.cache);}catch{}}return next;
  }catch(error){await caches.delete(name);throw error;}finally{saving=false;}
}
async function cachedAsset(request){if(!packIndex)packIndex=await records();for(const r of packIndex){const hit=await(await caches.open(r.cache)).match(request,{ignoreVary:true});if(hit)return hit;}return null;}
async function weather(request,key){
  const cache=await caches.open(LIVE),url=ORIGIN+'/gw-offline/weather'+key;
  try{const r=await network(request,7000);if(!r.ok)throw Error('weather');const data=await r.clone().json();if(!data.fetchedAt||!data.threeHour)throw Error('weather');const headers=new Headers(r.headers);headers.set('X-GW-Saved-At',new Date().toISOString());const response=new Response(await r.arrayBuffer(),{status:200,headers});await cache.put(url,response.clone());await notify({type:'GW_WEATHER_ONLINE',key});return response;
  }catch(error){const hit=await cache.match(url);if(!hit)throw error;const headers=new Headers(hit.headers);headers.set('X-GW-Offline','1');await notify({type:'GW_WEATHER_OFFLINE',key,savedAt:headers.get('X-GW-Saved-At')});return new Response(await hit.arrayBuffer(),{headers});}
}
function offlineHTML(html,data){const safe=JSON.stringify(data).replace(/</g,'\\u003c');const script='<script>document.documentElement.setAttribute("data-gw-offline","true");window.GWOfflineDocument='+safe+';</script>';return html.replace(/<head\b[^>]*>/i,m=>m+script);}
async function navigation(request){
  const slug=pathOf(request.url);
  try{const r=await network(request,8000);if(r.ok)return r;if(r.status<500)return r;throw Error('server');}
  catch(error){
    const data=CRAGS.includes(slug)?await record(slug):null;
    if(data&&await caches.has(data.cache)){const hit=await(await caches.open(data.cache)).match(ORIGIN+slug);if(hit){const headers=new Headers(hit.headers);['content-length','content-encoding','etag'].forEach(x=>headers.delete(x));headers.set('X-GW-Offline','1');return new Response(offlineHTML(await hit.text(),{slug,savedAt:data.savedAt}),{headers});}}
    return new Response(await hubHTML(),{status:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-GW-Offline':'1'}});
  }
}
async function hubHTML(){
  const rows=(await records()).map(r=>'<a href="'+r.slug+'">'+({longdong:'龍洞 Long Dong',defulan:'德芙蘭 Defulan',guanziling:'關子嶺 Guanziling',kenting:'墾丁 Kenting'})[r.slug.slice(1)]+'<small>'+new Date(r.savedAt).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',hour12:false})+'</small></a>').join('');
  return '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0b0d0e"><script>try{var m=localStorage.getItem("gw-app-color-theme-v1");document.documentElement.dataset.theme=(m==="light"||m!=="dark"&&matchMedia("(prefers-color-scheme:light)").matches)?"light":"dark"}catch(e){}</script><title>離線資料 · GO WILD</title><style>*{box-sizing:border-box}body{margin:0;background:#0b0d0e;color:#adadad;font:16px/1.72 system-ui,sans-serif;padding:calc(36px + env(safe-area-inset-top)) 7vw 36px}main{max-width:560px;margin:8vh auto}h1{font-size:22px;color:#e8e8e8}p{margin:20px 0;font-size:14px}a{display:block;border-top:1px solid #ffffff26;padding:18px 0;color:#e8e8e8;text-decoration:none}small{display:block;color:#999;font-size:12px}button{border:1px solid #ffffff33;border-radius:99px;background:#252729;color:#ddd;padding:10px 20px;font:inherit;font-size:14px;margin-top:24px}html[data-theme="light"] body{background:#f6f7f3;color:#555}html[data-theme="light"] :is(h1,a){color:#262626}html[data-theme="light"] a{border-color:#0002}html[data-theme="light"] button{background:#edf0eb;color:#262626;border-color:#0003}</style></head><body><main><p>GO WILD | 夠野戶外</p><h1>離線資料 / Offline library</h1><p>目前無法連線。請選擇已儲存的岩場；其他頁面、即時影像與 PDF 需要網路。<br>You are offline. Open a saved crag below. Other pages, live media and PDFs require a connection.</p>'+ (rows||'<p>尚未儲存岩場。請連線後開啟選單的「離線資料」。<br>No saved crags. Go online and choose Offline library in the menu.</p>')+'<button onclick="location.reload()">重新連線 / Retry</button></main></body></html>';
}
self.addEventListener('install',event=>{ /* First installation activates normally; updates wait for user approval. */ });
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keep=new Set((await records()).map(r=>r.cache));for(const name of await caches.keys())if(name.startsWith(PREFIX+'pack-')&&!keep.has(name)&&Number(name.split('-').at(-2))<Date.now()-86400000)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
  const r=event.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(r.mode==='navigate'&&u.origin===ORIGIN){event.respondWith(navigation(r));return;}
  const key=weatherPath(u);if(key){event.respondWith(weather(r,key));return;}
  if(assetAllowed(u.href))event.respondWith((async()=>await cachedAsset(r)||fetch(r))());
});
self.addEventListener('message',event=>{
  const source=event.source,data=event.data||{},port=event.ports?.[0];
  if(!source?.url||new URL(source.url).origin!==ORIGIN||!port)return;
  const reply=value=>port.postMessage(value);
  event.waitUntil((async()=>{try{
    if(data.type==='GW_STATUS'){packIndex=await records();reply({ok:true,release:RELEASE,packs:packIndex});return;}
    if(data.type==='GW_SAVE'){const result=await savePack(data.slug,Array.isArray(data.assets)?data.assets:[],p=>reply({progress:p}));reply({ok:true,pack:result});return;}
    if(data.type==='GW_REMOVE'){if(!CRAGS.includes(data.slug))throw Error('INVALID_CRAG');if(saving)throw Error('BUSY');const r=await record(data.slug);if(r)await caches.delete(r.cache);await(await caches.open(META)).delete(metaURL(data.slug));packIndex=null;reply({ok:true});return;}
    if(data.type==='GW_CHECK'){const results=[];for(const r of await records()){try{const p=await fetchPage(r.slug);results.push({slug:r.slug,changed:p.hash!==r.hash,checkedAt:new Date().toISOString()});}catch{results.push({slug:r.slug,error:true});}}reply({ok:true,results});return;}
    if(data.type==='GW_SKIP_WAITING'){reply({ok:true});await self.skipWaiting();return;}
    reply({ok:false,error:'UNKNOWN_REQUEST'});
  }catch(error){reply({ok:false,error:['BUSY','PAGE_UNAVAILABLE','PAGE_NOT_READY','PACK_TOO_LARGE','ASSET_UNAVAILABLE','INVALID_CRAG'].includes(error.message)?error.message:error.name==='QuotaExceededError'?'STORAGE_FULL':'SAVE_FAILED'});}})());
});
