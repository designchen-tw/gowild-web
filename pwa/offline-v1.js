/* GO WILD offline library. Loaded after the existing App footer; no navigation replacement. */
(function(){
'use strict';if(window.GWOffline)return;
const root=document.documentElement,local=/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const crags=[['/longdong','龍洞','Long Dong'],['/defulan','德芙蘭','Defulan'],['/guanziling','關子嶺','Guanziling'],['/kenting','墾丁','Kenting']];
const slug=location.pathname.replace(/\/$/,'')||'/';
let registration=null,dialog=null,entry=null,packs=[],home=null,sizes={},downloadPercent=null,checks={},busy=false,error='',progress='',checking=false,estimating=false,waiting=false,applying=false,lastCheck=0,previousFocus=null;
const en=()=>root.getAttribute('data-gw-app-language')==='en'||document.querySelector('main[data-language="en"],main[lang="en"],#outside-of-rock[lang="en"]')!==null;
const t=(zh,english)=>en()?english:zh;
const time=value=>new Date(value).toLocaleString(en()?'en-GB':'zh-TW',{timeZone:'Asia/Taipei',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});
function mb(bytes){return Math.max(.1,bytes/1048576).toFixed(1)+' MB';}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const downloadIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5"/></svg>';
function rpc(type,detail={},worker=registration?.active,onProgress){return new Promise((resolve,reject)=>{if(!worker){reject(Error('NOT_READY'));return;}const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(Error('TIMEOUT'));},type==='GW_SAVE'?180000:45000);channel.port1.onmessage=event=>{if(event.data.progress){onProgress?.(event.data.progress);return;}clearTimeout(timer);channel.port1.close();event.data.ok?resolve(event.data):reject(Error(event.data.error||'FAILED'));};worker.postMessage({type,...detail},[channel.port2]);});}
async function setup(){
  if(registration)return registration;
  if(!('serviceWorker'in navigator)||!isSecureContext)throw Error('UNSUPPORTED');
  registration=await navigator.serviceWorker.register('/gw-offline/sw.js',{scope:'/',updateViaCache:'none'});
  const ready=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('NOT_READY')),15000))]);
  registration=ready;waiting=!!registration.waiting;
  registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){waiting=true;render();document.querySelector('.gw-app-reload')?.setAttribute('data-update-available','');}});});
  await status();return registration;
}
async function status(){if(!registration?.active)return;const result=await rpc('GW_STATUS');packs=result.packs||[];home=result.home||null;render();}
function friendly(code){return ({UNSUPPORTED:t('此瀏覽器不支援離線儲存。','Offline storage is unavailable in this browser.'),PAGE_NOT_READY:t('地圖仍在載入，請稍後再試。','The map is still loading. Please try again shortly.'),PAGE_UNAVAILABLE:t('無法取得頁面，請確認連線後再試。','The page could not be downloaded. Check your connection.'),ASSET_UNAVAILABLE:t('部分圖片或程式未能下載；原有離線資料仍保留。','Some assets could not be downloaded. Your previous copy is preserved.'),PACK_TOO_LARGE:t('資料超過單一岩場的儲存上限。','This crag exceeds the download limit.'),STORAGE_FULL:t('裝置空間不足；請移除不需要的離線岩場。','Storage is full. Remove an offline crag to free space.'),BUSY:t('另一個儲存工作正在進行，請稍後再試。','Another download is in progress. Try again shortly.'),TIMEOUT:t('下載逾時；請保持頁面開啟並確認連線。','Download timed out. Keep this page open and check your connection.')}[code])||t('離線功能暫時無法啟用，請連線後再試。','Offline storage is not ready. Connect and try again.');}
function render(){
 if(!dialog?.open)return;
 const list=dialog.querySelector('[data-offline-list]');
 dialog.querySelector('h2').textContent=t('離線資料','Offline library');
 dialog.querySelector('[data-offline-intro]').textContent=t('選擇岩場儲存。首次下載會一併儲存首頁與選單，方便離線切換。下載量為預估值；已儲存顯示裝置使用空間。','Save individual crags. The first download includes the shared homepage and menu for offline navigation. Download sizes are estimates; saved sizes show device storage use.');
 const common=dialog.querySelector('[data-offline-home]');common.innerHTML='<p>'+esc(home?t('首頁與選單 · 已儲存 ','Homepage & menu · Saved ')+mb(home.bytes):t('共用首頁與選單 · ','Shared homepage & menu · ')+(sizes['/']?t('預估約 ','About ')+mb(sizes['/']):sizes['/']===false?t('容量暫時無法估算','Size estimate unavailable'):t('正在估算容量…','Estimating size…')))+(checks['/']?.changed?' · '+esc(t('有新內容','New content')):'')+'</p><button type="button" class="gw-offline-text" data-offline-home-save '+(busy||root.getAttribute('data-gw-offline')==='true'?'disabled':'')+'>'+esc(home?t('更新首頁與選單','Update homepage & menu'):t('只儲存首頁與選單','Save homepage & menu only'))+'</button>'+(home?'<button type="button" class="gw-offline-text" data-offline-remove="/" '+(busy?'disabled':'')+'>'+esc(t('移除','Remove'))+'</button>':'');
 list.innerHTML=crags.map(([path,zh,eng])=>{const saved=packs.find(p=>p.slug===path),check=checks[path],current=path===slug;return '<li><div><h3>'+esc(en()?eng:zh)+'</h3><p>'+esc(saved?t('已儲存 ','Saved ')+time(saved.savedAt)+' · '+mb(saved.bytes):t('尚未儲存','Not saved'))+'</p><p>'+esc(sizes[path]?t('預估下載約 ','Estimated download ')+mb(sizes[path]+(!home||checks['/']?.changed?sizes['/']||0:0))+(!home||checks['/']?.changed?t('（含共用首頁）',' (includes homepage)'):''):root.getAttribute('data-gw-offline')==='true'?t('連網後可估算下載量','Connect to estimate download size'):sizes[path]===false?t('容量暫時無法估算','Size estimate unavailable'):t('正在估算容量…','Estimating size…'))+'</p>'+(check?'<p>'+esc(check.error?t('無法檢查更新','Update check failed'):check.changed?t('有新內容可儲存','New content available'):t('已核對，內容未變更','Checked; content unchanged'))+'</p>':'')+'</div><div class="gw-offline-actions">'+(current?'<button type="button" data-offline-save="'+path+'" '+(busy||root.getAttribute('data-gw-offline')==='true'?'disabled':'')+'>'+esc(saved?t('更新','Update'):t('儲存','Save'))+'</button>':'<a href="'+path+'?offline-save=1">'+esc(saved?t('開啟／更新','Open / update'):t('前往儲存','Open to save'))+'</a>')+(saved?'<button type="button" data-offline-remove="'+path+'" class="gw-offline-text" '+(busy?'disabled':'')+'>'+esc(t('移除','Remove'))+'</button>':'')+'</div></li>';}).join('');
 dialog.querySelector('[data-offline-status]').textContent=progress||error;
 const meter=dialog.querySelector('[data-offline-progress]');meter.hidden=downloadPercent===null;meter.value=downloadPercent||0;meter.setAttribute('aria-label',t('下載進度','Download progress'));
 const checkButton=dialog.querySelector('[data-offline-check]');checkButton.textContent=checking?t('正在檢查…','Checking…'):t('檢查內容更新','Check content updates');checkButton.disabled=busy||checking||root.getAttribute('data-gw-offline')==='true';
 const update=dialog.querySelector('[data-offline-update]');update.hidden=!waiting;update.disabled=busy||applying;update.textContent=t('App 有新版 · 更新並重新載入','App update ready · Update and reload');
 dialog.querySelector('[data-offline-note]').textContent=t('天氣只保留最後取得的資料與時間。即時影像、Windy、PDF、外部連結與表單送出需要網路。裝置可能清除儲存資料，出發前請再確認。','Weather retains only the last received data and timestamp. Live cameras, Windy, PDFs, external links and form submission require a connection. Your device may clear stored data; check before departure.');
 dialog.querySelector('[data-offline-version]').textContent=t('離線功能版本 ','Offline feature version ')+'2026.10.24.2';
 dialog.querySelector('[data-offline-close]').setAttribute('aria-label',t('關閉','Close'));
}
function close(){dialog?.close();previousFocus?.focus({preventScroll:true});}
async function show(){
 if(!dialog){dialog=document.createElement('dialog');dialog.className='gw-app-install-dialog gw-offline-dialog';dialog.setAttribute('aria-labelledby','gw-offline-title');dialog.innerHTML='<button type="button" class="gw-app-install-close" data-offline-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><h2 id="gw-offline-title" tabindex="-1"></h2><p data-offline-intro></p><div data-offline-home></div><ul data-offline-list></ul><progress data-offline-progress max="100" hidden></progress><p data-offline-status role="status" aria-live="polite"></p><div class="gw-offline-tools"><button type="button" class="gw-offline-text" data-offline-check></button><button type="button" class="gw-offline-text" data-offline-update hidden></button></div><p class="gw-app-install-note" data-offline-note></p><small data-offline-version></small>';
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});dialog.addEventListener('click',async event=>{if(busy&&event.target.closest('a')){event.preventDefault();return;}const button=event.target.closest('button');if(!button)return;if(button.hasAttribute('data-offline-close'))close();if(button.dataset.offlineSave)save();if(button.hasAttribute('data-offline-home-save'))save('/');if(button.dataset.offlineRemove){try{await rpc('GW_REMOVE',{slug:button.dataset.offlineRemove});delete checks[button.dataset.offlineRemove];await status();}catch(e){error=friendly(e.message);render();}}if(button.hasAttribute('data-offline-check'))check();if(button.hasAttribute('data-offline-update'))applyUpdate();});document.body.appendChild(dialog);}
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
 if(target!=='/'&&checks[target]?.changed){if(window.GWApp?.hasUnsavedForm?.()){error=t('請先處理尚未送出的表單，再重新載入更新。','Please finish your unsent form before reloading.');render();return;}sessionStorage.setItem('gw-offline-save-after-load',slug);window.GWApp?.reload?window.GWApp.reload():location.reload();return;}
 busy=true;downloadPercent=0;error='';progress=t('準備儲存…請保持頁面開啟。','Preparing download… Keep this page open.');render();
 try{await setup();if(target!=='/')await mapReady();await rpc('GW_SAVE',{slug:target,assets:target===slug?assets():[]},registration.active,p=>{downloadPercent=p.percent??0;progress=t('正在下載 ','Downloading ')+downloadPercent+'% · '+mb(p.bytes);const line=dialog?.querySelector('[data-offline-status]');if(line)line.textContent=progress;const meter=dialog?.querySelector('[data-offline-progress]');if(meter){meter.hidden=false;meter.value=downloadPercent;}});downloadPercent=100;progress=t('已完成，可離線閱讀。','Saved. Ready for offline reading.');delete checks[target];delete checks['/'];await status();try{await navigator.storage?.persist?.();}catch{} }
 catch(e){downloadPercent=null;error=friendly(e.message);progress='';}finally{busy=false;render();}
}
async function check(){if(!registration||busy||checking)return;checking=true;error='';progress='';render();try{const result=await rpc('GW_CHECK');for(const row of result.results)checks[row.slug]=row;await registration.update();waiting=!!registration.waiting;}catch(e){error=friendly(e.message);}finally{checking=false;render();}}
function applyUpdate(){
 if(busy||applying||!registration?.waiting)return;
 if(window.GWApp?.hasUnsavedForm?.()){error=t('尚有未送出的表單。請先完成或清除內容，再更新 App。','You have unsent form entries. Finish or clear them before updating.');render();return;}
 if(document.querySelector('dialog[open]:not(.gw-offline-dialog)')||[...document.querySelectorAll('iframe')].some(f=>/acrobat|adobe|documentcloud/i.test(f.src+' '+f.id)&&f.getClientRects().length&&getComputedStyle(f).visibility!=='hidden')){error=t('請先關閉 PDF 或其他視窗，再更新。','Close the PDF viewer or other dialog before updating.');render();return;}
 applying=true;render();setTimeout(()=>{if(applying&&!reloadOnChange){applying=false;error=t('更新仍在等待，請稍後再試。','The update is still pending. Please try again shortly.');render();}},15000);rpc('GW_SKIP_WAITING',{},registration.waiting).catch(()=>{applying=false;error=t('更新未完成，請稍後再試。','The update did not finish. Try again.');render();});
}
let reloadOnChange=false,weatherSavedAt=null,weatherFallback=false;
navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(applying&&!reloadOnChange){reloadOnChange=true;location.reload();}});
navigator.serviceWorker?.addEventListener('message',event=>{if(event.data?.key!=='/api'+slug)return;if(event.data?.type==='GW_WEATHER_OFFLINE'){weatherFallback=true;weatherSavedAt=event.data.savedAt;weatherNotice(weatherSavedAt);}if(event.data?.type==='GW_WEATHER_ONLINE'){weatherFallback=false;weatherSavedAt=null;connectivity();}});
function weatherNotice(value){
 document.querySelectorAll('.ld-condition-panel,.gw-condition-panel,[data-cwa-widget]').forEach(panel=>{let note=panel.querySelector(':scope>[data-offline-weather-note]');if(!note){note=document.createElement('p');note.setAttribute('data-offline-weather-note','');note.className='gw-offline-notice';panel.prepend(note);}note.dataset.savedAt=value||'';note.textContent=t('離線資料 · 最後取得 ','Offline data · Last received ')+(value?time(value):t('未儲存天氣資料','No weather data saved'));});
}
function connectivity(){
 const offline=!navigator.onLine||!!window.GWOfflineDocument;root.setAttribute('data-gw-offline',String(offline));
 let note=document.querySelector('[data-offline-page-note]');const main=document.querySelector('main');if(!note&&main){note=document.createElement('p');note.className='gw-offline-notice';note.setAttribute('data-offline-page-note','');main.prepend(note);}if(note){note.hidden=!offline;note.textContent=t('離線閱讀','Offline reading')+(window.GWOfflineDocument?.savedAt?' · '+t('儲存於 ','Saved ')+time(window.GWOfflineDocument.savedAt):'');}
 if(offline||weatherFallback)weatherNotice(weatherSavedAt);else document.querySelectorAll('[data-offline-weather-note]').forEach(node=>node.remove());
 document.querySelectorAll('iframe').forEach(frame=>{if(!/windy|youtube|168\.motc|thb\.gov|cctv|acrobat|documentcloud/i.test(frame.src))return;let placeholder=frame.parentElement.querySelector(':scope>.gw-offline-media');if(!placeholder){placeholder=document.createElement('div');placeholder.className='gw-offline-media';frame.insertAdjacentElement('beforebegin',placeholder);}placeholder.textContent=t('此內容需網路連線','This content requires a connection');placeholder.hidden=!offline;});
 document.querySelectorAll('img[src*="thb.gov.tw"],img[src*="cctv"],img[src*="168.motc"]').forEach(image=>{let placeholder=image.parentElement.querySelector(':scope>.gw-offline-camera');if(!placeholder){placeholder=document.createElement('div');placeholder.className='gw-offline-camera';image.insertAdjacentElement('beforebegin',placeholder);}placeholder.textContent=t('即時影像需網路連線','Live camera requires a connection');placeholder.hidden=!offline;image.toggleAttribute('data-offline-camera-hidden',offline);});
 if(entry)entry.querySelector('span').textContent=t('離線資料','Offline library');render();
}
async function resume(){if(document.visibilityState==='hidden'||!navigator.onLine||!registration||Date.now()-lastCheck<3600000)return;lastCheck=Date.now();try{await registration.update();waiting=!!registration.waiting;render();}catch{}}
function init(){
 const panel=document.querySelector('.gw-menu-panel');if(panel){entry=document.createElement('button');entry.type='button';entry.className='gw-app-install-entry gw-offline-entry';entry.innerHTML=downloadIcon+'<span></span>';entry.addEventListener('click',show);panel.appendChild(entry);}
 document.addEventListener('click',event=>{if(root.getAttribute('data-gw-offline')!=='true')return;const a=event.target.closest('a[href]');if(!a||a.hasAttribute('download'))return;let url;try{url=new URL(a.href,location.href);}catch{return;}if(!['https:','http:'].includes(url.protocol))return;const path=url.pathname.replace(/\/$/,'')||'/';if(url.origin===location.origin&&(path===slug||path==='/'&&home||packs.some(p=>p.slug===path)))return;event.preventDefault();alert(t('此頁面尚未儲存，請連網後開啟。','This page is not saved. Connect to the internet to open it.'));},true);
 root.addEventListener('gw-language-change',connectivity);
 new MutationObserver(connectivity).observe(root,{attributes:true,attributeFilter:['data-gw-app-language']});
 const main=document.querySelector('main[data-language]');if(main)new MutationObserver(connectivity).observe(main,{attributes:true,attributeFilter:['data-language']});
 document.addEventListener('submit',event=>{if(root.getAttribute('data-gw-offline')==='true'){event.preventDefault();event.stopImmediatePropagation();alert(t('目前離線，表單尚未送出。請保持此頁，恢復連線後再送出。','You are offline. Your form was not sent. Keep this page open and submit after reconnecting.'));}},true);
 window.addEventListener('offline',()=>{window.GWOfflineDocument=window.GWOfflineDocument||{slug};connectivity();});
 window.addEventListener('online',async()=>{try{const r=await fetch('/gw-offline/health',{cache:'no-store'});if(!r.ok)return;window.GWOfflineDocument=null;connectivity();if(registration)await status();}catch{}});
 window.addEventListener('pageshow',connectivity);document.addEventListener('visibilitychange',resume);
 connectivity();
 const live=document.querySelector('[id$="-live-weather"]');if(live)new MutationObserver(rows=>{if(root.getAttribute('data-gw-offline')==='true'&&rows.some(row=>[...row.addedNodes].some(n=>n.nodeType===1&&(n.matches('iframe,img,[data-cwa-widget]')||n.querySelector('iframe,img,[data-cwa-widget]')))))connectivity();}).observe(live,{childList:true,subtree:true});
 const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||local&&root.hasAttribute('data-gw-app-test');
 if(standalone||navigator.serviceWorker?.controller||window.GWOfflineDocument)setup().catch(()=>{});
 let auto=new URL(location.href).searchParams.get('offline-save')==='1';try{auto=auto||sessionStorage.getItem('gw-offline-save-after-load')===slug;sessionStorage.removeItem('gw-offline-save-after-load');}catch{}
 if(auto&&crags.some(row=>row[0]===slug)){const clean=new URL(location.href);clean.searchParams.delete('offline-save');history.replaceState(history.state,'',clean);show().then(save);}
}
window.GWOffline={show,check,save,release:'2026.10.24.2'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
