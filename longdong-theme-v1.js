/* Shared appearance preference; no widget reinitialization or data refresh. */
(function(){
 'use strict';
 if(window.GWLongdongTheme){window.GWLongdongTheme.sync();return;}
 var h=document.documentElement,r=document.querySelector('[data-ld-detail]');if(!r)return;
 h.setAttribute('data-gw-page-theme','longdong');
 var mode='dark';try{mode=window.GWColorTheme?window.GWColorTheme.get():localStorage.getItem('gw-color-theme-v1');}catch(e){}
 h.setAttribute('data-gw-theme',mode==='light'?'light':'dark');
 function sync(){
  var light=h.getAttribute('data-gw-theme')==='light',en=r.dataset.language==='en';
  var src='https://cdn.prod.website-files.com/6abb59dcfe815aa0c010d5c6/'+(light?'6ad9712cb9c80fb6fc1287b1_logo_GW-black.avif':'6ad9712b794a5603e6bb48f9_logo_GW-white.avif');
  document.querySelectorAll('.navigation.gw .logo-image.gw').forEach(function(img){if(img.getAttribute('src')!==src)img.setAttribute('src',src);img.removeAttribute('srcset');img.removeAttribute('sizes');});
  document.querySelectorAll('[data-gw-color-choice]').forEach(function(b){var l=b.getAttribute('data-gw-color-choice')==='light',label=en?(l?'Light mode':'Dark mode'):(l?'淺色模式':'深色模式');if(b.getAttribute('aria-label')!==label){b.setAttribute('aria-label',label);b.setAttribute('title',label);}});
  document.querySelectorAll('[data-gw-color-switch]').forEach(function(b){var label=en?'Choose appearance':'選擇顯示模式';if(b.getAttribute('aria-label')!==label)b.setAttribute('aria-label',label);});
 }
 window.GWLongdongTheme={sync:sync};
 new MutationObserver(sync).observe(h,{attributes:true,attributeFilter:['data-gw-theme']});
 new MutationObserver(sync).observe(r,{attributes:true,attributeFilter:['data-language']});
 window.addEventListener('storage',function(e){if(e.key==='gw-color-theme-v1'&&!window.GWColorTheme)h.setAttribute('data-gw-theme',e.newValue==='light'?'light':'dark');});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});
 sync();
})();
