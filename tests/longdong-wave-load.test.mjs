import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import worker from '../cwa-weather-worker.js';
const NativeDate=Date;let now=NativeDate.parse('2026-10-27T15:10:00+08:00');globalThis.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}};
const row=height=>'<tr><th><a onclick="stations_profile(\'46694A\')">龍洞浮標<br>27日15時</a></th>'+['',height,'<span class="sr-only">東北</span>','6.6','5','','','','','','',''].map(x=>'<td>'+x+'</td>').join('')+'</tr>';
const cacheData=new Map(),kvData=new Map(),pending=[];globalThis.caches={default:{match:async r=>cacheData.get(r.url)?.clone(),put:async(r,v)=>cacheData.set(r.url,v.clone())}};
const env={CWA_API_KEY:'test-not-a-secret',CONDITIONS_HISTORY:{get:async k=>kvData.has(k)?JSON.parse(kvData.get(k)):null,put:async(k,v)=>kvData.set(k,v)}};const ctx={waitUntil:p=>pending.push(p)};
let marineCalls=0,weatherCalls=0,fail=false,missing=false,barrier=null,weatherData={success:true,records:{Station:[]}};
const savedFetch=globalThis.fetch;globalThis.fetch=async input=>{if(String(input).includes('/OBS_Marine/')){marineCalls++;if(barrier)await barrier;if(fail)throw Error('timeout');return new Response(row(missing?'-':'1.8'));}weatherCalls++;return Response.json(weatherData)};
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
// Forecast selection preserves first matching location and both CWA key casings.
const element=(name,value)=>({ElementName:name,Time:[{StartTime:new Date(now).toISOString(),ElementValue:[{Value:value}]}]});
for(const key of ['LocationName','locationName']){
 cacheData.clear();weatherData={success:true,records:{Location:[
  {[key]:'其他地點',WeatherElement:[element('RelativeHumidity',95)]},
  {[key]:'龍洞灣公園',WeatherElement:[element('RelativeHumidity',84),element('Temperature',26)]},
  {[key]:'龍洞灣公園',WeatherElement:[element('RelativeHumidity',55)]}
 ]}};
 const data=await(await worker.fetch(req('/api/longdong'),env,ctx)).json();await Promise.all(pending);
 assert.equal(data.conditionsForecast.locationName,'龍洞灣公園');assert.equal(data.conditionsForecast.humidity,84);assert.equal(data.conditionsForecast.temperature,26);
}
cacheData.clear();weatherData={success:true,records:{Location:[{LocationName:'其他地點',WeatherElement:[element('RelativeHumidity',95)]}]}};
const noMatch=await(await worker.fetch(req('/api/longdong'),env,ctx)).json();await Promise.all(pending);assert.equal(noMatch.conditionsForecast.humidity,null);assert.equal(noMatch.conditionsForecast.locationName,undefined);
console.log('PASS: uppercase/lowercase CWA location names, first matched forecast row, values preserved and absent-location fallback.');
// Prefer the configured station when valid; otherwise use the nearest fresh
// station within 15km from the SAME observation response, with no new fetch.
function stationRecord(id,lat,high,low,stamp=new Date(now).toISOString()){
 return {StationId:id,StationName:id,GeoInfo:{Coordinates:[{CoordinateName:'WGS84',StationLatitude:String(lat),StationLongitude:'121.919'}]},ObsTime:{DateTime:stamp},WeatherElement:{AirTemperature:'23',RelativeHumidity:'80',DailyExtreme:{DailyHigh:{TemperatureInfo:{AirTemperature:String(high)}},DailyLow:{TemperatureInfo:{AirTemperature:String(low)}}}}};
}
cacheData.clear();weatherData={success:true,records:{Station:[
 stationRecord('C0A950',25.111,-99,-99),
 stationRecord('STALE',25.112,30,20,new Date(now-4*3600000).toISOString()),
 stationRecord('DISTANT',24.5,30,20),
 stationRecord('NEAREST',25.12,26.8,22.4),
 stationRecord('FARTHER',25.14,28,24)
]}};
const temperatureCalls=weatherCalls;
let temperaturePayload=await(await worker.fetch(req('/api/longdong'),env,ctx)).json();await Promise.all(pending);
assert.equal(temperaturePayload.station.stationId,'C0A950');assert.equal(temperaturePayload.station.dailyHigh,null);
assert.equal(temperaturePayload.dailyTemperatureStation.stationId,'NEAREST');assert.equal(temperaturePayload.dailyTemperatureStation.dailyHigh,26.8);assert.equal(temperaturePayload.dailyTemperatureStation.dailyLow,22.4);
assert.equal(temperaturePayload.dailyTemperatureStation.observedAt,new Date(now).toISOString());
assert.equal(weatherCalls-temperatureCalls,5,'temperature fallback must reuse existing observations');
cacheData.clear();weatherData.records.Station[0]=stationRecord('C0A950',25.111,27.1,23.2);
temperaturePayload=await(await worker.fetch(req('/api/longdong'),env,ctx)).json();await Promise.all(pending);assert.equal(temperaturePayload.dailyTemperatureStation.stationId,'C0A950');
cacheData.clear();weatherData.records.Station=[stationRecord('YESTERDAY',25.12,29,22,new Date(now-24*3600000).toISOString())];
temperaturePayload=await(await worker.fetch(req('/api/longdong'),env,ctx)).json();await Promise.all(pending);assert.equal(temperaturePayload.dailyTemperatureStation,null);
console.log('PASS: nested daily extremes, nearby fresh temperature fallback, preferred station preservation, stale/out-of-range rejection and no added CWA requests.');
globalThis.fetch=savedFetch;globalThis.Date=NativeDate;
// Exercise the actual UI wave-loading controller without the rest of the weather DOM.
const source=fs.readFileSync(new URL('../longdong-conditions-widget-v34.js',import.meta.url),'utf8');new vm.Script(source);
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
