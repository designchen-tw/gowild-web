/* Persistent appearance and optional mobile App homepage layout. No animation replacement. */
(function(){
 'use strict';
 if(window.GWColorTheme){window.GWColorTheme.sync();return;}
 var html=document.documentElement,key='gw-color-theme-v1',mode='system';
 var device=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)');
 var black='https://cdn.prod.website-files.com/6abb59dcfe815aa0c010d5c6/6ad9712cb9c80fb6fc1287b1_logo_GW-black.avif';
 var white='https://cdn.prod.website-files.com/6abb59dcfe815aa0c010d5c6/6ad9712b794a5603e6bb48f9_logo_GW-white.avif';
 var languageObserver=null,observedRoot=null,frame=0;
 function valid(value){return value==='system'||value==='dark'||value==='light';}
 function read(){try{var value=localStorage.getItem(key);mode=valid(value)?value:'system';localStorage.removeItem(key+'-day');}catch(error){}}
 function effective(){return mode==='system'?(device&&device.matches?'light':'dark'):mode;}
 function attr(node,name,value){if(node.getAttribute(name)!==value)node.setAttribute(name,value);}
 function home(){return html.getAttribute('data-gw-page-theme')==='home'||location.pathname.replace(/\/+$/,'')===''||!!document.querySelector('[data-gw-home]');}
 function sync(){
  if(frame){cancelAnimationFrame(frame);frame=0;}
  var isHome=home(),theme=effective();if(isHome)attr(html,'data-gw-page-theme','home');attr(html,'data-gw-theme',theme);
  var root=document.querySelector('[data-gw-home],main[data-language],main[lang],#outside-of-rock'),en=root&&(root.dataset.language==='en'||root.lang==='en');
  document.querySelectorAll('[data-gw-color-choice],[data-gw-color-mode]').forEach(function(button){
   var choice=button.getAttribute('data-gw-color-mode')||button.getAttribute('data-gw-color-choice');
   var label=(en?{system:'Follow device',dark:'Dark mode',light:'Light mode'}:{system:'跟隨裝置',dark:'深色模式',light:'淺色模式'})[choice];
   attr(button,'aria-pressed',String(choice===mode));attr(button,'aria-label',label);attr(button,'title',label);
  });
  document.querySelectorAll('[data-gw-color-switch]').forEach(function(group){attr(group,'aria-label',en?'Choose appearance':'選擇顯示模式');});
  document.querySelectorAll('.gw-menu-brand__logo').forEach(function(img){logo(img,theme);});
  if(isHome)document.querySelectorAll('.navigation.gw .logo-image.gw').forEach(function(img){logo(img,theme);});
  if(root&&root!==observedRoot){if(languageObserver)languageObserver.disconnect();observedRoot=root;languageObserver=new MutationObserver(schedule);languageObserver.observe(root,{attributes:true,attributeFilter:['data-language','lang']});}
 }
 function logo(img,theme){var url=theme==='light'?black:white;if(img.getAttribute('src')!==url)img.setAttribute('src',url);img.removeAttribute('srcset');img.removeAttribute('sizes');}
 function schedule(){if(frame)return;frame=requestAnimationFrame(function(){frame=0;sync();});}
 function set(next,persist){if(!valid(next))return;mode=next;if(persist)try{localStorage.setItem(key,next);localStorage.removeItem(key+'-day');}catch(error){}sync();}
 read();window.GWColorTheme={set:function(next){set(next,true);},get:effective,getMode:function(){return mode;},sync:sync};
 document.addEventListener('click',function(event){var button=event.target.closest&&event.target.closest('[data-gw-color-choice],[data-gw-color-mode]');if(!button)return;event.preventDefault();set(button.getAttribute('data-gw-color-mode')||button.getAttribute('data-gw-color-choice'),true);});
 window.addEventListener('storage',function(event){if(event.key!==key&&event.key!==null)return;read();sync();});
 function followDevice(){if(mode==='system')sync();}
 if(device){if(device.addEventListener)device.addEventListener('change',followDevice);else if(device.addListener)device.addListener(followDevice);}
 window.addEventListener('pageshow',function(){read();sync();});sync();
 var assembling=new MutationObserver(schedule);assembling.observe(html,{childList:true,subtree:true});
 function ready(){assembling.disconnect();sync();}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
(function(){
 'use strict';
 if(window.GWHomeLayout){window.GWHomeLayout.sync();return;}
 var root=document.documentElement,key='gw-home-compact-v1',compact=false,languageObserver=null,observedRoot=null;
 var phone=window.matchMedia('(max-width:767px), (pointer:coarse) and (orientation:landscape) and (max-height:600px)');
 var languageOrigin=null,languageBar=null;
 function read(){try{compact=localStorage.getItem(key)==='compact';}catch(error){}}
 function app(){return root.getAttribute('data-gw-app-display')==='standalone';}
 function active(){return app()&&compact&&phone.matches;}
 function sync(){
  root.setAttribute('data-gw-home-compact',String(app()&&compact));
  var home=document.querySelector('[data-gw-home]'),page=document.querySelector('main[data-language],main[lang],#outside-of-rock');
  var en=root.getAttribute('data-gw-app-language')==='en'||page&&(page.dataset.language==='en'||page.lang==='en');
  document.querySelectorAll('[data-gw-home-compact-toggle]').forEach(function(button){
   var label=en?'Compact homepage':'精簡首頁';button.setAttribute('aria-checked',String(compact));button.setAttribute('aria-label',label);var text=button.querySelector('[data-gw-home-compact-label]');if(text&&text.textContent!==label)text.textContent=label;
  });
  document.querySelectorAll('[data-gw-home-mode]').forEach(function(button){var choice=button.getAttribute('data-gw-home-mode'),label=en?(choice==='compact'?'Compact home':'Full home'):(choice==='compact'?'精簡首頁':'完整首頁');button.setAttribute('aria-pressed',String(choice===(compact?'compact':'full')));if(button.textContent!==label)button.textContent=label;});
  document.querySelectorAll('.gw-home-layout-switch').forEach(function(group){group.setAttribute('aria-label',en?'Homepage layout':'首頁顯示');});
  // Move the existing language control, retaining its translator and listeners.
  if(home){
   var control=home.querySelector('.gw-home__language');
   if(control&&!languageOrigin)languageOrigin=control.parentElement;
   if(control&&active()){
    if(!languageBar){languageBar=document.createElement('div');languageBar.className='gw-home__compact-language';home.insertBefore(languageBar,home.querySelector('#gw-home-discover'));}
    if(control.parentElement!==languageBar)languageBar.appendChild(control);
   }else if(control&&languageOrigin&&control.parentElement!==languageOrigin)languageOrigin.appendChild(control);
  }
  if(page&&page!==observedRoot){if(languageObserver)languageObserver.disconnect();observedRoot=page;languageObserver=new MutationObserver(sync);languageObserver.observe(page,{attributes:true,attributeFilter:['data-language','lang']});}
 }
 function refresh(){sync();if(window.GWHomeNativeScrollPin)window.GWHomeNativeScrollPin.refresh();window.dispatchEvent(new Event('gw-home-mode-change'));window.dispatchEvent(new Event('resize'));}
 function set(value){if(!app())return;compact=!!value;try{localStorage.setItem(key,compact?'compact':'full');}catch(error){}refresh();}
 read();window.GWHomeLayout={set:set,get:function(){return compact;},isCompact:active,sync:sync};sync();
 document.addEventListener('click',function(event){var button=event.target.closest&&event.target.closest('[data-gw-home-compact-toggle],[data-gw-home-mode]');if(button){event.preventDefault();var choice=button.getAttribute('data-gw-home-mode');set(choice?choice==='compact':!compact);}});
 window.addEventListener('storage',function(event){if(event.key===key||event.key===null){read();refresh();}});
 window.addEventListener('pageshow',function(){read();refresh();});
 if(phone.addEventListener)phone.addEventListener('change',refresh);else phone.addListener(refresh);
 new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-gw-app-language','data-gw-app-display']});
 var assembling=new MutationObserver(sync);assembling.observe(root,{childList:true,subtree:true});
 function ready(){assembling.disconnect();refresh();}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
(function(){
 'use strict';
 var html=document.documentElement;
 // The existing App footer already owns its language control and preference.
 if(html.getAttribute('data-gw-app-display')==='standalone'||window.GWSiteLanguage)return;
 var key='gw-site-language-v1',language='zh',page=null,observer=null;
 function read(){try{language=localStorage.getItem(key)==='en'?'en':'zh';}catch(error){}}
 function languageRoot(){return document.querySelector('[data-gw-home],[data-gw-course],[data-ld-detail],[data-df-detail],[data-kd-detail],[data-gz-detail],[data-ld-photo],[data-gw-resole],#outside-of-rock,main[data-language],main[lang]');}
 function apply(){
  var controls=document.querySelectorAll('[data-gw-site-language]');if(!controls.length)return;
  html.setAttribute('data-gw-menu-language','');
  controls.forEach(function(button){button.setAttribute('aria-pressed',String(button.getAttribute('data-gw-site-language')===language));});
  document.querySelectorAll('.gw-site-language-switch').forEach(function(group){group.setAttribute('aria-label',language==='en'?'Language':'語言');});
  var current=languageRoot();
  if(current&&current!==page){if(observer)observer.disconnect();page=current;observer=new MutationObserver(apply);observer.observe(page,{attributes:true,attributeFilter:['data-language','lang']});}
  if(page){
   var selector='[data-home-language="'+language+'"],[data-lang-choice="'+language+'"],[data-course-language="'+language+'"],[data-photo-language="'+language+'"],[data-sr-language="'+language+'"],button[data-language="'+language+'"]';
   var button=page.querySelector(selector),actual=page.dataset.language||(page.lang==='en'?'en':'zh');
   if(button&&actual!==language)button.click();
  }
  document.documentElement.lang=language==='en'?'en':'zh-Hant';
 }
 function set(value){if(value!=='zh'&&value!=='en')return;language=value;try{localStorage.setItem(key,value);}catch(error){}apply();}
 read();window.GWSiteLanguage={set:set,get:function(){return language;},sync:apply};
 document.addEventListener('click',function(event){var button=event.target.closest&&event.target.closest('[data-gw-site-language]');if(button){event.preventDefault();set(button.getAttribute('data-gw-site-language'));}});
 window.addEventListener('storage',function(event){if(event.key===key||event.key===null){read();apply();}});
 window.addEventListener('pageshow',function(){read();apply();});window.addEventListener('load',apply,{once:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
(function(){
 'use strict';
 if(window.GWMenuTools){window.GWMenuTools.sync();return;}
 function sync(){var panel=document.querySelector('.gw-menu-panel'),row=panel&&panel.querySelector('.gw-menu-tools');if(!row)return;panel.querySelectorAll(':scope > .gw-app-install-entry').forEach(function(button){row.appendChild(button);});}
 function ready(){var panel=document.querySelector('.gw-menu-panel');if(!panel)return;sync();new MutationObserver(sync).observe(panel,{childList:true});}
 window.GWMenuTools={sync:sync};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
(function(){
 'use strict';
 if(window.GWMenuSwitches){window.GWMenuSwitches.sync();return;}
 var panel=null,frame=0;
 function measure(){
  frame=0;if(!panel)return;
  panel.querySelectorAll('.gw-color-switch,.gw-site-language-switch,.gw-app-language-switch,.gw-home-layout-switch').forEach(function(group){
   group.classList.add('gw-control-switch');var button=group.querySelector('button[aria-pressed="true"]');if(!button||!button.offsetWidth)return;
   var x=button.offsetLeft+'px',width=button.offsetWidth+'px';
   if(group.style.getPropertyValue('--gw-switch-x')!==x)group.style.setProperty('--gw-switch-x',x);
   if(group.style.getPropertyValue('--gw-switch-w')!==width)group.style.setProperty('--gw-switch-w',width);
   if(!group.hasAttribute('data-gw-switch-ready'))requestAnimationFrame(function(){group.setAttribute('data-gw-switch-ready','');});
  });
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
 function ready(){
  panel=document.querySelector('.gw-menu-panel');if(!panel)return;
  new MutationObserver(schedule).observe(panel,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed']});
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-gw-menu-open']});
  var overlay=panel.closest('.mobile-overlay.gw');if(overlay){var display=overlay.style.display;new MutationObserver(function(){if(display!==overlay.style.display){display=overlay.style.display;schedule();}}).observe(overlay,{attributes:true,attributeFilter:['style']});}
  window.addEventListener('resize',schedule);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(schedule);schedule();
 }
 window.GWMenuSwitches={sync:schedule};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
