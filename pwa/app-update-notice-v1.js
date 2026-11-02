/* Compatibility notification for older clients whose SW rewrites the new footer.
   Modern offline clients own their notification; never create a second one. */
(function(){
'use strict';if(window.GWLegacyUpdateNotice)return;
const root=document.documentElement,local=/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const app=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||local&&root.hasAttribute('data-gw-app-test');
if(!app||(location.pathname.replace(/\/$/,'')||'/')!=='/'||!navigator.serviceWorker)return;
function modern(){const v=String(window.GWOffline?.release||'').split('.').map(Number),min=[2026,11,2,3];for(let i=0;i<min.length;i++){if((v[i]||0)!==min[i])return(v[i]||0)>min[i]}return true;}
let registration=null,banner=null,blocked=false;
const t=(zh,en)=>root.getAttribute('data-gw-app-language')==='en'?en:zh;
function render(){
 if(modern()||!registration?.waiting){banner?.remove();banner=null;return;}
 const main=document.querySelector('main');if(!main)return;
 if(!banner){banner=document.createElement('div');banner.className='gw-offline-page-wrap gw-app-update-wrap';banner.setAttribute('data-legacy-update-notice','');banner.style.fontFamily=getComputedStyle(main).fontFamily;banner.innerHTML='<div class="gw-app-update-notice" role="status"><span></span><a href="/gw-offline/update"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 5v6h-6M20 11a8 8 0 1 0-1.5 6"/></svg><span></span></a></div>';banner.querySelector('a').addEventListener('click',event=>{event.preventDefault();if(window.GWApp?.hasUnsavedForm?.()){blocked=true;render();return;}location.assign('/gw-offline/update')});document.body.prepend(banner);}
 banner.querySelector('.gw-app-update-notice>span').textContent=blocked?t('請先處理尚未送出的表單，再更新 App。','Finish your unsent form before updating the App.'):t('App 有新版可更新','An App update is ready');banner.querySelector('a span').textContent=t('查看更新','View update');
}
function watch(worker){worker?.addEventListener('statechange',()=>setTimeout(render,0));}
async function init(){if(modern())return;try{registration=await navigator.serviceWorker.getRegistration('/');if(!registration)return;registration.addEventListener('updatefound',()=>watch(registration.installing));watch(registration.installing);render();if(navigator.onLine!==false)await registration.update();render();}catch{}}
navigator.serviceWorker.addEventListener('controllerchange',render);new MutationObserver(render).observe(root,{attributes:true,attributeFilter:['data-gw-app-language']});
window.GWLegacyUpdateNotice={refresh:render};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
