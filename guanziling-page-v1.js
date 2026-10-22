(() => {
 const local=location.protocol==='file:'||/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
 if(local)document.documentElement.classList.add('gw-local-font-preview');
 const base=local?'./':'https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/webflow-embeds/';
 
 const root=document.querySelector('[data-gz-detail]');if(!root)return;
 const setLanguage=lang=>{root.dataset.language=lang;root.querySelectorAll('[data-lang-zh][data-lang-en]').forEach(el=>el.textContent=el.dataset[lang==='en'?'langEn':'langZh']);root.querySelectorAll('[data-lang-choice]').forEach(b=>{const active=b.dataset.langChoice===lang;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',active)});root.querySelector('nav').setAttribute('aria-label',lang==='en'?'Guanziling page navigation':'關子嶺頁面導覽');document.dispatchEvent(new Event('gz-language-change'))};
 root.querySelectorAll('[data-lang-choice]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.langChoice)));setLanguage('zh');
 const links=[...root.querySelectorAll('[data-gz-link]')],sections=[...root.querySelectorAll('[data-gz-section]')],reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const active=id=>links.forEach(a=>{const yes=a.dataset.gzLink===id;a.classList.toggle('is-active',yes);if(yes)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 links.forEach(a=>a.addEventListener('click',ev=>{ev.preventDefault();const target=root.querySelector(a.getAttribute('href'));if(target){active(a.dataset.gzLink);target.scrollIntoView({block:'start',behavior:reduced.matches?'auto':'smooth'});history.replaceState(null,'',a.getAttribute('href'))}}));
 let pending=false;const sync=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{let current=sections[0];sections.forEach(s=>{if(s.getBoundingClientRect().top<=innerHeight*.38)current=s});const y=scrollY||document.documentElement.scrollTop,max=document.documentElement.scrollHeight-innerHeight;active(y<=24?'overview':max-y<=24?'weather':current.dataset.gzSection);pending=false})};addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync);sync();
 const camera=root.querySelector('[data-camera-stream]'),status=root.querySelector('[data-camera-status]');camera.addEventListener('error',()=>{status.hidden=false;status.dataset.langZh='影像暫時無法載入，請開啟公路局路況資訊。';status.dataset.langEn='Stream unavailable. Open the highway traffic service.';status.textContent=status.dataset[root.dataset.language==='en'?'langEn':'langZh']});
 
})();
