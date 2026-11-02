/* Dedicated same-origin App update view. No pack deletion or automatic activation. */
(function(){
'use strict';
const root=document.documentElement,en=root.lang==='en',t=(zh,english)=>en?english:zh;
const el=name=>document.querySelector('[data-update-'+name+']');
let registration=null,phase='checking',current='',next='',detail='',applying=false,checkId=0,applyTimer=null,installTimer=null;
const watched=new WeakSet();
function rpc(worker,type){return new Promise((resolve,reject)=>{if(!worker)return reject(Error('NOT_READY'));const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(Error('TIMEOUT'));},10000);channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();event.data.ok?resolve(event.data):reject(Error(event.data.error||'FAILED'));};worker.postMessage({type},[channel.port2]);});}
function render(){
 root.dataset.phase=phase;
 document.title=t('App 更新 · GO WILD','App update · GO WILD');document.querySelector('h1').textContent=t('App 更新','App update');
 const copy={checking:t('正在檢查 App 版本…','Checking the App version…'),installing:t('正在準備新版，請保持此頁開啟。','Preparing the update. Keep this page open.'),ready:t('新版已準備好，可以開始更新。','The new version is ready to install.'),applying:t('正在套用新版，請稍候…','Applying the update. Please wait…'),done:t('App 已更新完成。','Your App has been updated.'),current:t('目前已是最新版本。','Your App is up to date.'),offline:t('目前沒有網路，請連線後再檢查。','You are offline. Connect to check for updates.'),error:t('暫時無法完成更新，請稍後重試。','Unable to complete the update. Please try again.')};
 el('copy').textContent=copy[phase];el('version').textContent=next&&next!==current?t('目前版本 ','Current ')+current+' · '+t('新版 ','New ')+next:current?t('目前版本 ','Current ')+current:'';
 el('status').textContent=detail;
 const button=el('action');button.hidden=['done','current'].includes(phase);button.disabled=['checking','installing','applying'].includes(phase);button.textContent=phase==='ready'?t('更新 App','Update App'):phase==='applying'?t('正在更新…','Updating…'):['checking','installing'].includes(phase)?t('正在檢查…','Checking…'):t('重新檢查','Check again');
 el('home').textContent=['done','current'].includes(phase)?t('回到首頁','Back to home'):t('返回首頁','Back to home');el('home').hidden=applying;
 el('note').textContent=t('更新會保留已下載的岩場資料；岩場內容更新仍可在選單的「離線資料」中處理。','Your saved crags are preserved. Update saved crag content separately in the menu’s Offline library.');
}
function setPhase(value,message=''){phase=value;detail=message;render();}
async function inspect(){
 if(applying)return;
 if(registration?.waiting){clearTimeout(installTimer);try{next=(await rpc(registration.waiting,'GW_STATUS')).release||'';}catch{next='';}setPhase('ready');return;}
 if(registration?.installing){watch(registration.installing);setPhase('installing');return;}
 setPhase(navigator.onLine===false?'offline':'current');
}
function watch(worker){
 if(!worker||watched.has(worker))return;watched.add(worker);
 clearTimeout(installTimer);installTimer=setTimeout(()=>{if(!applying&&phase==='installing')setPhase('error');},25000);
 worker.addEventListener('statechange',()=>{if(worker.state==='installed'||worker.state==='activated')setTimeout(inspect,0);if(worker.state==='redundant'&&!applying){clearTimeout(installTimer);setPhase('error');}});
}
async function check(){
 if(applying)return;const id=++checkId;setPhase('checking');
 if(!('serviceWorker'in navigator)){setPhase('error',t('此瀏覽器不支援 App 更新。','App updates are unavailable in this browser.'));return;}
 try{
  registration=await navigator.serviceWorker.getRegistration('/');
  if(!registration){if(navigator.onLine===false){setPhase('offline');return;}registration=await navigator.serviceWorker.register('/gw-offline/sw.js',{scope:'/',updateViaCache:'none'});}
  registration.addEventListener('updatefound',()=>{watch(registration.installing);if(!applying)setPhase('installing');},{once:true});watch(registration.installing);
  try{current=(await rpc(registration.active,'GW_STATUS')).release||'';}catch{current='';}
  if(id!==checkId)return;
  if(registration.waiting){await inspect();return;}
  if(navigator.onLine===false){setPhase('offline');return;}
  await Promise.race([registration.update(),new Promise((_,reject)=>setTimeout(()=>reject(Error('TIMEOUT')),15000))]);
  if(id!==checkId)return;await inspect();
 }catch{if(id===checkId)setPhase(navigator.onLine===false?'offline':'error');}
}
async function finish(){
 if(!applying)return;
 try{const active=await rpc(registration.active,'GW_STATUS');if(next&&active.release!==next)throw Error('NOT_ACTIVE');current=active.release||next;next='';clearTimeout(applyTimer);applying=false;setPhase('done');}catch{clearTimeout(applyTimer);applying=false;setPhase('error');}
}
async function apply(){
 const worker=registration?.waiting;if(applying||!worker){await check();return;}
 applying=true;setPhase('applying');
 applyTimer=setTimeout(()=>{if(applying){applying=false;setPhase('error',t('更新仍在等待；已儲存資料未變更。','The update is still pending. Your saved data is unchanged.'));}},20000);
 try{await rpc(worker,'GW_SKIP_WAITING');if(worker.state==='activated')await finish();}catch{clearTimeout(applyTimer);applying=false;setPhase('error');}
}
navigator.serviceWorker?.addEventListener('controllerchange',finish);
window.addEventListener('online',()=>{if(!applying)check();});
el('action').addEventListener('click',()=>phase==='ready'?apply():check());
render();check();
})();
