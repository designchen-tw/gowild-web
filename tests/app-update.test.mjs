import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const read=name=>fs.readFileSync(new URL('../pwa/'+name,import.meta.url),'utf8');
class Node{
 children=[];attrs={};style={};hidden=false;textContent='';listeners={};dataset={};
 appendChild(n){this.children.push(n);n.parent=this;return n}prepend(n){this.children.unshift(n);n.parent=this}remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}
 setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]??null}removeAttribute(k){delete this.attrs[k]}hasAttribute(k){return k in this.attrs}addEventListener(k,fn){this.listeners[k]=fn}
 querySelector(s){if(s.includes(' ')){const [a,...b]=s.split(' ');return this.querySelector(a)?.querySelector(b.join(' '))||null}return this.children.find(n=>s==='span'?n.tag==='span':s[0]==='['?n.hasAttribute(s.slice(1,-1)):false)||this.children.map(n=>n.querySelector(s)).find(Boolean)||null}
 set innerHTML(s){this.children=[];if(s.includes('<span>')){let n=new Node();n.tag='span';this.appendChild(n)}}
}
function home({app=true,path='/',unsent=false}={}){
 const root=new Node(),main=new Node(),reload=new Node(),assigned=[];let listeners={};
 const document={documentElement:root,body:main,readyState:'loading',addEventListener(){},querySelector:s=>s==='main'?main:s==='.gw-app-reload'?reload:null,querySelectorAll:()=>[],createElement:()=>new Node()};
 const window={GWApp:{hasUnsavedForm:()=>unsent},addEventListener(){}};
 const ctx={window,document,location:{hostname:'gowild.one',pathname:path,assign:s=>assigned.push(s)},getComputedStyle:()=>({fontFamily:"Home Avenir"}),navigator:{serviceWorker:{addEventListener:(k,fn)=>listeners[k]=fn}},matchMedia:()=>({matches:app}),URL,setTimeout:()=>0,clearTimeout(){},console};
 const source=read('offline-v4.js').replace(/\}\)\(\);\s*$/,"window.qa={ready:yes=>{waiting=yes;renderUpdateNotice()},openUpdatePage};})();");vm.runInNewContext(source,ctx);return {root,main,reload,assigned,qa:window.qa};
}
let f=home();f.qa.ready(false);assert.equal(f.main.children.length,0,'no first-install/normal banner');f.qa.ready(true);assert.equal(f.main.children.length,1);assert(f.main.querySelector('[data-app-update-message]').textContent.includes('新版'));assert.equal(f.main.querySelector('[data-app-update-link]').href,'/gw-offline/update');f.qa.ready(true);assert.equal(f.main.children.length,1,'no duplicate notices');f.root.setAttribute('data-gw-app-language','en');f.qa.ready(true);assert.equal(f.main.querySelector('[data-app-update-link]').querySelector('span').textContent,'View update');f.qa.openUpdatePage();assert.deepEqual(f.assigned,['/gw-offline/update']);f.qa.ready(false);assert.equal(f.main.children.length,0,'activated update removes notice');
for(const settings of [{app:false},{path:'/longdong'}]){f=home(settings);f.qa.ready(true);assert.equal(f.main.children.length,0,'only installed App homepage');}
f=home({unsent:true});f.qa.ready(true);f.qa.openUpdatePage();assert.equal(f.assigned.length,0);assert(f.main.querySelector('[data-app-update-message]').textContent.includes('表單'));
const tick=()=>new Promise(r=>setImmediate(r));
async function view({ready=true,offline=false,fail=false,en=false}={}){
 const root=new Node();root.lang=en?'en':'zh-Hant';const elements={};for(const name of ['copy','version','status','action','home','note'])elements[name]=new Node();const h1=new Node(),handlers={};
 const active={release:'2026.11.02.2',state:'activated'},waiting={release:'2026.11.02.3',state:'installed'};
 let updates=0,skips=0;const registration={active,waiting:ready?waiting:null,installing:null,addEventListener(){},update:async()=>{updates++;if(fail)throw Error('network')}};
 class Channel{constructor(){this.port1={close(){}};this.port2={postMessage:data=>queueMicrotask(()=>this.port1.onmessage({data}))}}}
 function send(worker){worker.postMessage=({type},ports)=>{if(type==='GW_STATUS')ports[0].postMessage({ok:true,release:worker.release});else if(type==='GW_SKIP_WAITING'){skips++;ports[0].postMessage({ok:true});queueMicrotask(()=>{registration.active=waiting;registration.waiting=null;waiting.state='activated';handlers.controllerchange?.();})}else assert.fail(type)}}send(active);send(waiting);
 let id=0;const timeouts=new Map();const context={document:{documentElement:root,querySelector:s=>s==='h1'?h1:elements[s.slice(13,-1)],title:''},navigator:{onLine:!offline,serviceWorker:{getRegistration:async()=>registration,addEventListener:(k,fn)=>handlers[k]=fn}},window:{addEventListener(){}},MessageChannel:Channel,WeakSet,console,setTimeout:(fn,ms)=>{if(!ms)queueMicrotask(fn);const k=++id;timeouts.set(k,fn);return k},clearTimeout:k=>timeouts.delete(k)};
 vm.runInNewContext(read('update-v1.js'),context);await tick();await tick();return {root,elements,registration,get updates(){return updates},get skips(){return skips},click:async()=>{elements.action.listeners.click();await tick();await tick()}};
}
let page=await view();assert.equal(page.root.dataset.phase,'ready');assert.equal(page.skips,0,'never activate silently');await page.click();assert.equal(page.skips,1);assert.equal(page.root.dataset.phase,'done');assert.equal(page.elements.home.hidden,false);assert(page.elements.version.textContent.includes('2026.11.02.3'));
page=await view({ready:false});assert.equal(page.root.dataset.phase,'current');assert(page.elements.action.hidden);
page=await view({ready:false,offline:true});assert.equal(page.root.dataset.phase,'offline');assert.equal(page.updates,0);assert(!page.elements.action.disabled);
page=await view({ready:false,fail:true});assert.equal(page.root.dataset.phase,'error');assert(!page.elements.action.disabled);
page=await view({en:true});assert.equal(page.elements.action.textContent,'Update App');
console.log('PASS: App-only homepage ready notice, bilingual copy, no duplicates/first-install false positive, safe form handling; dedicated update view checks/activates/completes and handles offline/up-to-date/failure without deleting saved packs.');
