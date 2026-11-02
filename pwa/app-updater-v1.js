/* Installed App only. One shared dialog; no update-page navigation. */
(function(){
'use strict';if(window.GWAppUpdater)return;
const root=document.documentElement,local=/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const app=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||local&&root.hasAttribute('data-gw-app-test');
if(!app||!navigator.serviceWorker)return;
const t=(zh,en)=>root.getAttribute('data-gw-app-language')==='en'?en:zh;
const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 5v6h-6M20 11a8 8 0 1 0-1.5 6"/></svg>';
let registration=null,dialog=null,entry=null,notice=null,phase='checking',current='',next='',detail='',applying=false,previous=null,checkId=0,installTimer=null,applyTimer=null,reloading=false,finishing=false;
const watched=new WeakSet(),bound=new WeakSet();
function rpc(worker,type){return new Promise((resolve,reject)=>{if(!worker)return reject(Error('NOT_READY'));const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(Error('TIMEOUT'));},10000);channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();event.data.ok?resolve(event.data):reject(Error(event.data.error||'FAILED'));};worker.postMessage({type},[channel.port2]);});}
function el(name){return dialog?.querySelector('[data-app-updater-'+name+']');}
function placeEntry(){
 const offline=document.querySelector('.gw-offline-entry'),panel=document.querySelector('.gw-menu-panel');if(!offline||!panel)return;
 let row=panel.querySelector('.gw-app-data-tools');if(!row){row=document.createElement('div');row.className='gw-app-data-tools';(panel.querySelector('.gw-menu-tools')||panel).appendChild(row);}
 if(offline.parentElement!==row)row.appendChild(offline);
 if(!entry){entry=document.createElement('button');entry.type='button';entry.className='gw-app-update-entry';entry.setAttribute('data-gw-app-update-open','');entry.setAttribute('aria-haspopup','dialog');entry.innerHTML=icon+'<span></span>';entry.addEventListener('click',show);}
 if(entry.parentElement!==row)row.appendChild(entry);const label=t('檢查 App 更新','Check App updates');if(entry.querySelector('span').textContent!==label)entry.querySelector('span').textContent=label;
}
function renderNotice(){
 if((location.pathname.replace(/\/$/,'')||'/')!=='/'||!registration?.waiting){notice?.remove();notice=null;return;}
 const main=document.querySelector('main');if(!main)return;
 if(!notice){notice=document.createElement('div');notice.className='gw-app-update-wrap';notice.setAttribute('data-gw-updater-notice','');notice.style.fontFamily=getComputedStyle(main).fontFamily;notice.innerHTML='<div class="gw-app-update-notice" role="status"><span data-gw-updater-message></span><button type="button" data-gw-app-update-open>'+icon+'<span></span></button></div>';notice.querySelector('button').addEventListener('click',show);document.body.prepend(notice);}
 notice.querySelector('[data-gw-updater-message]').textContent=t('App 有新版可更新','An App update is ready');notice.querySelector('button span').textContent=t('查看更新','View update');
}
function render(){
 renderNotice();if(entry)entry.querySelector('span').textContent=t('檢查 App 更新','Check App updates');
 if(!dialog)return;dialog.dataset.phase=phase;el('title').textContent=t('App 更新','App update');
 const copy={checking:t('正在檢查 App 版本…','Checking the App version…'),installing:t('正在準備新版，請保持視窗開啟。','Preparing the update. Keep this window open.'),ready:t('新版已準備好，可以開始更新。','The new version is ready to install.'),applying:t('正在更新，完成後會重新載入目前頁面。','Updating. This page will reload when the update is complete.'),done:t('App 已更新完成。','Your App has been updated.'),current:t('目前已是最新版本。','Your App is up to date.'),offline:t('目前沒有網路，請連線後再檢查。','You are offline. Connect to check for updates.'),error:t('暫時無法完成更新，請稍後重試。','Unable to complete the update. Please try again.'),blocked:t('請先處理尚未送出的表單或等待離線下載完成，再更新 App。','Finish your unsent form or offline download before updating the App.')};
 el('copy').textContent=copy[phase];el('version').textContent=next&&next!==current?t('目前版本 ','Current ')+current+' · '+t('新版 ','New ')+next:current?t('目前版本 ','Current ')+current:'';el('status').textContent=detail;
 const action=el('action');action.hidden=['done','current'].includes(phase);action.disabled=['checking','installing','applying'].includes(phase);action.textContent=phase==='ready'?t('更新並重新載入','Update and reload'):phase==='applying'?t('正在更新…','Updating…'):['checking','installing'].includes(phase)?t('正在檢查…','Checking…'):t('重新檢查','Check again');
 el('note').textContent=t('已下載的岩場資料會保留。','Your saved crags will be preserved.');el('close').setAttribute('aria-label',t('關閉','Close'));
}
function setPhase(value,message=''){phase=value;detail=message;render();}
function close(){dialog?.close();root.removeAttribute('data-gw-update-dialog-open');if(previous?.isConnected)previous.focus({preventScroll:true});}
function ensureDialog(){
 if(dialog)return;dialog=document.createElement('dialog');dialog.className='gw-app-install-dialog gw-app-update-dialog';dialog.setAttribute('aria-labelledby','gw-app-update-title');dialog.innerHTML='<button type="button" class="gw-app-install-close" data-app-updater-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><div class="gw-app-update-mark" aria-hidden="true">'+icon+'</div><h2 id="gw-app-update-title" tabindex="-1" data-app-updater-title></h2><p data-app-updater-copy></p><p class="gw-app-update-version" data-app-updater-version></p><p class="gw-app-update-status" data-app-updater-status role="status" aria-live="polite"></p><button type="button" class="gw-app-install-action" data-app-updater-action></button><p class="gw-app-install-note" data-app-updater-note></p>';
 el('close').addEventListener('click',close);dialog.addEventListener('cancel',event=>{event.preventDefault();close();});dialog.addEventListener('close',()=>root.removeAttribute('data-gw-update-dialog-open'));el('action').addEventListener('click',()=>phase==='ready'?apply():check());document.body.appendChild(dialog);
}
async function getRegistration(){
 if(registration)return registration;registration=await navigator.serviceWorker.getRegistration('/');
 if(!registration)registration=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('NOT_READY')),15000))]);
 if(!bound.has(registration)){bound.add(registration);registration.addEventListener('updatefound',()=>{watch(registration.installing);if(dialog?.open&&!applying)setPhase('installing');});}watch(registration.installing);return registration;
}
function watch(worker){
 if(!worker||watched.has(worker))return;watched.add(worker);worker.addEventListener('statechange',()=>{renderNotice();if(['installed','activated'].includes(worker.state))setTimeout(()=>{if(dialog?.open&&!applying)inspect();else renderNotice();},0);if(worker.state==='redundant'&&dialog?.open&&!applying)setPhase('error');});
}
async function inspect(){
 if(applying)return;clearTimeout(installTimer);
 if(registration?.waiting){try{next=(await rpc(registration.waiting,'GW_STATUS')).release||'';}catch{next='';}setPhase('ready');return;}
 next='';if(registration?.installing){watch(registration.installing);setPhase('installing');installTimer=setTimeout(()=>{if(phase==='installing')setPhase('error');},25000);return;}
 setPhase(navigator.onLine===false?'offline':'current');
}
async function check(){
 if(applying)return;const id=++checkId;setPhase('checking');
 try{await getRegistration();try{current=(await rpc(registration.active,'GW_STATUS')).release||'';}catch{current='';}if(id!==checkId)return;
 if(!registration.waiting&&navigator.onLine!==false)await Promise.race([registration.update(),new Promise((_,reject)=>setTimeout(()=>reject(Error('TIMEOUT')),15000))]);if(id===checkId)await inspect();
 }catch{if(id===checkId)setPhase(navigator.onLine===false?'offline':'error');}
}
async function show(){ensureDialog();previous=document.activeElement;if(!dialog.open)dialog.showModal();root.setAttribute('data-gw-update-dialog-open','');render();el('title').focus({preventScroll:true});if(!applying)await check();}
async function finish(){
 if(!applying||reloading||finishing)return;finishing=true;
 try{const result=await rpc(registration.active,'GW_STATUS');if(next&&result.release!==next)throw Error('NOT_ACTIVE');current=result.release||next;clearTimeout(applyTimer);reloading=true;try{sessionStorage.setItem('gw-app-update-complete-v1',current);}catch{}await window.GWOffline?.prepareReload?.();location.reload();}
 catch{clearTimeout(applyTimer);applying=false;setPhase('error');}finally{finishing=false;}
}
async function apply(){
 if(applying||!registration?.waiting){await check();return;}
 const meter=document.querySelector('.gw-offline-dialog [data-offline-progress]');
 if(window.GWApp?.hasUnsavedForm?.()||window.GWOffline?.isBusy?.()||meter&&!meter.hidden&&meter.value<100){setPhase('blocked');return;}
 applying=true;setPhase('applying');applyTimer=setTimeout(()=>{if(applying&&!reloading){applying=false;setPhase('error');}},20000);
 try{const worker=registration.waiting;await rpc(worker,'GW_SKIP_WAITING');if(worker.state==='activated')await finish();}catch{clearTimeout(applyTimer);applying=false;setPhase('error');}
}
async function init(){
 placeEntry();const panel=document.querySelector('.gw-menu-panel');if(panel)new MutationObserver(placeEntry).observe(panel,{childList:true,subtree:true});
 new MutationObserver(render).observe(root,{attributes:true,attributeFilter:['data-gw-app-language']});
 try{await getRegistration();renderNotice();let completed='';try{completed=sessionStorage.getItem('gw-app-update-complete-v1')||'';sessionStorage.removeItem('gw-app-update-complete-v1');}catch{}
 if(completed){const result=await rpc(registration.active,'GW_STATUS');current=result.release||'';if(current===completed){ensureDialog();previous=document.activeElement;setPhase('done');dialog.showModal();root.setAttribute('data-gw-update-dialog-open','');el('title').focus({preventScroll:true});}}
 }catch{}
}
// Older cached pages may still contain links to the former update route.
document.addEventListener('click',event=>{const link=event.target.closest?.('a[href]');if(!link)return;try{const url=new URL(link.href,location.href);if(url.origin===location.origin&&url.pathname.replace(/\/$/,'')==='/gw-offline/update'){event.preventDefault();event.stopImmediatePropagation();show();}}catch{}},true);
navigator.serviceWorker.addEventListener('controllerchange',()=>{renderNotice();if(applying)finish();});window.addEventListener('online',()=>{if(dialog?.open&&!applying)check();});
window.GWAppUpdater={show,refresh:renderNotice};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
