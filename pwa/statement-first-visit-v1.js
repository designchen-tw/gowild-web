(function(scope){
  'use strict';
  const policy={
    shouldShow({app,home,seen,dismissed}){return !seen&&(app?!dismissed:home);},
    resolve({app,action,remember}){
      if(app&&action==='acknowledge')return {seen:true,dismissed:!!remember,leave:false};
      if(!app&&action==='agree')return {seen:true,dismissed:false,leave:false};
      if(!app&&action==='disagree')return {seen:false,dismissed:false,leave:true};
      return null;
    }
  };
  if(typeof module==='object'&&module.exports)module.exports=policy;
  else scope.GWStatementVisitPolicy=policy;
})(typeof window!=='undefined'?window:globalThis);

(function(){
  'use strict';
  const root=document.documentElement,policy=window.GWStatementVisitPolicy;
  const prefix='gw-statement-first-visit-v1:';
  function read(store,key){try{return store.getItem(prefix+key)==='1';}catch(error){return false;}}
  function write(store,key){try{store.setItem(prefix+key,'1');}catch(error){}}
  function init(){
    if(!policy||!window.GWStatementCopy||document.querySelector('.gw-first-visit'))return;
    const app=root.getAttribute('data-gw-app-display')==='standalone';
    const home=!!document.querySelector('[data-gw-home]'),key=app?'app-seen':'web-seen';
    // Preview preferences are intentionally isolated from the real website.
    const session=()=>{try{return window.sessionStorage;}catch(error){return null;}};
    const persistent=()=>{try{return window.localStorage;}catch(error){return null;}};
    if(!policy.shouldShow({app,home,seen:read(session(),key),dismissed:read(persistent(),'app-dismissed')}))return;
    const copy=window.GWStatementCopy,dialog=document.createElement('dialog');
    dialog.className='gw-statement-dialog gw-first-visit';
    dialog.setAttribute('aria-labelledby','gw-first-visit-title');
    dialog.innerHTML='<div class="gw-statement-scroll" tabindex="0" role="region" aria-labelledby="gw-first-visit-title" fs-scrolldisable-element="preserve"><header class="gw-statement-header"><div data-visit-mark></div><h2 id="gw-first-visit-title" tabindex="-1"></h2><div class="gw-first-visit-language" role="group" aria-label="語言"><button type="button" data-visit-language="zh">中文</button><button type="button" data-visit-language="en">EN</button></div></header><div class="gw-statement-intro"></div><div class="gw-statement-sections"></div></div><footer class="gw-first-visit-footer"><label class="gw-first-visit-remember"><input type="checkbox"><span></span></label><p class="gw-first-visit-note"></p><div class="gw-first-visit-actions"></div></footer>';
    const sourceIcon=document.querySelector('[data-gw-statement-open] svg');
    if(sourceIcon){const icon=sourceIcon.cloneNode(true);icon.setAttribute('class','gw-statement-mark');dialog.querySelector('[data-visit-mark]').appendChild(icon);}
    const scroll=dialog.querySelector('.gw-statement-scroll'),remember=dialog.querySelector('input'),rememberRow=remember.closest('label');
    const actions=dialog.querySelector('.gw-first-visit-actions'),note=dialog.querySelector('.gw-first-visit-note');
    const buttons=app?[['acknowledge','知道了','Got it']]:[['disagree','我不同意','I disagree'],['agree','我同意','I agree']];
    buttons.forEach(([action,zh,en])=>{const b=document.createElement('button');b.type='button';b.dataset.visitAction=action;b.dataset.zh=zh;b.dataset.en=en;actions.appendChild(b);});
    rememberRow.hidden=!app;
    let lastLanguage='',previousFocus=document.activeElement;
    function language(){
      const api=app?window.GWAppLanguage:window.GWSiteLanguage;
      return api?api.get():(root.lang==='en'?'en':'zh');
    }
    function paragraph(text){const p=document.createElement('p');p.textContent=text;return p;}
    function sync(){
      const lang=language()==='en'?'en':'zh',i=lang==='en'?1:0;
      if(lastLanguage===lang)return;lastLanguage=lang;dialog.lang=i?'en':'zh-Hant';
      dialog.querySelector('.gw-first-visit-language').setAttribute('aria-label',i?'Language':'語言');
      dialog.querySelectorAll('[data-visit-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.visitLanguage===lang)));
      dialog.querySelector('h2').textContent=copy.title[i];
      dialog.querySelector('.gw-statement-intro').replaceChildren(paragraph(copy.intro[i]));
      const sections=dialog.querySelector('.gw-statement-sections');sections.replaceChildren();
      copy.sections.forEach(item=>{const section=document.createElement('section'),h=document.createElement('h3');section.className='gw-statement-section';h.textContent=item.heading[i];section.appendChild(h);item.paragraphs.forEach(p=>section.appendChild(paragraph(p[i])));sections.appendChild(section);});
      rememberRow.querySelector('span').textContent=i?'Do not show this notice again':'不再顯示此提示';
      note.textContent=app?(i?'You can read this statement anytime under “Website Statement” in the menu.':'仍可隨時從選單中的「網站聲明」查看完整內容。'):(i?'If you disagree, you will return to the previous page. If there is no previous page, the website content will remain hidden.':'不同意將返回上一頁；若沒有上一頁，將停止顯示本站內容。');
      actions.querySelectorAll('button').forEach(b=>b.textContent=i?b.dataset.en:b.dataset.zh);
    }
    function release(){root.removeAttribute('data-gw-first-visit-open');if(dialog.open)dialog.close();}
    function stopContent(){
      release();
      const en=language()==='en',screen=document.createElement('main');screen.className='gw-first-visit-exit';
      const h=document.createElement('h1');h.textContent=en?'You have left the website':'已停止顯示本站內容';
      const p=paragraph(en?'There is no previous page to return to. You can close this tab or read the statement again.':'目前沒有可返回的上一頁。您可以關閉此頁，或重新閱讀網站聲明。');
      const b=document.createElement('button');b.type='button';b.textContent=en?'Read the statement again':'重新閱讀聲明';b.addEventListener('click',()=>location.reload());
      screen.append(h,p,b);document.body.replaceChildren(screen);
    }
    function leave(){
      // Hide content immediately. A direct home-screen launch may have no history.
      stopContent();if(history.length>1)history.back();
    }
    dialog.addEventListener('click',event=>{
      const toggle=event.target.closest('[data-visit-language]');
      if(toggle){const api=app?window.GWAppLanguage:window.GWSiteLanguage;if(api)api.set(toggle.dataset.visitLanguage);else root.lang=toggle.dataset.visitLanguage==='en'?'en':'zh-Hant';sync();return;}
      const button=event.target.closest('[data-visit-action]');if(!button)return;
      const result=policy.resolve({app,action:button.dataset.visitAction,remember:remember.checked});if(!result)return;
      if(result.leave){leave();return;}
      if(result.seen)write(session(),key);
      // Checking the box alone never suppresses the next prompt.
      if(result.dismissed)write(persistent(),'app-dismissed');
      release();if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});
    });
    dialog.addEventListener('cancel',event=>event.preventDefault());
    scroll.addEventListener('touchmove',event=>{if(dialog.open&&event.touches.length===1)event.stopPropagation();},{passive:true});
    new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['lang','data-gw-app-language']});
    window.addEventListener('pageshow',()=>{if(!dialog.isConnected){location.reload();return;}sync();if(policy.shouldShow({app,home,seen:read(session(),key),dismissed:read(persistent(),'app-dismissed')})&&!dialog.open){dialog.showModal();root.setAttribute('data-gw-first-visit-open','');}});
    document.body.appendChild(dialog);sync();dialog.showModal();root.setAttribute('data-gw-first-visit-open','');
    dialog.querySelector('h2').focus({preventScroll:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
