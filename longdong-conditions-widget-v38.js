(()=>{
const root=document.querySelector('[data-ld-detail]'),facts=root?.querySelector('.ld-detail__facts');if(!root||!facts)return;
const widget=document.createElement('section');widget.className='ld-condition-panel';widget.setAttribute('aria-label','Longdong climbing conditions');widget.innerHTML=`<div class="ld-condition-head"><h2 class="ld-condition-title" data-en="Climbing conditions">攀登現況</h2><span class="ld-condition-updated">--</span></div><div class="ld-condition-grid"><article><small data-en="Sunrise / sunset">日出／日落</small><strong data-sun>--:-- / --:--</strong><span data-en="Local time">當地時間</span></article><article><small data-en="Relative humidity">相對濕度</small><strong data-humidity>--%</strong><span data-humidity-source data-en="CWA observation">氣象署觀測</span></article><article class="ld-condition-feels"><small data-en="Feels like">體感溫度</small><strong data-feels>--°</strong><div class="ld-condition-feels-times"><div><i data-en="Today’s high">當日最高溫</i><b data-today-high>--°</b></div><div><i data-en="Today’s low">當日最低溫</i><b data-today-low>--°</b></div></div><div class="ld-condition-feels-current"><i data-en="Current temperature">目前溫度</i><b data-current-temp>--°</b></div></article><article class="ld-condition-wind"><small data-en="Wind direction · speed">風向・風速</small><div class="ld-condition-wind-main"><span class="ld-condition-wind-arrow" data-wind-arrow aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2 5 10h5v12h4V10h5z"/></svg></span><strong data-wind-summary>資料暫缺</strong></div><div class="ld-condition-wind-divider" aria-hidden="true"></div><span class="ld-condition-wind-detail" data-wind-detail>蒲福 -- 級・-- m/s</span><span data-en="Mean station wind; coastal gusts may be stronger.">氣象站平均風速，海岸陣風可能更強</span></article><article class="ld-condition-rock"><small data-en="Rock dryness · estimate">岩面乾燥度・推估</small><strong data-rock>資料載入中</strong><span data-rock-note>依雨量與溫濕度推估</span></article><article class="ld-condition-wave" data-level="unknown"><small data-en="Wave forecast">浪況預報</small><strong data-wave-value>資料載入中</strong><span class="ld-condition-wave-detail" data-wave-detail>平均週期 -- 秒 · 浪向暫缺</span><span class="ld-condition-wave-source" data-wave-source>龍洞浮標 · 觀測資料載入中</span></article><article class="ld-condition-tide"><small data-en="Tide forecast">潮汐預報</small><div class="ld-condition-tide-reading"><strong data-tide-state>載入中</strong><span class="ld-condition-tide-range" data-tide-range></span></div><div class="ld-condition-tide-last"><i data-tide-last-label>上一次滿潮</i><b class="ld-condition-tide-clock" data-tide-last-time>--:--</b></div><div class="ld-condition-tide-times"><div><i>下一次滿潮</i><b>--:--</b></div><div><i>下一次乾潮</i><b>--:--</b></div></div><div class="ld-condition-tide-source"><span data-tide-date>龍洞南口・預報</span><span data-en="Height relative to local mean sea level">潮高相對當地平均海平面</span></div></article></div><p class="ld-condition-disclaimer" data-en="Weather-based estimate from nearby stations; rock, salt and sea spray are not measured. Check on site.">岩面狀態由附近氣象站推估，未量測岩面、鹽分或海浪；請以現場狀況為準。</p>`;
const rockTitle=widget.querySelector('.ld-condition-rock small');rockTitle.textContent='岩面狀況推估';rockTitle.dataset.en='Rock condition estimate';
const windCardLayout=widget.querySelector('.ld-condition-wind');
const feelsTimesLayout=widget.querySelector('.ld-condition-feels-times');
if(feelsTimesLayout?.children.length===2)feelsTimesLayout.prepend(feelsTimesLayout.children[1]);
const windDetailLayout=windCardLayout?.querySelector('[data-wind-detail]');
const windNoteLayout=windCardLayout?.querySelector('span[data-en="Mean station wind; coastal gusts may be stronger."]');
if(windCardLayout&&windDetailLayout){windCardLayout.querySelector('.ld-condition-wind-main')?.after(windDetailLayout);windCardLayout.querySelector('.ld-condition-wind-divider')?.remove();}
windNoteLayout?.classList.add('ld-condition-wind-note');
const tideCardLayout=widget.querySelector('.ld-condition-tide');
const tideLastLayout=tideCardLayout?.querySelector('.ld-condition-tide-last');
if(tideCardLayout&&tideLastLayout){
  const header=document.createElement('div');header.className='ld-condition-tide-header';
  const title=tideCardLayout.querySelector('small');
  tideCardLayout.prepend(header);header.append(title,tideLastLayout);
}
const tideLastLabel=tideCardLayout?.querySelector('[data-tide-last-label]');
const tideLastTime=tideCardLayout?.querySelector('[data-tide-last-time]');
[tideLastLabel,tideLastTime].forEach(el=>{if(!el)return;el.style.setProperty('font-size','var(--gw-type-detail,12px)','important');el.style.setProperty('font-weight','400','important');el.style.setProperty('line-height','1.6','important');el.style.setProperty('color','var(--gw-ink-detail,rgba(245,245,245,.62))','important');});
facts.insertAdjacentElement('afterend',widget);
const liveGrid=root.querySelector('.ld-detail__live-grid');
if(liveGrid&&!root.querySelector('.ld-road-camera-section')){
const oldCamera=liveGrid.querySelector('iframe[src*="youtube.com/embed/"]')?.closest('article');if(oldCamera)oldCamera.remove();
const cameras=document.createElement('section');cameras.className='ld-road-camera-section ld-detail__live-card';cameras.setAttribute('aria-label','現場即時影像與台2線路口監視器');
cameras.innerHTML=`<header class="ld-road-camera-heading"><div><p class="ld-condition-eyebrow" data-lang-zh="現場影像" data-lang-en="Live cameras">LIVE CAMERAS</p><h3 data-lang-zh="現場即時影像" data-lang-en="Live Cameras">現場即時影像</h3></div><p data-lang-zh="龍洞現場與台2線路口監視器" data-lang-en="Longdong and Highway 2 roadside cameras">龍洞現場與台2線路口監視器</p></header><p class="ld-road-camera-hint" data-lang-zh="左右滑動，選擇想看的畫面" data-lang-en="Swipe to browse cameras">左右滑動，選擇想看的畫面</p><div class="ld-road-camera-grid"><article class="ld-road-camera-card"><div class="ld-detail__live-card-head"><div><h3 data-lang-zh="龍洞現場影像" data-lang-en="Longdong Climbing Area">龍洞現場影像</h3><span class="ld-road-camera-meta" data-lang-zh="YouTube 即時串流" data-lang-en="YouTube live stream">YouTube 即時串流</span></div><a href="https://www.youtube.com/watch?v=7fDA_cR12qg" target="_blank" rel="noopener" data-lang-zh="開啟原始影像" data-lang-en="Open camera">開啟原始影像</a></div><div class="ld-detail__live-frame"><iframe src="https://www.youtube.com/embed/7fDA_cR12qg?autoplay=0&mute=1" title="龍洞現場即時影像" data-title-zh="龍洞現場即時影像" data-title-en="Longdong live camera" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></article><article class="ld-road-camera-card"><div class="ld-detail__live-card-head"><div><h3 data-lang-zh="龍洞隧道口（W）" data-lang-en="Longdong Tunnel (W)">龍洞隧道口（W）</h3><span class="ld-road-camera-meta" data-lang-zh="台2線 87K+743" data-lang-en="Provincial Highway 2 · 87K+743">台2線 87K+743</span></div><a href="https://tw.live/cam/?id=CCTV-14-0020-087-004" target="_blank" rel="noopener" data-lang-zh="備用來源" data-lang-en="Camera details">備用來源</a></div><div class="ld-detail__live-frame"><img data-camera-src="https://cctv-ss01.thb.gov.tw:443/T2-87K+743(N)" alt="龍洞隧道口西向即時影像" data-alt-zh="龍洞隧道口西向即時影像" data-alt-en="Longdong Tunnel westbound live camera" loading="lazy" referrerpolicy="no-referrer"></div></article><article class="ld-road-camera-card"><div class="ld-detail__live-card-head"><div><h3 data-lang-zh="龍洞隧道口（E）" data-lang-en="Longdong Tunnel (E)">龍洞隧道口（E）</h3><span class="ld-road-camera-meta" data-lang-zh="台2線 87K+543" data-lang-en="Provincial Highway 2 · 87K+543">台2線 87K+543</span></div><a href="https://tw.live/cam/?id=CCTV-14-0020-087-003" target="_blank" rel="noopener" data-lang-zh="備用來源" data-lang-en="Camera details">備用來源</a></div><div class="ld-detail__live-frame"><img data-camera-src="https://cctv-ss01.thb.gov.tw:443/T2-87K+543(S)" alt="龍洞隧道口東向即時影像" data-alt-zh="龍洞隧道口東向即時影像" data-alt-en="Longdong Tunnel eastbound live camera" loading="lazy" referrerpolicy="no-referrer"></div></article><article class="ld-road-camera-card"><div class="ld-detail__live-card-head"><div><h3 data-lang-zh="過龍洞隧道往宜蘭（E）" data-lang-en="After Longdong Tunnel toward Yilan (E)">過龍洞隧道往宜蘭（E）</h3><span class="ld-road-camera-meta" data-lang-zh="台2線 88K+150" data-lang-en="Provincial Highway 2 · 88K+150">台2線 88K+150</span></div><a href="https://tw.live/cam/?id=CCTV-14-0020-088-002" target="_blank" rel="noopener" data-lang-zh="備用來源" data-lang-en="Camera details">備用來源</a></div><div class="ld-detail__live-frame"><img data-camera-src="https://cctv-ss01.thb.gov.tw:443/T2-88K+150(S)" alt="過龍洞隧道往宜蘭即時影像" data-alt-zh="過龍洞隧道往宜蘭即時影像" data-alt-en="After Longdong Tunnel toward Yilan live camera" loading="lazy" referrerpolicy="no-referrer"></div></article><article class="ld-road-camera-card"><div class="ld-detail__live-card-head"><div><h3 data-lang-zh="鼻頭隧道口（W）" data-lang-en="Bitou Tunnel (W)">鼻頭隧道口（W）</h3><span class="ld-road-camera-meta" data-lang-zh="台2線 84K+792" data-lang-en="Provincial Highway 2 · 84K+792">台2線 84K+792</span></div><a href="https://tw.live/cam/?id=CCTV-14-0020-084-004" target="_blank" rel="noopener" data-lang-zh="備用來源" data-lang-en="Camera details">備用來源</a></div><div class="ld-detail__live-frame"><img data-camera-src="https://cctv-ss01.thb.gov.tw:443/T2-84K+792" alt="鼻頭隧道口西向即時影像" data-alt-zh="鼻頭隧道口西向即時影像" data-alt-en="Bitou Tunnel westbound live camera" loading="lazy" referrerpolicy="no-referrer"></div></article></div>`;
cameras.querySelector('.ld-road-camera-heading .ld-condition-eyebrow')?.remove();
const initialCards=[...cameras.querySelectorAll('.ld-road-camera-grid>article')];const initialGrid=cameras.querySelector('.ld-road-camera-grid');[initialCards[0],initialCards[2],initialCards[3],initialCards[1],initialCards[4]].forEach(card=>initialGrid.appendChild(card));
liveGrid.insertAdjacentElement('afterend',cameras);
const cameraStyle=document.createElement('style');cameraStyle.textContent=".ld-road-camera-card .ld-detail__live-frame,.ld-camera-net-frame{position:relative}\n.ld-camera-source{opacity:0}.ld-camera-source[data-camera-state=\"ready\"]{opacity:1}\n.ld-camera-source[hidden],.ld-camera-message[hidden],.ld-camera-net-frame iframe[hidden]{display:none!important}\n.ld-camera-message{position:absolute;inset:0;display:grid;place-content:center;margin:0;padding:18px;color:var(--gw-ink-detail,#adadad);font:400 var(--gw-type-detail,12px)/1.6 \"GW Avenir\",Arial,sans-serif;text-align:center;background:transparent}\n.ld-road-camera-section :is(.gw-offline-camera,.gw-offline-media),.ld-camera-net-frame>.gw-offline-media{display:none!important}\n.ld-road-camera-card button.ld-camera-expand{position:absolute;right:8px;bottom:8px;z-index:2;display:grid;place-items:center;width:36px;height:36px;margin:0;padding:8px;border:1px solid rgba(255,255,255,.25);border-radius:6px;background:rgba(0,0,0,.55);color:#fff;cursor:pointer}\n.ld-camera-expand svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.6}\n.ld-camera-expand:disabled{display:none!important}\n.ld-camera-viewer{box-sizing:border-box;width:100vw;max-width:none;height:100dvh;max-height:none;inset:0;margin:0;padding:16px;border:0;background:#0b0d0e;color:#ededed;overflow:hidden}\n.ld-camera-viewer[open]{display:flex;flex-direction:column;gap:12px}\n.ld-camera-viewer::backdrop{background:rgba(0,0,0,.85)}\n.ld-camera-viewer header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex:none;padding-top:env(safe-area-inset-top,0px)}\n.ld-camera-viewer h3{margin:0;color:inherit;font:400 14px/1.6 \"GW Avenir\",Arial,sans-serif}\n.ld-camera-viewer header button{display:grid;place-items:center;flex:none;width:40px;height:40px;padding:10px;border:0;background:transparent;color:inherit;cursor:pointer}\n.ld-camera-viewer header svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5}\n.ld-camera-viewer .ld-detail__live-frame{position:relative;flex:1;min-height:0;width:100%;height:100%;aspect-ratio:auto;display:grid;place-items:center;background:transparent}\n.ld-camera-viewer .ld-detail__live-frame :is(img,iframe){width:100%;height:100%;max-height:100%;object-fit:contain;border:0;position:absolute!important;inset:0;display:block;min-height:0!important;height:100%!important}\n.ld-camera-viewer .ld-camera-expand{display:none!important}\n.ld-camera-viewer .ld-camera-message{color:inherit}\nhtml[data-gw-theme=\"light\"] .ld-camera-viewer{background:#f6f7f3;color:#262626}\n\nhtml[data-ld-camera-open]{overflow:hidden!important}\n";document.head.appendChild(cameraStyle);
const cameraGrid=cameras.querySelector('.ld-road-camera-grid');
const isOffline=()=>navigator.onLine===false||document.documentElement.getAttribute('data-gw-offline')==='true';
const mediaControls=[];let orderLocked=false;
['pointerdown','touchstart','wheel','focusin'].forEach(name=>cameraGrid.addEventListener(name,()=>{orderLocked=true;},{passive:true}));
const cardList=[...cameraGrid.children];
function sortCameras(){
 if(orderLocked)return;
 cardList.forEach((card,index)=>{const state=card.dataset.cameraState;card.style.order=String((card.querySelector('iframe')?0:state==='ready'?10:state==='unavailable'?30:20)+index);});
}
function bindRoadCamera(image){
 const frame=image.closest('.ld-detail__live-frame'),card=image.closest('article'),source=image.dataset.cameraSrc;
 const message=document.createElement('p');message.className='ld-camera-message';message.setAttribute('role','status');frame.appendChild(message);image.classList.add('ld-camera-source');
 let state='idle',probeTimer=0,timeoutTimer=0,entered=false;
 const clear=()=>{clearTimeout(probeTimer);clearTimeout(timeoutTimer);};
 const text=(zh,en)=>{message.dataset.langZh=zh;message.dataset.langEn=en;message.textContent=root.dataset.language==='en'?en:zh;};
 const status=value=>{state=value;image.dataset.cameraState=value;card.dataset.cameraState=value;sortCameras();};
 function offline(){clear();status('offline');image.hidden=true;image.removeAttribute('src');message.hidden=false;text('此內容需要網路連線','This content requires an internet connection');}
 function ready(){if(isOffline()){offline();return;}if(state!=='loading'||!image.naturalWidth)return;clear();status('ready');image.hidden=false;message.hidden=true;}
 function unavailable(){if(isOffline()){offline();return;}if(state==='offline'||state==='idle')return;clear();status('unavailable');image.hidden=true;image.removeAttribute('src');message.hidden=false;text('影像來源暫時失效','Camera source temporarily unavailable');}
 function probe(){if(state!=='loading')return;if(image.naturalWidth>0)ready();else probeTimer=setTimeout(probe,500);}
 function start(){if(isOffline()){offline();return;}if(state!=='idle')return;status('loading');image.hidden=false;message.hidden=false;text('影像載入中…','Loading camera…');image.loading='eager';image.src=source;timeoutTimer=setTimeout(unavailable,16000);probe();}
 function sync(){if(isOffline())offline();else if(state==='offline'){status('idle');if(entered)start();else{message.hidden=false;text('影像載入中…','Loading camera…');}}}
 image.addEventListener('load',ready);image.addEventListener('error',unavailable);
 mediaControls.push(sync);image.dataset.cameraState='loading';text('影像載入中…','Loading camera…');
 if(isOffline())offline();
 if(typeof IntersectionObserver==='function'){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();entered=true;start();}},{rootMargin:'80px'});observer.observe(frame);}else{entered=true;start();}
}
cameras.querySelectorAll('img[data-camera-src]').forEach(bindRoadCamera);
// Offline messages also cover YouTube and the existing Windy embeds.
const embeds=[...cameras.querySelectorAll('iframe'),...liveGrid.querySelectorAll('iframe')];
embeds.forEach(iframe=>{const frame=iframe.parentElement,src=iframe.getAttribute('src'),message=document.createElement('p');frame.classList.add('ld-camera-net-frame');message.className='ld-camera-message';message.hidden=true;message.dataset.langZh='此內容需要網路連線';message.dataset.langEn='This content requires an internet connection';frame.appendChild(message);function sync(){const offline=isOffline();message.textContent=root.dataset.language==='en'?message.dataset.langEn:message.dataset.langZh;message.hidden=!offline;iframe.hidden=offline;if(offline)iframe.removeAttribute('src');else if(!iframe.getAttribute('src'))iframe.setAttribute('src',src);}mediaControls.push(sync);sync();});
const viewer=document.createElement('dialog');viewer.className='ld-camera-viewer';viewer.innerHTML='<header><h3></h3><button type="button" aria-label="關閉放大影像"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header>';
document.body.appendChild(viewer);let activeFrame=null,placeholder=null,activeButton=null,usedFullscreen=false;
function closeViewer(){if(viewer.open)viewer.close();}
viewer.querySelector('button').addEventListener('click',closeViewer);
viewer.addEventListener('cancel',event=>{event.preventDefault();closeViewer();});
viewer.addEventListener('close',()=>{document.documentElement.removeAttribute('data-ld-camera-open');if(activeFrame&&placeholder){placeholder.replaceWith(activeFrame);activeFrame=null;placeholder=null;}if(document.fullscreenElement===viewer)document.exitFullscreen().catch(()=>{});usedFullscreen=false;activeButton?.focus({preventScroll:true});});
document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===viewer)usedFullscreen=true;else if(usedFullscreen&&!document.fullscreenElement)closeViewer();});
cardList.filter(card=>!card.querySelector('iframe')).forEach(card=>{const frame=card.querySelector('.ld-detail__live-frame'),button=document.createElement('button');button.type='button';button.className='ld-camera-expand';button.title='放大觀看';button.setAttribute('aria-label','放大觀看');button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/></svg>';frame.appendChild(button);button.addEventListener('click',()=>{if(isOffline())return;activeButton=button;activeFrame=frame;placeholder=document.createElement('div');placeholder.style.aspectRatio='16/9';frame.replaceWith(placeholder);viewer.querySelector('h3').textContent=card.querySelector('h3').textContent;viewer.appendChild(frame);viewer.showModal();document.documentElement.setAttribute('data-ld-camera-open','');if(viewer.requestFullscreen){try{const pending=viewer.requestFullscreen();pending?.catch(()=>{});}catch(error){}}});});
function syncCameraNetwork(){mediaControls.forEach(sync=>sync());cameras.querySelectorAll('.ld-camera-expand').forEach(button=>button.disabled=isOffline());}
window.addEventListener('online',syncCameraNetwork);window.addEventListener('offline',syncCameraNetwork);
new MutationObserver(syncCameraNetwork).observe(document.documentElement,{attributes:true,attributeFilter:['data-gw-offline']});
document.addEventListener('ld-language-change',()=>{mediaControls.forEach(sync=>sync());const en=root.dataset.language==='en';cameras.querySelectorAll('.ld-camera-expand').forEach(b=>{b.title=en?'Enlarge camera':'放大觀看';b.setAttribute('aria-label',b.title);});viewer.querySelector('button').setAttribute('aria-label',en?'Close camera':'關閉放大影像');if(activeButton)viewer.querySelector('h3').textContent=activeButton.closest('article')?.querySelector('h3')?.textContent||viewer.querySelector('h3').textContent;});
syncCameraNetwork();sortCameras();

const syncCameraLanguage=()=>{const en=root.dataset.language==='en';cameras.querySelectorAll('[data-lang-en]').forEach(el=>el.textContent=en?el.dataset.langEn:el.dataset.langZh);cameras.setAttribute('aria-label',en?'Longdong and Highway 2 live cameras':'龍洞現場影像與台2線路口監視器');cameras.querySelectorAll('[data-title-en]').forEach(el=>el.title=en?el.dataset.titleEn:el.dataset.titleZh);cameras.querySelectorAll('[data-alt-en]').forEach(el=>el.alt=en?el.dataset.altEn:el.dataset.altZh)};
document.addEventListener('ld-language-change',syncCameraLanguage);syncCameraLanguage();
}
const css=document.createElement('style');css.textContent='.ld-condition-panel{--ld-state-coral:#f0b8a2;--ld-state-sand:#e7d39a;--ld-state-blue:#9fc6dc;--ld-state-unknown:#f5f5f5;max-width:1080px;margin:24px auto 0;padding:0 24px;border:0;border-radius:0;background:transparent}.ld-condition-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.ld-condition-title{margin:0;color:#f5f5f5;font-size:var(--gw-type-label,14px);font-weight:400;letter-spacing:0;line-height:1.45}.ld-condition-updated{color:rgba(245,245,245,.42);font-size:var(--gw-type-label,14px);line-height:1.45}.ld-condition-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.ld-condition-grid article{display:flex;min-width:0;min-height:98px;flex-direction:column;justify-content:space-between;gap:7px;padding:13px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(0,0,0,.28)}.ld-condition-grid .ld-condition-wind{min-height:118px}.ld-condition-wind-main{display:flex;min-width:0;align-items:center;gap:6px}.ld-condition-wind-main strong{font-size:var(--gw-type-value,20px)!important;white-space:normal;overflow-wrap:anywhere}.ld-condition-wind-main b{margin-left:0;color:rgba(245,245,245,.82);font-size:var(--gw-type-value,20px);font-weight:600;line-height:1.3;white-space:nowrap}.ld-condition-wind-arrow{display:grid;width:22px;height:22px;flex:none;place-items:center;color:#f5f5f5}.ld-condition-wind-arrow svg{width:20px;height:20px;fill:currentColor;transform:rotate(var(--wind-angle,0deg));transition:transform .25s ease}.ld-condition-wind-meter{height:3px;overflow:hidden;border-radius:4px;background:rgba(245,245,245,.12)}.ld-condition-wind-meter i{display:block;width:0;height:100%;border-radius:inherit;background:var(--ld-state-blue);transition:width .25s ease}.ld-condition-wind[data-level="noticeable"] .ld-condition-wind-meter i{background:var(--ld-state-sand)}.ld-condition-wind[data-level="strong"] .ld-condition-wind-meter i,.ld-condition-wind[data-level="high"] .ld-condition-wind-meter i{background:var(--ld-state-coral)}.ld-condition-grid small{color:rgba(245,245,245,.48);font-size:var(--gw-type-label,14px);line-height:1.45;letter-spacing:0}.ld-condition-grid strong{color:#f5f5f5;font-size:var(--gw-type-value,20px);font-weight:600;line-height:1.3;letter-spacing:-.01em}.ld-condition-grid span{color:rgba(245,245,245,.56);font-size:var(--gw-type-label,14px);line-height:1.45}.ld-condition-disclaimer{margin:12px 0 0;color:rgba(245,245,245,.48);font-size:11px;line-height:1.6}.ld-condition-disclaimer a{margin-left:5px;color:inherit;text-underline-offset:2px}.ld-condition-rock strong[data-level="wet"]{color:var(--ld-state-coral)}.ld-condition-rock strong[data-level="damp"]{color:var(--ld-state-sand)}.ld-condition-rock strong[data-level="dry"]{color:var(--ld-state-blue)}.ld-condition-grid .ld-condition-tide{min-height:158px;background:rgba(125,176,201,.08)!important}.ld-condition-tide-times{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:auto;padding-top:8px;border-top:1px solid rgba(245,245,245,.1)}.ld-condition-tide-times>div{display:flex;min-width:0;flex-direction:column;gap:3px}.ld-condition-tide-times i,.ld-condition-tide-last i{color:rgba(245,245,245,.48);font-size:var(--gw-type-label,14px);line-height:1.45;font-style:normal}.ld-condition-tide-times b{color:#f5f5f5;font-size:var(--gw-type-value,20px);font-weight:600;line-height:1.3}.ld-condition-tide-last{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px}.ld-condition-tide-last b{color:rgba(245,245,245,.82);font-size:var(--gw-type-value,20px);font-weight:600;line-height:1.3;white-space:nowrap}.ld-condition-tide [data-tide-state]{font-size:var(--gw-type-value,20px)}.ld-condition-tide [data-tide-state][data-state="rising"]{color:var(--ld-state-coral)}.ld-condition-tide [data-tide-state][data-state="falling"]{color:var(--ld-state-blue)}.ld-condition-wind[data-level="light"] [data-wind-feel],.ld-condition-wind[data-level="light"] [data-wind-speed]{color:var(--ld-state-blue)}.ld-condition-wind[data-level="noticeable"] [data-wind-feel],.ld-condition-wind[data-level="noticeable"] [data-wind-speed]{color:var(--ld-state-sand)}.ld-condition-wind[data-level="strong"] [data-wind-feel],.ld-condition-wind[data-level="high"] [data-wind-feel],.ld-condition-wind[data-level="strong"] [data-wind-speed],.ld-condition-wind[data-level="high"] [data-wind-speed]{color:var(--ld-state-coral)}.ld-condition-wind[data-level="unknown"] [data-wind-feel],.ld-condition-wind[data-level="unknown"] [data-wind-speed],.ld-condition-rock strong[data-level="unknown"],.ld-condition-tide [data-tide-state][data-state="unknown"]{color:var(--ld-state-unknown)}@media(max-width:980px){.ld-condition-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.ld-condition-title{font-size:var(--gw-type-label,14px)}.ld-condition-panel{margin-top:20px;padding:0 12px}.ld-condition-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ld-condition-grid article:not(.ld-condition-rock):not(.ld-condition-tide){min-height:118px}.ld-condition-tide,.ld-condition-rock{grid-column:1/-1;min-height:132px}}@media(max-width:380px){.ld-condition-grid strong{font-size:var(--gw-type-value,16px)}.ld-condition-grid article{padding:11px}}.ld-road-camera-section{grid-column:1/-1;margin:18px 0 0;padding:16px!important}.ld-road-camera-hint{display:none;margin:0 0 9px;color:rgba(245,245,245,.5);font-size:11px}.ld-road-camera-card{min-width:0;padding:11px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(0,0,0,.22)}.ld-road-camera-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:14px}.ld-road-camera-heading h3{margin:0;color:#f5f5f5;font-size:17px;font-weight:500}.ld-road-camera-heading p{margin:0;color:rgba(245,245,245,.55);font-size:12px;line-height:1.6}.ld-road-camera-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.ld-road-camera-card .ld-detail__live-card-head{align-items:flex-start}.ld-road-camera-card .ld-detail__live-card-head h3{font-size:14px}.ld-road-camera-meta{display:block;margin-top:4px;color:rgba(245,245,245,.52);font-size:11px}.ld-road-camera-card .ld-detail__live-frame{aspect-ratio:16/9}.ld-road-camera-card .ld-detail__live-caption{font-size:11px}.ld-road-camera-section a{flex:none}@media(max-width:760px){.ld-road-camera-heading{align-items:flex-start;flex-direction:column;gap:5px}.ld-road-camera-hint{display:block}.ld-road-camera-grid{display:flex;overflow-x:auto;gap:9px;padding:0 0 7px;scroll-snap-type:x mandatory;overscroll-behavior-inline:contain;scrollbar-width:none}.ld-road-camera-grid::-webkit-scrollbar{display:none}.ld-road-camera-card{flex:0 0 84%;max-width:360px;scroll-snap-align:start}}.ld-detail__live-card--weather{grid-column:1/-1}.ld-detail__live-card--weather .ld-detail__live-frame{aspect-ratio:2.05/1}@media(max-width:700px){.ld-detail__live-card--weather .ld-detail__live-frame{aspect-ratio:6/5}}';css.textContent += `
.ld-condition-panel{--ld-state-green:#a9d9b6;--ld-state-warning:#d97878}
main.ld-detail .ld-condition-panel .ld-condition-updated{color:var(--gw-ink-detail,rgba(245,245,245,.62))!important;font-size:var(--gw-type-detail,12px)!important;font-weight:400!important;line-height:1.6!important;letter-spacing:0!important}
.ld-condition-wind-divider{height:1px;margin:1px 0 0;background:rgba(245,245,245,.16)}
main.ld-detail .ld-condition-panel .ld-condition-wind-main{grid-template-columns:22px minmax(0,1fr)!important}
main.ld-detail .ld-condition-panel .ld-condition-wind-arrow{grid-row:1}
main.ld-detail .ld-condition-panel .ld-condition-wind-arrow[hidden]{display:none!important}
main.ld-detail .ld-condition-panel .ld-condition-wind[data-beaufort="0"] .ld-condition-wind-main,
main.ld-detail .ld-condition-panel .ld-condition-wind[data-level="unknown"] .ld-condition-wind-main{grid-template-columns:minmax(0,1fr)!important}
main.ld-detail .ld-condition-panel .ld-condition-wind[data-beaufort="0"] [data-wind-summary],
main.ld-detail .ld-condition-panel .ld-condition-wind[data-level="unknown"] [data-wind-summary]{grid-column:1!important}
main.ld-detail .ld-condition-panel .ld-condition-wind-main [data-wind-summary]{grid-row:1}
main.ld-detail .ld-condition-panel .ld-condition-wind[data-level="blue"] :is([data-wind-summary],.ld-condition-wind-arrow){color:var(--ld-state-blue)!important}
main.ld-detail .ld-condition-panel .ld-condition-wind[data-level="green"] :is([data-wind-summary],.ld-condition-wind-arrow){color:var(--ld-state-green)!important}
main.ld-detail .ld-condition-panel .ld-condition-wind[data-level="sand"] :is([data-wind-summary],.ld-condition-wind-arrow){color:var(--ld-state-sand)!important}
main.ld-detail .ld-condition-panel .ld-condition-wind[data-level="coral"] :is([data-wind-summary],.ld-condition-wind-arrow){color:var(--ld-state-coral)!important}
main.ld-detail .ld-condition-panel .ld-condition-wind[data-level="warning"] :is([data-wind-summary],.ld-condition-wind-arrow){color:var(--ld-state-warning)!important}
main.ld-detail .ld-condition-panel .ld-condition-wind-detail{color:var(--gw-ink-detail,rgba(245,245,245,.62))!important;font-size:var(--gw-type-detail,12px)!important;font-weight:400!important;line-height:1.6!important}
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="very-dry"]{color:var(--ld-state-green)!important}
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="dry"]{color:var(--ld-state-blue)!important}
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="slightly-dry"],
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="slightly-damp"],
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="greasy"]{color:var(--ld-state-sand)!important}
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="damp"],
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="condensing"]{color:var(--ld-state-coral)!important}
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="seeping"],
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="saturated"],
main.ld-detail .ld-condition-panel .ld-condition-rock strong[data-level="runoff"]{color:var(--ld-state-warning)!important}
`;
css.textContent+=`
main.ld-detail .ld-condition-panel .ld-condition-feels-current{min-width:0}
main.ld-detail .ld-condition-panel .ld-condition-feels-times{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border-top:1px solid rgba(245,245,245,.1)}
main.ld-detail .ld-condition-panel .ld-condition-feels-times>div{display:flex;min-width:0;flex-direction:column;gap:3px}
main.ld-detail .ld-condition-panel .ld-condition-feels-times i{color:var(--gw-ink-detail,rgba(245,245,245,.62));font-size:var(--gw-type-detail,12px);font-style:normal;font-weight:400;line-height:1.6}
main.ld-detail .ld-condition-panel .ld-condition-feels-times b{color:#f5f5f5;font-size:var(--gw-type-value,20px);font-weight:600;line-height:1.3}
@media(max-width:520px){main.ld-detail .ld-condition-panel .ld-condition-feels-times i{font-size:var(--gw-type-detail,10px)}}
`;
css.textContent+=`
/* Reading typography stays here; responsive row sizing is shared by all three Embeds. */
main.ld-detail .ld-condition-panel .ld-condition-tide-last :is(i,b,time),
main.ld-detail .ld-condition-panel .ld-condition-feels-current :is(i,b){
  color:var(--gw-ink-detail,rgba(245,245,245,.62))!important;
  font-size:var(--gw-type-detail,12px)!important;
  font-weight:400!important;font-style:normal!important;line-height:1.6!important;
}
main.ld-detail .ld-condition-panel .ld-condition-tide-clock{
  display:inline-flex!important;align-items:baseline!important;gap:2px!important;white-space:nowrap!important;
}
main.ld-detail .ld-condition-panel .ld-condition-tide-clock time{font:inherit!important;color:inherit!important}
main.ld-detail .ld-condition-panel .ld-condition-tide-offset{
  color:var(--gw-ink-detail,rgba(245,245,245,.62))!important;
  font-size:var(--gw-type-detail,12px)!important;font-weight:400!important;line-height:1.6!important;letter-spacing:0!important;
}
`;
css.textContent+='\n/* Wave values inherit the existing wind palette, with <=0.3m green. */\n.ld-condition-wave[data-level="green"]{--wave-color:var(--ld-state-green)}\n.ld-condition-wave[data-level="blue"]{--wave-color:var(--ld-state-blue)}\n.ld-condition-wave[data-level="sand"]{--wave-color:var(--ld-state-sand)}\n.ld-condition-wave[data-level="coral"]{--wave-color:var(--ld-state-coral)}\n.ld-condition-wave[data-level="warning"]{--wave-color:var(--ld-state-warning)}\n.ld-condition-wave[data-level="unknown"]{--wave-color:var(--gw-ink-detail)}\nmain.ld-detail .ld-condition-panel .ld-condition-wave>strong{color:var(--wave-color)!important;font-size:var(--gw-type-value)!important;font-weight:600!important;line-height:1.3!important}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-wave>.ld-condition-wave-detail{grid-row:3!important;align-self:start!important;color:var(--gw-ink-detail)!important;font-size:var(--gw-type-detail)!important;line-height:1.6!important}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-wave>.ld-condition-wave-source{grid-row:4!important;align-self:end!important;color:var(--gw-ink-detail)!important;font-size:var(--gw-type-detail)!important;line-height:1.6!important}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide .ld-condition-tide-last :is(i,b,time,small){font-size:var(--gw-type-detail,12px)!important;font-weight:400!important;line-height:1.6!important;color:var(--gw-ink-detail)!important;letter-spacing:0!important}\n';
css.textContent+="/* Tide range and predicted heights. Typography and palette match the approved preview. */\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide .ld-condition-tide-header{gap:8px}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide>.ld-condition-tide-reading{grid-row:2!important;display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 8px}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide-reading>[data-tide-state]{white-space:nowrap;font-size:var(--gw-type-value)!important}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide-reading>.ld-condition-tide-range{color:var(--ld-theme-text,#f5f5f5)!important;font-size:var(--gw-type-value)!important;font-weight:600;line-height:1.3}\n.ld-condition-tide-range:not(:empty)::before{content:'·';margin-right:8px;color:var(--gw-ink-detail);font-weight:400}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide-times{padding-top:10px!important;row-gap:8px;column-gap:10px}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide-times>div{display:grid;grid-row:span 3;grid-template-rows:subgrid;align-items:start;gap:4px}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide-times .ld-condition-tide-clock{display:flex!important;flex-wrap:wrap;column-gap:5px!important}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide-times .ld-condition-tide-height{color:var(--ld-theme-text,#f5f5f5)!important;font-size:var(--gw-type-label)!important;line-height:1.45!important;font-variant-numeric:tabular-nums;white-space:nowrap}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide>.ld-condition-tide-source{grid-row:4!important;align-self:end;display:flex;flex-direction:column;gap:3px}\nmain.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide-source>span{font-size:var(--gw-type-detail)!important;line-height:1.6!important;color:var(--gw-ink-detail)!important}\n@media(max-width:600px){main.ld-detail .ld-condition-panel.ld-condition-panel .ld-condition-tide>.ld-condition-tide-reading{column-gap:5px;row-gap:4px}.ld-condition-tide-range:not(:empty)::before{margin-right:5px}}\n";
document.head.appendChild(css);
const text=(selector,zh,en)=>{const el=widget.querySelector(selector);if(!el)return;el.textContent=root.dataset.language==='en'?en:zh};
function sunTimes(date,lat=25.1174,lon=121.9159){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date),part=k=>Number(parts.find(x=>x.type===k).value),year=part('year'),month=part('month'),day=part('day'),rad=Math.PI/180,n=Math.ceil((Date.UTC(year,month-1,day)-Date.UTC(year,0,0))/86400000),lngHour=lon/15,calc=rising=>{const t=n+((rising?6:18)-lngHour)/24,M=.9856*t-3.289,L=(M+1.916*Math.sin(M*rad)+.020*Math.sin(2*M*rad)+282.634)%360,RA=(Math.atan(.91764*Math.tan(L*rad))/rad+360)%360;let ra=(Math.floor(L/90)*90+RA-Math.floor(RA/90)*90)/15;const sinDec=.39782*Math.sin(L*rad),cosDec=Math.cos(Math.asin(sinDec)),cosH=(Math.cos(90.833*rad)-sinDec*Math.sin(lat*rad))/(cosDec*Math.cos(lat*rad));if(cosH>1||cosH< -1)return'--:--';const H=(rising?360-Math.acos(cosH)/rad:Math.acos(cosH)/rad)/15,solarTime=H+ra-.06571*t-6.622,local=(solarTime-lngHour+8+48)%24,h=Math.floor(local),m=Math.round((local-h)*60);return`${String(h).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`};return`${calc(true)} / ${calc(false)}`}
widget.querySelector('[data-sun]').textContent=sunTimes(new Date());
function walk(value,fn){if(!value)return;if(Array.isArray(value)){value.forEach(v=>walk(v,fn));return}if(typeof value==='object'){fn(value);Object.values(value).forEach(v=>walk(v,fn))}}
const val=x=>{if(x==null)return'';if(Array.isArray(x)){for(const item of x){const v=val(item);if(v!=='')return v}return''}if(typeof x==='object'){for(const key of ['ElementValue','elementValue','Value','value','ParameterValue','parameterValue'])if(x[key]!=null){const v=val(x[key]);if(v!=='')return v}for(const item of Object.values(x)){const v=val(item);if(v!=='')return v}return''}return x};
const num=x=>{const raw=val(x);if(raw==='T')return 0;const m=String(raw).match(/-?\d+(?:\.\d+)?/);if(!m)return null;const n=Number(m[0]);return n===-98?0:n<=-90?null:n};
function stationInfo(data){if(data&&Number.isFinite(Number(data.humidity)))return data;let out=null;walk(data,o=>{if(out)return;const id=o.StationId||o.StationID||o.stationId||o.stationID;if(id==='C0A950'||id==='C0A95'){const weather=o.WeatherElement||o.weatherElement||{},rain=o.RainfallElement||o.rainfallElement||{};let humidity=num(weather.RelativeHumidity??weather.relativeHumidity),temp=num(weather.AirTemperature??weather.airTemperature),windDirection=num(weather.WindDirection??weather.windDirection),windSpeed=num(weather.WindSpeed??weather.windSpeed),precip=num(rain.Past3hr?.Precipitation??rain.Past3hr?.precipitation??rain.Past6hr?.Precipitation??rain.Past6hr?.precipitation);if(humidity===null||temp===null||windDirection===null||windSpeed===null){walk(weather,e=>{const name=e.ElementName||e.elementName||'';if(humidity===null&&/RelativeHumidity|相對濕度|^RH$|^HUMD$/i.test(name))humidity=num(e.ElementValue??e.elementValue??e.value);if(temp===null&&/AirTemperature|氣溫|^T$/i.test(name))temp=num(e.ElementValue??e.elementValue??e.value);if(windDirection===null&&/WindDirection|風向|^WD$/i.test(name))windDirection=num(e.ElementValue??e.elementValue??e.value);if(windSpeed===null&&/WindSpeed|風速|^WS$/i.test(name))windSpeed=num(e.ElementValue??e.elementValue??e.value)})}if(humidity!==null&&humidity<=1)humidity*=100;out={humidity,temp,windDirection,windSpeed,precip,time:o.ObsTime?.DateTime||o.obsTime?.DateTime||''}}});return out}
function currentForecast(data){let humidity=null,feels=null;walk(data,o=>{if(o.ElementName||o.elementName){const name=o.ElementName||o.elementName,ts=o.Time||o.time||[];for(const t of ts){const values=t.ElementValue||t.elementValue||t.parameter||t.Parameter||[],v=Array.isArray(values)?values[0]:values;if(/相對濕度|RelativeHumidity|^RH$|^HUMD$/i.test(name)&&humidity===null)humidity=num(v);if(/體感溫度|ApparentTemperature|^AT$|^MaxAT$|^MinAT$/i.test(name)&&feels===null)feels=num(v)}}});return{humidity:humidity!==null&&humidity<=1?humidity*100:humidity,feels}}
function taipeiDay(value){const date=value instanceof Date?value:new Date(value);if(!Number.isFinite(date.getTime()))return'';const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date),part=type=>parts.find(item=>item.type===type)?.value||'';return part('year')+'-'+part('month')+'-'+part('day')}
const tempNum=value=>{const raw=val(value),match=String(raw).match(/-?\d+(?:\.\d+)?/);if(!match)return null;const n=Number(match[0]);return n>=-30&&n<=50?n:null};
function forecastDayRange(data){let location=null;walk(data?.records||data,o=>{if(location)return;const name=o.LocationName||o.locationName||'',id=o.LocationId||o.LocationID||o.locationId||o.locationID||o.ParameterSet?.Parameter?.ParameterValue||o.parameterSet?.parameter?.parameterValue||'';if((/^A018(?:00)?$/.test(String(id))||/龍洞灣公園|Longdong Bay Park/i.test(String(name)))&&Array.isArray(o.WeatherElement||o.weatherElement))location=o});if(!location)return{high:null,low:null};const today=taipeiDay(new Date()),range={high:null,low:null};for(const element of location.WeatherElement||location.weatherElement||[]){const name=String(element.ElementName||element.elementName||'');const kind=/最高溫|MaxTemperature/i.test(name)?'high':/最低溫|MinTemperature/i.test(name)?'low':null;if(!kind)continue;for(const period of element.Time||element.time||[]){const raw=period.StartTime||period.startTime||period.DataTime||period.dataTime||'';const date=/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)?raw:String(raw).replace(' ','T')+'+08:00';if(taipeiDay(date)!==today)continue;const n=tempNum(period.ElementValue??period.elementValue??period.Parameter??period.parameter);if(n===null)continue;range[kind]=range[kind]===null?n:(kind==='high'?Math.max(range[kind],n):Math.min(range[kind],n))}}return range}
function todayTemperatureRange(data){
 const forecast=forecastDayRange(data.fiveDay),today=taipeiDay(new Date());
 const candidates=[data.dailyTemperatureStation,data.station].filter(station=>{
  if(!station||taipeiDay(station.observedAt??station.time)!==today)return false;
  const stamp=Date.parse(station.observedAt??station.time),age=Date.now()-stamp;
  return Number.isFinite(stamp)&&age>=-900000&&age<=10800000;
 });
 function field(kind,key){
  if(forecast[kind]!==null)return {value:forecast[kind],forecast:true};
  for(const station of candidates){const value=tempNum(station[key]);if(value!==null)return {value,station};}
  return {value:null};
 }
 return {high:field('high','dailyHigh'),low:field('low','dailyLow')};
}
function temperatureSource(reading,en){
 if(reading.value===null)return en?'Today’s temperature data unavailable':'當日溫度資料暫缺';
 if(reading.forecast)return en?'Longdong Bay Park forecast':'龍洞灣公園預報';
 const station=reading.station,label=en?(station.stationId||station.stationName||'Nearby station'):(station.stationName||station.stationId||'鄰近測站');
 return en?label+' · observed today so far':label+' · 今日截至觀測時的高／低溫';
}
// CWA F-A0021-001: heights are cm above local mean sea level.
function tideForecast(data){
 let target=null;walk(data,o=>{if(target)return;const id=o.LocationId||o.locationId||o.StationId||o.stationId,name=o.LocationName||o.locationName||'';if(id==='A01400'||/龍洞南口/.test(name))target=o});
 const events=[],ranges={};if(!target)return{events,ranges};
 walk(target,day=>{
  const date=day.Date||day.date,rawRange=String(day.TideRange||day.tideRange||'').replace(/潮$/,'');
  if(/^\d{4}-\d{2}-\d{2}$/.test(date||'')&&['大','中','小'].includes(rawRange))ranges[date]=rawRange;
  const times=day.Time||day.time;if(!Array.isArray(times))return;
  times.forEach(row=>{
   const rawTime=row.DateTime||row.dateTime||row.DataTime||row.dataTime||row.TideTime||row.tideTime,params=row.Parameter||row.parameter||[],tide=row.Tide||row.tide||'';
   if(!rawTime)return;
   const detail=String(tide)+' '+(Array.isArray(params)?params.map(p=>`${p.ParameterName||p.parameterName||''} ${p.ParameterValue||p.parameterValue||''}`).join(' '):JSON.stringify(params));
   const kind=/滿潮|高潮|high/i.test(detail)?'high':/乾潮|低潮|low/i.test(detail)?'low':null;
   const time=/(?:Z|[+-]\d{2}:?\d{2})$/i.test(rawTime)?String(rawTime):String(rawTime).replace(' ','T')+'+08:00';
   if(!kind||!Number.isFinite(Date.parse(time)))return;
   const heights=row.TideHeights||row.tideHeights||{},raw=heights.AboveLocalMSL??heights.aboveLocalMSL;
   const heightCm=raw!=null&&String(raw).trim()!==''&&Number.isFinite(Number(raw))?Number(raw):null;
   events.push({time,kind,heightCm});
  });
 });
 return{events,ranges};
}
function mergeTideDisplayEvents(primary,history){
 const events=new Map();
 // History retains time/kind only; a current CWA event takes priority for height.
 for(const event of [...(history||[]),...primary]){
  const time=new Date(event.time);if(!Number.isFinite(time.getTime())||!['high','low'].includes(event.kind))continue;
  events.set(time.getTime()+':'+event.kind,{...event,time});
 }
 return[...events.values()].sort((a,b)=>a.time-b.time);
}
function tideHeightText(value){return typeof value==='number'&&Number.isFinite(value)?`${value>0?'+':value<0?'−':''}${(Math.abs(value)/100).toFixed(2)} m`:'—'}
// A cold full forecast can be slow. Repair only the small wave record once.
let wavePending=true,recoveryStarted=false,recoveredWave=null,waveRecoveryTimer=0;
function freshWave(wave){const stamp=Date.parse(wave?.observedAt),age=Date.now()-stamp;return wave?.status==='available'&&typeof wave.height==='number'&&Number.isFinite(wave.height)&&wave.height>=0&&wave.height<=40&&Number.isFinite(stamp)&&age>=-900000&&age<=10800000;}
function waveData(data={}){data=data||{};if(freshWave(recoveredWave)&&(!freshWave(data.wave)||Date.parse(recoveredWave.observedAt)>Date.parse(data.wave.observedAt)))return {...data,wave:recoveredWave};return data;}
function canRecoverWave(){return navigator.onLine!==false&&!window.GWOfflineDocument&&document.documentElement.getAttribute('data-gw-offline')!=='true';}
async function recoverWave(){
 if(recoveryStarted||!canRecoverWave()||freshWave(waveData(window.__longdongConditionData).wave))return;
 recoveryStarted=true;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
 try{
  const response=await fetch('https://cwa-weather.designchenme.workers.dev/api/longdong/wave',{headers:{Accept:'application/json'},cache:'no-store',signal:controller.signal});
  if(!response.ok)throw Error('wave');const result=await response.json();
  if(freshWave(result.wave)){recoveredWave=result.wave;if(window.__longdongConditionData)window.__longdongConditionData.wave=waveData(window.__longdongConditionData).wave;}
 }catch{}finally{clearTimeout(timer);wavePending=false;renderWave(waveData(window.__longdongConditionData),root.dataset.language==='en');}
}
function scheduleWaveRecovery(){clearTimeout(waveRecoveryTimer);if(!recoveryStarted&&canRecoverWave()&&!freshWave(waveData(window.__longdongConditionData).wave))waveRecoveryTimer=setTimeout(recoverWave,1500);}
function waveBand(height){return height<=.3?'green':height<.6?'blue':height<1.5?'sand':height<2.5?'coral':'warning'}
function renderWave(data,lang){
  const card=widget.querySelector('.ld-condition-wave'),wave=waveData(data).wave,stamp=Date.parse(wave?.observedAt),age=Date.now()-stamp;
  const valid=wave?.status==='available'&&typeof wave.height==='number'&&Number.isFinite(wave.height)&&wave.height>=0&&wave.height<=40&&Number.isFinite(stamp)&&age>=-900000&&age<=10800000;
  card.dataset.level=valid?waveBand(wave.height):'unknown';
  const label=valid?(wave.height<.6?(lang?'Wavelets':'小波'):wave.height<1.5?(lang?'Slight':'小浪'):wave.height<2.5?(lang?'Moderate':'中浪'):(lang?'Rough':'大浪')):(wavePending?(lang?'Loading…':'資料載入中'):(lang?'Unavailable':'資料暫缺'));
  card.querySelector('[data-wave-value]').textContent=valid?`${label} · ${wave.height.toFixed(1)}m`:label;
  const dirs={'北':'N','北北東':'NNE','東北':'NE','東北東':'ENE','東':'E','東南東':'ESE','東南':'SE','南南東':'SSE','南':'S','南南西':'SSW','西南':'SW','西南西':'WSW','西':'W','西北西':'WNW','西北':'NW','北北西':'NNW'};
  const period=valid&&typeof wave.meanPeriod==='number'&&wave.meanPeriod>0?String(wave.meanPeriod):'--';
  const direction=valid&&wave.direction?(lang?(dirs[wave.direction]||'--'):wave.direction+'浪'):(lang?'Direction unavailable':'浪向暫缺');
  card.querySelector('[data-wave-detail]').textContent=lang?`Mean period ${period} s · ${direction}`:`平均週期 ${period} 秒 · ${direction}`;
  let observed='';if(Number.isFinite(stamp))observed=new Intl.DateTimeFormat(lang?'en-GB':'zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Taipei'}).format(new Date(stamp));
  const stale=wave?.status==='stale'||Number.isFinite(stamp)&&age>10800000;
  if(!valid&&wavePending){card.querySelector('[data-wave-source]').textContent=lang?'Longdong buoy · Loading observation':'龍洞浮標 · 觀測資料載入中';return;}
  card.querySelector('[data-wave-source]').textContent=lang?`Longdong buoy · ${stale?'Data outdated':valid?'Observed '+observed:'Observation unavailable'}`:`龍洞浮標 · ${stale?'資料已過期':valid?'觀測 '+observed:'觀測資料暫缺'}`;
}
const beaufortLimits=[0.3,1.6,3.4,5.5,8,10.8,13.9,17.2,20.8,24.5,28.5,32.7,37,41.5,46.2,51,56.1];
const beaufortZh=['無風','軟風','輕風','微風','和風','清風','強風','疾風','大風','烈風','狂風','暴風'];
const beaufortEn=['Calm','Light air','Light breeze','Gentle breeze','Moderate breeze','Fresh breeze','Strong breeze','Near gale','Gale','Strong gale','Storm','Violent storm'];
function beaufortGrade(speed){if(speed==null||!Number.isFinite(Number(speed))||Number(speed)<0)return null;const grade=beaufortLimits.findIndex(limit=>Number(speed)<limit);return grade<0?17:grade}
function render(data){const current=currentForecast(data.threeHour),station=stationInfo(data.station),forecast=data.conditionsForecast||{},humidity=station?.humidity??forecast.humidity??current.humidity,feels=forecast.feels??current.feels,windDirection=station?.windDirection??forecast.windDirection??null,windSpeed=station?.windSpeed??forecast.windSpeed??null;widget.querySelector('[data-humidity]').textContent=humidity==null?'--%':`${Math.round(humidity)}%`;widget.querySelector('[data-feels]').textContent=feels==null?'--°':`${Math.round(feels)}°`;const currentTemp=tempNum(forecast.temperature)??tempNum(station?.temperature??station?.temp),dailyRange=todayTemperatureRange(data),todayHigh=dailyRange.high.value,todayLow=dailyRange.low.value;widget.querySelector('[data-current-temp]').textContent=currentTemp==null?'--°':`${Math.round(currentTemp)}°`;widget.querySelector('[data-today-high]').textContent=todayHigh==null?'--°':`${Math.round(todayHigh)}°`;widget.querySelector('[data-today-low]').textContent=todayLow==null?'--°':`${Math.round(todayLow)}°`;const lang=root.dataset.language==='en';widget.querySelector('[data-today-high]').title=temperatureSource(dailyRange.high,lang);widget.querySelector('[data-today-low]').title=temperatureSource(dailyRange.low,lang);
const windCard=widget.querySelector('.ld-condition-wind');
const windNote=windCard.querySelector('.ld-condition-wind-note');const forecastWind=station?.windSpeed==null&&forecast.windSpeed!=null;if(windNote){windNote.dataset.zh=forecastWind?'龍洞灣公園預報風速，海岸陣風可能更強':'氣象站平均風速，海岸陣風可能更強';windNote.dataset.en=forecastWind?'Longdong Bay Park forecast; coastal gusts may be stronger.':'Mean station wind; coastal gusts may be stronger.';windNote.textContent=lang?windNote.dataset.en:windNote.dataset.zh;}
const directionNames=lang?['N','NE','E','SE','S','SW','W','NW']:['北','東北','東','東南','南','西南','西','西北'];
const grade=beaufortGrade(windSpeed);
const band=grade==null?'unknown':(['sand','blue','green','blue','sand','coral'][grade]||'warning');
const windLabel=grade==null?(lang?'Wind unavailable':'風況資料暫缺'):grade<12?(lang?beaufortEn[grade]:beaufortZh[grade]):(lang?'Hurricane-force wind':'颶風級風');
const windBearing=windDirection==null?null:((Number(windDirection)%360)+360)%360;
const windIndex=windBearing==null?null:Math.round(windBearing/45)%8;
const direction=windIndex==null?(lang?'Direction unavailable':'風向暫缺'):directionNames[windIndex];
widget.querySelector('[data-wind-summary]').textContent=grade==null?windLabel:grade===0?windLabel:(lang?`${direction} · ${windLabel}`:`${direction}・${windLabel}`);
const gradeText=grade==null?'--':grade===17&&Number(windSpeed)>=61.3?(lang?'17+':'17級以上'):lang?String(grade):`${grade}級`;
const speedText=grade==null?'--':Number(windSpeed).toFixed(1);
widget.querySelector('[data-wind-detail]').textContent=lang?`Beaufort ${gradeText} · ${speedText} m/s`:`蒲福 ${gradeText}・${speedText} m/s`;
windCard.dataset.level=band;
windCard.dataset.beaufort=grade==null?'unknown':String(grade);
const arrow=widget.querySelector('[data-wind-arrow]');
arrow.hidden=grade==null||grade===0||windBearing==null;
if(!arrow.hidden)arrow.style.setProperty('--wind-angle',`${windBearing}deg`);
widget.querySelector('[data-humidity-source]').textContent=station?.humidity!=null?(lang?'Bitou Cape station':'鼻頭角站觀測'):(humidity!=null?(lang?'CWA forecast':'龍洞天氣預報'):(lang?'CWA data unavailable':'氣象署資料暫缺'));
const estimate=window.GWLongdongRockEstimate?.({...data,conditionsForecast:{...forecast,humidity:forecast.humidity??current.humidity}})||{level:'unknown',zh:'資料不足',en:'Insufficient data',windHistory:false};
const rock=widget.querySelector('[data-rock]');rock.dataset.level=estimate.level;rock.textContent=lang?estimate.en:estimate.zh;
const note=widget.querySelector('[data-rock-note]');
if(estimate.level==='greasy')note.textContent=lang?'Hot days and onshore wind; salinity unmeasured':'連日高溫與海風推估；未量測鹽分';
else if(estimate.level==='condensing')note.textContent=lang?'Humidity and cooling suggest condensation':'高濕與降溫推估；未量測岩面溫度';
else if(['seeping','saturated','runoff'].includes(estimate.level))note.textContent=lang?'Inferred from nearby heavy rain; check the wall':'依附近強降雨推估；請核對現場';
else note.textContent=estimate.windHistory?(lang?'Based on rain, humidity and 3h wind':'依雨量、濕度與近三小時風況推估'):(lang?'Based on rain and humidity; wind history pending':'依雨量與濕度推估；風況歷史不足');
renderWave(data,lang);
const now=new Date();
const tideForecastData=tideForecast(data.tides);
const uniqueEvents=mergeTideDisplayEvents(tideForecastData.events,data.tideHistory?.events);
const future=uniqueEvents.filter(event=>event.time>now),past=uniqueEvents.filter(event=>event.time<=now);
const nextHigh=future.find(event=>event.kind==='high'),nextLow=future.find(event=>event.kind==='low');
const previousHigh=past.filter(event=>event.kind==='high').pop(),previousLow=past.filter(event=>event.kind==='low').pop();
const tideState=widget.querySelector('[data-tide-state]');
const tideParts=event=>{
  if(!event)return{clock:'--:--',offset:''};
  const clock=new Intl.DateTimeFormat(lang?'en-GB':'zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Taipei'}).format(event.time);
  const dateValue=day=>{const [year,month,date]=day.split('-').map(Number);return Date.UTC(year,month-1,date)};
  const dayOffset=Math.round((dateValue(taipeiDay(event.time))-dateValue(taipeiDay(now)))/86400000);
  return{clock,offset:dayOffset>0?`+${dayOffset}`:dayOffset<0?String(dayOffset):''};
};
const tideMarkup=event=>{
  const {clock,offset}=tideParts(event);
  return `<time>${clock}</time>`+(offset?`<small class="ld-condition-tide-offset">${offset}</small>`:'');
};
const falling=future[0]?.kind==='low',firstKind=falling?'low':'high',secondKind=falling?'high':'low';
const firstEvent=firstKind==='high'?nextHigh:nextLow,secondEvent=secondKind==='high'?nextHigh:nextLow,lastEvent=falling?previousHigh:previousLow;
widget.querySelector('.ld-condition-tide-times').innerHTML=[{kind:firstKind,event:firstEvent},{kind:secondKind,event:secondEvent}].map(({kind,event})=>`<div><i>${kind==='high'?(lang?'Next high tide':'下一次滿潮'):(lang?'Next low tide':'下一次乾潮')}</i><b class="ld-condition-tide-clock">${tideMarkup(event)}</b><span class="ld-condition-tide-height">${tideHeightText(event?.heightCm)}</span></div>`).join('');
widget.querySelector('[data-tide-last-label]').textContent=falling?(lang?'Previous high tide':'上一次滿潮'):(lang?'Previous low tide':'上一次乾潮');
widget.querySelector('[data-tide-last-time]').innerHTML=tideMarkup(lastEvent);
widget.querySelector('[data-tide-last-time]').title=lastEvent?(lang?'CWA tide forecast':'氣象署潮汐預報'):(lang?'Previous-day tide forecast not yet retained':'尚未保存前一日潮汐預報');
tideState.textContent=future.length?(falling?(lang?'Falling tide':'正在退潮'):(lang?'Rising tide':'正在漲潮')):(lang?'Unavailable':'資料暫缺');
tideState.dataset.state=falling?'falling':future.length?'rising':'unknown';
const range=tideForecastData.ranges[taipeiDay(now)];
widget.querySelector('[data-tide-range]').textContent=range?(lang?{大:'Spring',中:'Intermediate',小:'Neap'}[range]:range+'潮'):(lang?'Range unavailable':'潮差暫缺');
const tideSource=widget.querySelector('[data-tide-date]');
tideSource.textContent=future.length?`${lang?'Longdong South':'龍洞南口'} · ${lang?'Forecast':'預報'}`:(lang?'Tide forecast unavailable':'潮汐資料暫時無法取得');
const updatedTime=new Intl.DateTimeFormat(lang?'en-GB':'zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Taipei'}).format(new Date(data.fetchedAt||Date.now()));
widget.querySelector('.ld-condition-updated').textContent=lang?'Updated '+updatedTime:'更新 '+updatedTime;
widget.querySelectorAll('[data-en]:not([data-tide-first-label]):not([data-tide-second-label])').forEach(el=>el.textContent=lang?el.dataset.en:el.dataset.zh||el.textContent);
}
widget.querySelectorAll('[data-en]').forEach(el=>el.dataset.zh=el.textContent);const refreshLanguage=()=>{widget.querySelectorAll('[data-en]').forEach(el=>el.textContent=root.dataset.language==='en'?el.dataset.en:el.dataset.zh);if(window.__longdongConditionData)render(window.__longdongConditionData);else renderWave(waveData(),root.dataset.language==='en')};document.addEventListener('ld-language-change',refreshLanguage);
fetch('https://cwa-weather.designchenme.workers.dev/api/longdong?conditions=23',{headers:{Accept:'application/json'},cache:'no-store'}).then(r=>r.json().then(d=>{if(!r.ok)throw Error(d.detail||d.error||r.status);return d})).then(data=>{data=waveData(data);window.__longdongConditionData=data;if(freshWave(data.wave)){wavePending=false;clearTimeout(waveRecoveryTimer);}else if(canRecoverWave()){scheduleWaveRecovery();}else wavePending=false;if(data.conditionsError)console.warn('CWA climbing conditions unavailable:',data.conditionsError);render(data)}).catch(()=>{widget.querySelector('[data-rock]').textContent=root.dataset.language==='en'?'Unavailable':'無法載入';widget.querySelector('[data-tide-date]').textContent=root.dataset.language==='en'?'Tide forecast unavailable':'潮汐資料暫時無法取得';if(canRecoverWave())scheduleWaveRecovery();else wavePending=false;renderWave(waveData(window.__longdongConditionData),root.dataset.language==='en')});
scheduleWaveRecovery();
window.addEventListener('pagehide',()=>clearTimeout(waveRecoveryTimer));
window.addEventListener('pageshow',scheduleWaveRecovery);
})();
