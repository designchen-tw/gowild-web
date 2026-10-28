/* GO WILD Long Dong notices: collapsed slideshow and expandable list. */
(function(){
  'use strict';
  function init(){
  const card=document.querySelector('.ld-announcements');
  if(!card||window.GWLongdongAnnouncements)return;
  const root=card.closest('main'),list=card.querySelector('ol');
  if(!root||!list)return;
  const slides=[...list.children];
  if(slides.length<2)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let index=0,expanded=false,paused=reduced.matches,hovered=false,focused=false,visible=true,timer=0;
  const chevron='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';
  // Reuse saved markup when restoring an offline document; bind fresh events.
  const footer=card.querySelector('.ld-notice-footer')||document.createElement('div');footer.className='ld-notice-footer';
  footer.innerHTML='<div class="ld-notice-playback" role="group"><button type="button" data-notice-prev><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><span class="ld-notice-position"></span><button type="button" data-notice-next><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></div><button type="button" class="ld-notice-toggle" aria-expanded="false"><span></span>'+chevron+'</button><span class="ld-notice-sr" aria-live="polite"></span>';
  card.appendChild(footer);list.id='ld-notice-messages';
  const playback=footer.querySelector('.ld-notice-playback'),toggle=footer.querySelector('.ld-notice-toggle'),position=footer.querySelector('.ld-notice-position'),live=footer.querySelector('[aria-live]');
  toggle.setAttribute('aria-controls',list.id);
  const english=()=>root.dataset.language==='en';
  const copy=(zh,en)=>english()?en:zh;
  function stop(){clearTimeout(timer);timer=0;}
  function schedule(){stop();if(!expanded&&!paused&&!hovered&&!focused&&visible&&!document.hidden)timer=setTimeout(()=>{index=(index+1)%slides.length;render(true);},8000);}
  function render(animate=false){
    card.classList.toggle('is-collapsed',!expanded);
    slides.forEach((slide,i)=>{
      const active=expanded||i===index;
      slide.classList.toggle('is-current',i===index);
      slide.setAttribute('aria-hidden',String(!active));
      slide.inert=!active;
    });
    playback.hidden=expanded;
    playback.setAttribute('aria-label',copy('公告輪播控制','Notice slideshow controls'));
    toggle.setAttribute('aria-expanded',String(expanded));
    toggle.querySelector('span').textContent=expanded?copy('收合公告','Collapse notices'):copy('展開全部公告','Show all notices');
    footer.querySelector('[data-notice-prev]').setAttribute('aria-label',copy('上一則公告','Previous notice'));
    footer.querySelector('[data-notice-next]').setAttribute('aria-label',copy('下一則公告','Next notice'));
    position.textContent=(index+1)+' / '+slides.length;
    if(animate&&!reduced.matches&&slides[index].animate)slides[index].animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'ease-out'});
    schedule();
  }
  function step(direction){index=(index+direction+slides.length)%slides.length;render(true);live.textContent=slides[index].querySelector('strong').textContent;}
  footer.querySelector('[data-notice-prev]').addEventListener('click',()=>step(-1));
  footer.querySelector('[data-notice-next]').addEventListener('click',()=>step(1));
  toggle.addEventListener('click',()=>{expanded=!expanded;render();});
  card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;stop();}});
  card.addEventListener('pointerleave',()=>{hovered=false;schedule();});
  card.addEventListener('focusin',()=>{focused=true;stop();});
  card.addEventListener('focusout',event=>{if(!card.contains(event.relatedTarget)){focused=false;schedule();}});
  document.addEventListener('visibilitychange',schedule);
  window.addEventListener('pagehide',stop);
  window.addEventListener('pageshow',schedule);
  if(window.IntersectionObserver)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(card);
  new MutationObserver(()=>render()).observe(root,{attributes:true,attributeFilter:['data-language']});
  reduced.addEventListener('change',()=>{paused=reduced.matches;render();});
  window.GWLongdongAnnouncements={release:'2026.10.28.1'};
  render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
