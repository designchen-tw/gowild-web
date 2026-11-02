import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../pwa/app-update-notice-v1.js',import.meta.url),'utf8');
const tick=()=>new Promise(r=>setImmediate(r));
async function fixture({release='2026.11.02.2',app=true,waiting=true}={}){
 const attrs={},children=[],assigned=[];let language='zh';
 const root={getAttribute:()=>language,hasAttribute:()=>false};
 const link={addEventListener:(k,fn)=>link[k]=fn},message={},label={};let banner;
 const registration={waiting:waiting?{}:null,installing:null,addEventListener(){},update:async()=>{}};
 const document={documentElement:root,readyState:'complete',body:{prepend:n=>children.push(n)},querySelector:()=>({}),createElement:()=>{banner={style:{},setAttribute(k,v){attrs[k]=v},querySelector:s=>s==='a'?link:s==='a span'?label:message,remove:()=>children.splice(children.indexOf(banner),1)};return banner}};
 const window={GWOffline:{release},GWApp:{hasUnsavedForm:()=>false}};
 vm.runInNewContext(source,{window,document,location:{hostname:'gowild.one',pathname:'/',assign:url=>assigned.push(url)},matchMedia:()=>({matches:app}),navigator:{onLine:true,serviceWorker:{getRegistration:async()=>registration,addEventListener(){}}},getComputedStyle:()=>({fontFamily:'Home Avenir'}),MutationObserver:class{observe(){}},setTimeout:fn=>queueMicrotask(fn)});await tick();
 return{children,message,label,link,assigned,root,window,registration,setEnglish:()=>{language='en';window.GWLegacyUpdateNotice?.refresh()}};
}
let f=await fixture();assert.equal(f.children.length,1);assert(f.message.textContent.includes('新版'));f.setEnglish();assert.equal(f.label.textContent,'View update');f.link.click({preventDefault(){}});assert.deepEqual(f.assigned,['/gw-offline/update']);f.registration.waiting=null;f.window.GWLegacyUpdateNotice.refresh();assert.equal(f.children.length,0);
for(const options of [{release:'2026.11.02.3'},{release:'2026.11.02.4'},{app:false},{waiting:false}]){f=await fixture(options);assert.equal(f.children.length,0)}
console.log('PASS: old footer-rewriting client receives ready notification; modern client owns one notice; browser/no-update remain quiet; bilingual link reaches update page.');
