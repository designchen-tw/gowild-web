import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import worker from '../cwa-weather-worker.js';
const NativeDate=Date;let now=NativeDate.parse('2026-10-27T15:10:00+08:00');globalThis.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}};
const row=height=>'<tr><th><a onclick="stations_profile(\'46694A\')">龍洞浮標<br>27日15時</a></th>'+['',height,'<span class="sr-only">東北</span>','6.6','5','','','','','','',''].map(x=>'<td>'+x+'</td>').join('')+'</tr>';
const cacheData=new Map(),kvData=new Map(),pending=[];globalThis.caches={default:{match:async r=>cacheData.get(r.url)?.clone(),put:async(r,v)=>cacheData.set(r.url,v.clone())}};
const env={CWA_API_KEY:'test-not-a-secret',CONDITIONS_HISTORY:{get:async k=>kvData.has(k)?JSON.parse(kvData.get(k)):null,put:async(k,v)=>kvData.set(k,v)}};const ctx={waitUntil:p=>pending.push(p)};
let marineCalls=0,weatherCalls=0,fail=false,missing=false,barrier=null;
const savedFetch=globalThis.fetch;globalThis.fetch=async input=>{if(String(input).includes('/OBS_Marine/')){marineCalls++;if(barrier)await barrier;if(fail)throw Error('timeout');return new Response(row(missing?'-':'1.8'));}weatherCalls++;return Response.json({success:true,records:{Station:[]}})};
const req=(path='/api/longdong/wave',origin='https://gowild.one')=>new Request('https://test.example'+path,{headers:{Origin:origin}});
let r=await worker.fetch(req(),env,ctx),d=await r.json();await Promise.all(pending);assert.equal(r.status,200);assert.equal(d.wave.height,1.8);assert.equal(weatherCalls,0);assert.equal(marineCalls,1);const originalStamp=d.wave.observedAt;
await worker.fetch(req(),env,ctx);assert.equal(marineCalls,1);assert(kvData.has('longdong:last-valid-wave:v1'));
cacheData.clear();fail=true;r=await worker.fetch(req(),env,ctx);d=await r.json();assert.equal(d.wave.height,1.8);assert.equal(d.wave.fallback,true);assert.equal(d.wave.observedAt,originalStamp);await Promise.all(pending);assert.equal(cacheData.size,1);
now+=4*3600000;r=await worker.fetch(req(),env,ctx);assert.equal(r.status,502);assert.equal(r.headers.get('Cache-Control'),'no-store');
now-=4*3600000;cacheData.clear();kvData.clear();fail=false;missing=true;r=await worker.fetch(req(),env,ctx);d=await r.json();assert.equal(d.wave.status,'unavailable');assert.equal(r.headers.get('Cache-Control'),'no-store');assert.equal(cacheData.size,0);
missing=false;r=await worker.fetch(req(),env,ctx);d=await r.json();assert.equal(d.wave.status,'available');await Promise.all(pending);
cacheData.clear();kvData.clear();let release;barrier=new Promise(r=>release=r);const before=marineCalls;const a=worker.fetch(req(),env,ctx),b=worker.fetch(req(),env,ctx);for(let i=0;i<12;i++)await Promise.resolve();assert.equal(marineCalls,before+1);release();await Promise.all([a,b]);barrier=null;await Promise.all(pending);
assert.equal((await worker.fetch(req('/api/longdong/wave','https://evil.example'),env,ctx)).status,403);
for(const crag of ['kenting','defulan','guanziling']){const before=marineCalls;await worker.fetch(req('/api/'+crag),env,ctx);await Promise.all(pending);assert.equal(marineCalls,before);}
globalThis.fetch=savedFetch;globalThis.Date=NativeDate;
// Exercise the actual UI wave-loading controller without the rest of the weather DOM.
const source=fs.readFileSync(new URL('../longdong-conditions-widget-v33.js',import.meta.url),'utf8');new vm.Script(source);
const section=source.slice(source.indexOf('// A cold full forecast'),source.indexOf('const beaufortLimits='));
function controller({offline=false,initial=null}={}){
 const timers=new Map(),fields=new Map();let id=0,calls=0;
 const wave={status:'available',observedAt:new NativeDate().toISOString(),height:.8,meanPeriod:6,direction:'東北'};
 const card={dataset:{},querySelector:s=>{if(!fields.has(s))fields.set(s,{textContent:''});return fields.get(s)}};
 const window={__longdongConditionData:initial,GWOfflineDocument:offline?{slug:'/longdong'}:null};
 const context=vm.createContext({window,root:{dataset:{language:'zh'}},widget:{querySelector:()=>card},navigator:{onLine:!offline},document:{documentElement:{getAttribute:()=>offline?'true':'false'}},AbortController,Date:NativeDate,Intl,console,setTimeout:(f,ms)=>{timers.set(++id,{f,ms});return id},clearTimeout:i=>timers.delete(i),fetch:async()=>{calls++;return Response.json({wave})}});vm.runInContext(section,context);return {context,fields,timers,window,card,calls:()=>calls,run:code=>vm.runInContext(code,context)};
}
let c=controller();c.run('renderWave({},false)');assert.equal(c.fields.get('[data-wave-value]').textContent,'資料載入中');c.run('scheduleWaveRecovery()');assert([...c.timers.values()].some(t=>t.ms===1500));await c.run('recoverWave()');assert.equal(c.calls(),1);assert.equal(c.fields.get('[data-wave-value]').textContent,'小浪 · 0.8m');await c.run('recoverWave()');assert.equal(c.calls(),1);assert.equal(c.run('waveData({wave:null}).wave.height'),.8);c.run('renderWave({wave:null},true)');assert.equal(c.fields.get('[data-wave-value]').textContent,'Slight · 0.8m');
c=controller({offline:true});c.run('scheduleWaveRecovery()');await c.run('recoverWave()');assert.equal(c.calls(),0);assert.equal(c.timers.size,0);
c=controller({initial:{wave:{status:'available',observedAt:new NativeDate().toISOString(),height:1,meanPeriod:6}}});c.run('scheduleWaveRecovery()');await c.run('recoverWave()');assert.equal(c.calls(),0);
console.log('PASS: wave-only API, positive 15-minute cache, preserved observation age, last-valid KV fallback, stale rejection, no negative caching, cold-request coalescing, CORS, other crags unchanged, loading state, one bounded recovery, no downgrade by late partial data, bilingual labels and no offline retry.');
