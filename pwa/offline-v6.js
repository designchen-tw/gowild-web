/* GO WILD offline library. Loaded after the existing App footer; no navigation replacement. */
(function(){
'use strict';if(window.GWOffline)return;
const root=document.documentElement,local=/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const crags=[['/longdong','龍洞','Long Dong'],['/defulan','德芙蘭','Defulan'],['/guanziling','關子嶺','Guanziling'],['/kenting','墾丁','Kenting']];
const slug=location.pathname.replace(/\/$/,'')||'/';
const installedApp=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||local&&root.hasAttribute('data-gw-app-test');

let activeRelease='',registration=null,dialog=null,entry=null,packs=[],home=null,sizes={},downloadPercent=null,checks={},busy=false,error='',progress='',checking=false,estimating=false,waiting=false,applying=false,lastCheck=0,previousFocus=null,restoringSave=false;
const en=()=>root.getAttribute('data-gw-app-language')==='en'||document.querySelector('main[data-language="en"],main[lang="en"],#outside-of-rock[lang="en"]')!==null;
const t=(zh,english)=>en()?english:zh;
const time=value=>new Date(value).toLocaleString(en()?'en-GB':'zh-TW',{timeZone:'Asia/Taipei',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});
function mb(bytes){return Math.max(.1,bytes/1048576).toFixed(1)+' MB';}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const downloadIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5"/></svg>';
function rpc(type,detail={},worker=registration?.active,onProgress){return new Promise((resolve,reject)=>{if(!worker){reject(Error('NOT_READY'));return;}const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(Error('TIMEOUT'));},type==='GW_SAVE'?180000:45000);channel.port1.onmessage=event=>{if(event.data.progress){onProgress?.(event.data.progress);return;}clearTimeout(timer);channel.port1.close();event.data.ok?resolve(event.data):reject(Object.assign(Error(event.data.error||'FAILED'),{asset:event.data.asset}));};worker.postMessage({type,...detail},[channel.port2]);});}
async function setup(){
  if(registration)return registration;
  if(!('serviceWorker'in navigator)||!isSecureContext)throw Error('UNSUPPORTED');
  registration=await navigator.serviceWorker.register('/gw-offline/sw.js',{scope:'/',updateViaCache:'none'});
  const ready=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('NOT_READY')),15000))]);
  registration=ready;waiting=!!registration.waiting;
  const watch=worker=>worker?.addEventListener('statechange',()=>{if(worker.state==='installed'||worker.state==='redundant')setTimeout(()=>{waiting=!!registration.waiting;render();},0);});
  registration.addEventListener('updatefound',()=>watch(registration.installing));watch(registration.installing);
  window.GWAppUpdater?.refresh();
  await status();await restoreLoadState();return registration;
}
async function status(){if(!registration?.active)return;const result=await rpc('GW_STATUS');packs=result.packs||[];home=result.home||null;activeRelease=result.release||'';render();}
function friendly(code){return ({UNSUPPORTED:t('此瀏覽器不支援離線儲存。','Offline storage is unavailable in this browser.'),PAGE_NOT_READY:t('地圖仍在載入，請稍後再試。','The map is still loading. Please try again shortly.'),PAGE_UNAVAILABLE:t('無法取得頁面，請確認連線後再試。','The page could not be downloaded. Check your connection.'),ASSET_UNAVAILABLE:t('部分圖片或程式未能下載；原有離線資料仍保留。','Some assets could not be downloaded. Your previous copy is preserved.'),PACK_TOO_LARGE:t('資料超過單一岩場的儲存上限。','This crag exceeds the download limit.'),STORAGE_FULL:t('裝置空間不足；請移除不需要的離線岩場。','Storage is full. Remove an offline crag to free space.'),BUSY:t('另一個儲存工作正在進行，請稍後再試。','Another download is in progress. Try again shortly.'),TIMEOUT:t('下載逾時；請保持頁面開啟並確認連線。','Download timed out. Keep this page open and check your connection.')}[code])||t('離線功能暫時無法啟用，請連線後再試。','Offline storage is not ready. Connect and try again.');}
function render(){
 window.GWAppUpdater?.refresh();
 if(!dialog?.open)return;
 const list=dialog.querySelector('[data-offline-list]');
 dialog.querySelector('h2').textContent=t('離線資料','Offline library');
 dialog.querySelector('[data-offline-intro]').textContent=t('選擇岩場儲存。首次下載會一併儲存首頁與選單，方便離線切換。下載量為預估值；已儲存顯示裝置使用空間。','Save individual crags. The first download includes the shared homepage and menu for offline navigation. Download sizes are estimates; saved sizes show device storage use.');
 const common=dialog.querySelector('[data-offline-home]');common.innerHTML='<p>'+esc(home?t('首頁與選單 · 已儲存 ','Homepage & menu · Saved ')+mb(home.bytes):t('共用首頁與選單 · ','Shared homepage & menu · ')+(sizes['/']?t('預估約 ','About ')+mb(sizes['/']):sizes['/']===false?t('容量暫時無法估算','Size estimate unavailable'):t('正在估算容量…','Estimating size…')))+(checks['/']?.changed?' · '+esc(t('有新內容','New content')):'')+'</p><button type="button" class="gw-offline-text" data-offline-home-save '+(busy||root.getAttribute('data-gw-offline')==='true'?'disabled':'')+'>'+esc(home?t('更新首頁與選單','Update homepage & menu'):t('只儲存首頁與選單','Save homepage & menu only'))+'</button>'+(home?'<button type="button" class="gw-offline-text" data-offline-remove="/" '+(busy?'disabled':'')+'>'+esc(t('移除','Remove'))+'</button>':'');
 list.innerHTML=crags.map(([path,zh,eng])=>{const saved=packs.find(p=>p.slug===path),check=checks[path],current=path===slug;return '<li><div><h3>'+esc(en()?eng:zh)+'</h3><p>'+esc(saved?t('已儲存 ','Saved ')+time(saved.savedAt)+' · '+mb(saved.bytes):t('尚未儲存','Not saved'))+'</p><p>'+esc(sizes[path]?t('預估下載約 ','Estimated download ')+mb(sizes[path]+(!home||checks['/']?.changed?sizes['/']||0:0))+(!home||checks['/']?.changed?t('（含共用首頁）',' (includes homepage)'):''):root.getAttribute('data-gw-offline')==='true'?t('連網後可估算下載量','Connect to estimate download size'):sizes[path]===false?t('容量暫時無法估算','Size estimate unavailable'):t('正在估算容量…','Estimating size…'))+'</p>'+(check?'<p>'+esc(check.error?t('無法檢查更新','Update check failed'):check.changed?t('有新內容可儲存','New content available'):t('已核對，內容未變更','Checked; content unchanged'))+'</p>':'')+'</div><div class="gw-offline-actions">'+(current?'<button type="button" data-offline-save="'+path+'" '+(busy||root.getAttribute('data-gw-offline')==='true'?'disabled':'')+'>'+esc(saved?t('更新','Update'):t('儲存','Save'))+'</button>':'<a href="'+path+'?offline-save=1">'+esc(saved?t('開啟／更新','Open / update'):t('前往儲存','Open to save'))+'</a>')+(saved?'<button type="button" data-offline-remove="'+path+'" class="gw-offline-text" '+(busy?'disabled':'')+'>'+esc(t('移除','Remove'))+'</button>':'')+'</div></li>';}).join('');
 dialog.querySelector('[data-offline-status]').textContent=progress||error;
 const meter=dialog.querySelector('[data-offline-progress]');meter.hidden=downloadPercent===null;meter.value=downloadPercent||0;meter.setAttribute('aria-label',t('下載進度','Download progress'));
 const checkButton=dialog.querySelector('[data-offline-check]');checkButton.textContent=checking?t('正在檢查…','Checking…'):t('檢查內容更新','Check content updates');checkButton.disabled=busy||checking||root.getAttribute('data-gw-offline')==='true';

 dialog.querySelector('[data-offline-note]').textContent=t('天氣只保留最後取得的資料與時間。即時影像、Windy、PDF、外部連結與表單送出需要網路。裝置可能清除儲存資料，出發前請再確認。','Weather retains only the last received data and timestamp. Live cameras, Windy, PDFs, external links and form submission require a connection. Your device may clear stored data; check before departure.');
 dialog.querySelector('[data-offline-version]').textContent=t('離線功能版本 ','Offline feature version ')+(activeRelease||t('確認中…','Checking…'));
 dialog.querySelector('[data-offline-close]').setAttribute('aria-label',t('關閉','Close'));
}
function close(){dialog?.close();previousFocus?.focus({preventScroll:true});}
async function show(){
 if(!dialog){dialog=document.createElement('dialog');dialog.className='gw-app-install-dialog gw-offline-dialog';dialog.setAttribute('aria-labelledby','gw-offline-title');dialog.innerHTML='<button type="button" class="gw-app-install-close" data-offline-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><h2 id="gw-offline-title" tabindex="-1"></h2><p data-offline-intro></p><div data-offline-home></div><ul data-offline-list></ul><progress data-offline-progress max="100" hidden></progress><p data-offline-status role="status" aria-live="polite"></p><div class="gw-offline-tools"><button type="button" class="gw-offline-text" data-offline-check></button></div><p class="gw-app-install-note" data-offline-note></p><small data-offline-version></small>';
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});dialog.addEventListener('click',async event=>{if(busy&&event.target.closest('a')){event.preventDefault();return;}const button=event.target.closest('button');if(!button)return;if(button.hasAttribute('data-offline-close'))close();if(button.dataset.offlineSave)save();if(button.hasAttribute('data-offline-home-save'))save('/');if(button.dataset.offlineRemove){try{await rpc('GW_REMOVE',{slug:button.dataset.offlineRemove});delete checks[button.dataset.offlineRemove];await status();}catch(e){error=friendly(e.message);render();}}if(button.hasAttribute('data-offline-check'))check();});document.body.appendChild(dialog);}
 previousFocus=document.activeElement;if(!dialog.open)dialog.showModal();render();dialog.querySelector('h2').focus({preventScroll:true});
 try{await setup();estimateSizes();}catch(e){error=friendly(e.message);render();}
}
async function estimateSizes(){
 if(estimating||root.getAttribute('data-gw-offline')==='true')return;estimating=true;
 try{for(const path of ['/',...crags.map(row=>row[0])]){if(!dialog?.open)break;if(sizes[path])continue;try{const result=await rpc('GW_ESTIMATE',{slug:path,assets:path===slug?assets():[]});sizes[path]=result.bytes;}catch{sizes[path]=false;}render();}}finally{estimating=false;}
}
function assets(){
 const urls=new Set();function add(value){if(!value)return;try{const u=new URL(value,location.href);if(['http:','https:'].includes(u.protocol))urls.add(u.href);}catch{}}
 document.querySelectorAll('script[src],link[rel="stylesheet"],link[rel="icon"],link[rel="apple-touch-icon"],img,source').forEach(node=>{add(node.src||node.href);add(node.currentSrc);const srcset=node.getAttribute('srcset');if(srcset)srcset.split(',').forEach(part=>add(part.trim().split(/\s+/)[0]));});
 performance.getEntriesByType('resource').forEach(item=>{if(['script','css','link','img'].includes(item.initiatorType))add(item.name);});
 for(const node of document.querySelectorAll('main *,[data-ld-detail] *,[data-kd-detail] *,[data-df-detail] *,[data-gz-detail] *,.navigation.gw *,.mobile-overlay.gw *,.block-for-copyright.gw *')){for(const prop of ['backgroundImage','maskImage'])for(const m of getComputedStyle(node)[prop]?.matchAll(/url\(["']?([^"')]+)["']?\)/g)||[])add(m[1]);}
 return [...urls];
}
async function mapReady(){const prefix=({'/longdong':'ld','/defulan':'df','/kenting':'kd','/guanziling':'gz'})[slug];for(let i=0;i<50;i++){if(document.querySelector('.'+prefix+'-map-svg')&&[...document.querySelectorAll('link[rel="stylesheet"]')].every(l=>l.sheet))return;await new Promise(r=>setTimeout(r,200));}throw Error('PAGE_NOT_READY');}
async function save(target=slug){
 if(busy||target!=='/'&&!crags.some(row=>row[0]===target))return;
 if(target===slug&&(checks[target]?.changed||storedDocument)){if(restoringSave){restoringSave=false;error=friendly('PAGE_UNAVAILABLE');render();return;}if(window.GWApp?.hasUnsavedForm?.()){error=t('請先處理尚未送出的表單，再重新載入更新。','Please finish your unsent form before reloading.');render();return;}sessionStorage.setItem('gw-offline-save-after-load',slug);reloadFresh();return;}
 busy=true;downloadPercent=0;error='';progress=t('準備儲存…請保持頁面開啟。','Preparing download… Keep this page open.');render();
 try{await setup();if(target!=='/')await mapReady();await rpc('GW_SAVE',{slug:target,assets:target===slug?assets():[]},registration.active,p=>{downloadPercent=p.percent??0;progress=t('正在下載 ','Downloading ')+downloadPercent+'% · '+mb(p.bytes);const line=dialog?.querySelector('[data-offline-status]');if(line)line.textContent=progress;const meter=dialog?.querySelector('[data-offline-progress]');if(meter){meter.hidden=false;meter.value=downloadPercent;}});downloadPercent=100;progress=t('已完成，可離線閱讀。','Saved. Ready for offline reading.');delete checks[target];delete checks['/'];await status();try{await navigator.storage?.persist?.();}catch{} }
 catch(e){downloadPercent=null;error=friendly(e.message)+(e.asset?' · '+e.asset.split('/').pop():'');progress='';}finally{busy=false;render();}
}
async function check(){if(!registration||busy||checking)return;checking=true;error='';progress='';render();try{const result=await rpc('GW_CHECK');for(const row of result.results)checks[row.slug]=row;}catch(e){error=friendly(e.message);}finally{checking=false;render();}}
let reloadOnChange=false,weatherSavedAt=null,weatherFallback=false,weatherPhase='checking',pagePhase=window.GWStoredDocument?.state||'checking',lastResume=0,expiryTimer=null,weatherMetaInfo={};
const storedDocument=window.GWStoredDocument||window.GWOfflineDocument||null;
navigator.serviceWorker?.addEventListener('controllerchange',()=>{waiting=!!registration?.waiting;render();});
function publishWeather(key,data){
 if(!data?.fetchedAt||!data.threeHour)return;
 const entries=window.GWWeatherLatest||(window.GWWeatherLatest=new Map()),prior=entries.get(key);
 if(prior&&Date.parse(prior.fetchedAt)>=Date.parse(data.fetchedAt))return;
 entries.set(key,data);
 document.dispatchEvent(new CustomEvent('gw-weather-data',{detail:{key,data}}));
}
function receiveState(data){
 if(data?.key!=='/api'+slug)return;
 weatherMetaInfo=data;weatherSavedAt=data.savedAt||null;
 if(['GW_WEATHER_ONLINE','GW_WEATHER_UPDATE'].includes(data.type)){
   weatherFallback=false;weatherPhase='online';if(data.data)publishWeather(data.key,data.data);connectivity();return;
 }
 if(['GW_WEATHER_OFFLINE','GW_WEATHER_CACHED','GW_WEATHER_READY','GW_WEATHER_CURRENT'].includes(data.type)){
   weatherFallback=true;weatherPhase=data.state==='checking'?'loading':data.state||'unavailable';connectivity();
 }
}
navigator.serviceWorker?.addEventListener('message',event=>receiveState(event.data));
async function restoreLoadState(){
 try{const result=await rpc('GW_PAGE_STATE',{slug});receiveState(result.weather);}catch{}
}
async function prepareReload(){
 // An explicit reload bypasses stored HTML once, including App toolbar reloads.
 if(!navigator.serviceWorker?.controller)return;
 try{await Promise.race([rpc('GW_PREPARE_RELOAD',{},navigator.serviceWorker.controller),new Promise(resolve=>setTimeout(resolve,1200))]);}catch{}
}
function reloadFresh(){if(window.GWApp?.reload){window.GWApp.reload();return;}if(document.querySelector('form input:not([type="hidden"]):not([type="submit"]),form textarea')&&window.GWApp?.hasUnsavedForm?.())return;prepareReload().finally(()=>location.reload());}
function makeReloadButton(){const button=document.createElement('button');button.type='button';button.className='gw-offline-reload-text';button.setAttribute('data-offline-fresh-reload','');button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 5v6h-6M20 11a8 8 0 1 0-1.5 6"/></svg><span></span>';button.querySelector('span').textContent=t('重新整理','Refresh');button.addEventListener('click',reloadFresh);return button;}
function expiredWeather(){const stamp=Date.parse(weatherSavedAt),age=Date.now()-stamp;return !!weatherSavedAt&&(!Number.isFinite(stamp)||age>86400000||age< -300000);}
function expiryDisplay(){
 const expired=weatherFallback&&expiredWeather();
 document.querySelectorAll('.ld-condition-grid>article:not(.ld-condition-tide),.gw-condition-grid>article').forEach(card=>{card.toggleAttribute('data-gw-observation-expired',expired);let label=card.querySelector(':scope>.gw-offline-expired-value');if(expired){if(!label){label=document.createElement('span');label.className='gw-offline-expired-value';card.appendChild(label);}label.textContent=t('資料已過期','Data expired');}else label?.remove();});
 const tideExpired=weatherFallback&&!!weatherSavedAt&&(!weatherMetaInfo.tideUntil||Date.now()>weatherMetaInfo.tideUntil||Date.now()<weatherMetaInfo.tideFrom);
 document.querySelectorAll('.ld-condition-tide').forEach(card=>{card.toggleAttribute('data-gw-observation-expired',tideExpired);let label=card.querySelector(':scope>.gw-offline-expired-value');if(tideExpired){if(!label){label=document.createElement('span');label.className='gw-offline-expired-value';card.appendChild(label);}label.textContent=t('預報未涵蓋目前時段','Forecast does not cover this time');}else label?.remove();});
 clearTimeout(expiryTimer);const deadlines=[Date.parse(weatherSavedAt)+86400001,weatherMetaInfo.tideUntil,weatherMetaInfo.forecastUntil].filter(value=>Number.isFinite(value)&&value>Date.now());if(deadlines.length)expiryTimer=setTimeout(connectivity,Math.min(...deadlines)-Date.now()+10);
}
function weatherNotice(value){
 const expired=expiredWeather(),offline=navigator.onLine===false;
 const loading=weatherPhase==='loading'&&!offline;
 const text=expired?(offline?t('氣象資料已過期，等待網路連線','Weather data expired. Waiting for a connection'):loading?t('氣象資料已過期，正在嘗試更新','Weather data expired. Trying to update'):t('氣象資料已過期，暫時無法更新','Weather data expired. Unable to update')):(offline?t('離線資料','Offline data'):t('暫用上次氣象資料','Showing saved weather data'));
 document.querySelectorAll('.ld-condition-panel,.gw-condition-panel,[data-cwa-widget]').forEach(panel=>{let note=panel.querySelector(':scope>[data-offline-weather-note]');if(!note){note=document.createElement('p');note.setAttribute('data-offline-weather-note','');note.className='gw-offline-notice';panel.prepend(note);}note.dataset.savedAt=value||'';
 note.textContent=text+(value?' · '+time(value):'')+(!expired&&loading?t(' · 正在更新',' · Updating'):'');
 if(!loading&&!offline)note.appendChild(makeReloadButton());});
}
function connectivity(){
 const offline=navigator.onLine===false;const offlineValue=String(offline);if(root.getAttribute('data-gw-offline')!==offlineValue)root.setAttribute('data-gw-offline',offlineValue);
 let note=document.querySelector('[data-offline-page-note]'),wrap=document.querySelector('[data-offline-page-wrap]');const main=document.querySelector('main');
 const showPage=!!storedDocument||offline;
 if(!note&&main&&showPage){wrap=document.createElement('div');wrap.className='gw-offline-page-wrap';wrap.setAttribute('data-offline-page-wrap','');note=document.createElement('p');note.className='gw-offline-notice';note.setAttribute('data-offline-page-note','');note.setAttribute('role','status');wrap.appendChild(note);main.prepend(wrap);}
 if(note){note.hidden=!showPage;if(wrap)wrap.hidden=!showPage;
 note.textContent=(offline||['offline','unavailable'].includes(storedDocument?.state))?t('因為沒有網路，此頁暫用已儲存版本','Because there is no connection, this page is using a saved version'):t('因為網路較慢，此頁暫用已儲存版本','Because the connection is slow, this page is using a saved version');
 if(storedDocument?.savedAt)note.appendChild(document.createTextNode(' · '+t('儲存於 ','Saved ')+time(storedDocument.savedAt)));
 if(!offline)note.appendChild(makeReloadButton());}
 expiryDisplay();
 if(weatherFallback)weatherNotice(weatherSavedAt);else document.querySelectorAll('[data-offline-weather-note]').forEach(node=>node.remove());
 document.querySelectorAll('iframe').forEach(frame=>{if(!/windy|youtube|168\.motc|thb\.gov|cctv|acrobat|documentcloud/i.test(frame.src))return;let placeholder=frame.parentElement.querySelector(':scope>.gw-offline-media');if(!placeholder){placeholder=document.createElement('div');placeholder.className='gw-offline-media';frame.insertAdjacentElement('beforebegin',placeholder);}placeholder.textContent=t('此內容需網路連線','This content requires a connection');placeholder.hidden=!offline;});
 document.querySelectorAll('img[src*="thb.gov.tw"],img[src*="cctv"],img[src*="168.motc"]').forEach(image=>{let placeholder=image.parentElement.querySelector(':scope>.gw-offline-camera');if(!placeholder){placeholder=document.createElement('div');placeholder.className='gw-offline-camera';image.insertAdjacentElement('beforebegin',placeholder);}placeholder.textContent=t('即時影像需網路連線','Live camera requires a connection');placeholder.hidden=!offline;image.toggleAttribute('data-offline-camera-hidden',offline);});
 if(entry)entry.querySelector('span').textContent=t('離線資料','Offline library');render();
}
async function resume(){
 if(document.visibilityState==='hidden')return;
 connectivity();
 if(navigator.onLine&&registration&&weatherFallback&&Date.now()-lastResume>60000){lastResume=Date.now();rpc('GW_WEATHER_CHECK',{slug}).catch(()=>{});}
 if(!navigator.onLine||!registration||Date.now()-lastCheck<3600000)return;lastCheck=Date.now();try{await registration.update();waiting=!!registration.waiting;render();}catch{}
}
function init(){
 const panel=document.querySelector('.gw-menu-panel');if(panel){entry=document.createElement('button');entry.type='button';entry.className='gw-app-install-entry gw-offline-entry';entry.innerHTML=downloadIcon+'<span></span>';entry.addEventListener('click',show);panel.appendChild(entry);}
 document.addEventListener('click',event=>{if(root.getAttribute('data-gw-offline')!=='true')return;const a=event.target.closest('a[href]');if(!a||a.hasAttribute('download'))return;let url;try{url=new URL(a.href,location.href);}catch{return;}if(!['https:','http:'].includes(url.protocol))return;const path=url.pathname.replace(/\/$/,'')||'/';if(url.origin===location.origin&&(path===slug||path==='/gw-offline/update'&&registration?.waiting||path==='/'&&home||packs.some(p=>p.slug===path)))return;event.preventDefault();alert(t('此頁面尚未儲存，請連網後開啟。','This page is not saved. Connect to the internet to open it.'));},true);
 root.addEventListener('gw-language-change',connectivity);
 new MutationObserver(connectivity).observe(root,{attributes:true,attributeFilter:['data-gw-app-language']});
 const main=document.querySelector('main[data-language]');if(main)new MutationObserver(connectivity).observe(main,{attributes:true,attributeFilter:['data-language']});
 document.addEventListener('submit',event=>{if(root.getAttribute('data-gw-offline')==='true'){event.preventDefault();event.stopImmediatePropagation();alert(t('目前離線，表單尚未送出。請保持此頁，恢復連線後再送出。','You are offline. Your form was not sent. Keep this page open and submit after reconnecting.'));}},true);
 window.addEventListener('offline',()=>{weatherPhase='offline';if(weatherSavedAt)weatherFallback=true;connectivity();});
 window.addEventListener('online',()=>{resume();connectivity();if(registration&&weatherFallback)rpc('GW_WEATHER_CHECK',{slug}).catch(()=>{});});
 window.addEventListener('pageshow',()=>{resume();connectivity();if(registration)restoreLoadState();});document.addEventListener('visibilitychange',resume);
 connectivity();
 const live=document.querySelector('[id$="-live-weather"]');if(live)new MutationObserver(rows=>{if(rows.some(row=>!row.target.closest?.('[data-offline-weather-note],[data-offline-page-note]')&&[...row.addedNodes].some(n=>n.nodeType===1&&!n.matches('[data-offline-weather-note],[data-offline-page-note],.gw-offline-media,.gw-offline-camera,.gw-offline-expired-value')&&(row.target.matches?.('[data-cwa-widget],.ld-condition-panel,.gw-condition-panel')||n.matches('iframe,img,[data-cwa-widget],.ld-condition-panel,.gw-condition-panel')||n.querySelector('iframe,img,[data-cwa-widget],.ld-condition-panel,.gw-condition-panel')))))connectivity();}).observe(live,{childList:true,subtree:true});
 const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||local&&root.hasAttribute('data-gw-app-test');
 if(standalone||navigator.serviceWorker?.controller||storedDocument)setup().then(resume).catch(()=>{});
 let auto=new URL(location.href).searchParams.get('offline-save')==='1';try{auto=auto||sessionStorage.getItem('gw-offline-save-after-load')===slug;sessionStorage.removeItem('gw-offline-save-after-load');}catch{}
 restoringSave=auto;
 if(auto&&(slug==='/'||crags.some(row=>row[0]===slug))){const clean=new URL(location.href);clean.searchParams.delete('offline-save');history.replaceState(history.state,'',clean);show().then(save);}
}
window.GWOffline={show,check,save,prepareReload,isBusy:()=>busy,release:'2026.11.02.5'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
