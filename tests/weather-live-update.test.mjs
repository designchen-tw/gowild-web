import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const old={threeHour:{},fetchedAt:'2026-11-02T08:00:00Z'},fresh={threeHour:{},fetchedAt:'2026-11-02T09:00:00Z'};
for(const name of ['longdong-conditions-widget-v39.js','longdong-cwa-widget-v18.js','climbing-conditions-widget-v8.js','weather-card-widget-v9.js']){
 const source=fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');new vm.Script(source);
 const first=source.indexOf(name.startsWith('climbing-')?'    const liveWeatherKey=':'const liveWeatherKey=');
 const end=name.startsWith('climbing-')?source.indexOf('    request(root.dataset.conditionEndpoint).then(acceptLiveWeather)',first):source.indexOf(name.startsWith('longdong-conditions')?"fetch('https://cwa-weather":"fetch(API_URL",first);
 assert(first>=0&&end>first,name);const handlers={},rendered=[];const context=vm.createContext({window:{GWWeatherLatest:new Map([['/api/longdong',fresh]])},document:{addEventListener:(type,fn)=>handlers[type]=fn},root:{dataset:{conditionEndpoint:'/api/longdong'}},API_URL:'https://cwa-weather.designchenme.workers.dev/api/longdong',Date,URL,onRender:d=>rendered.push(d),waveData:d=>d,freshWave:()=>false,canRecoverWave:()=>false,clearTimeout(){},console});
 vm.runInContext("let latest=null,latestForecast=null,wavePending=false,waveRecoveryTimer=null;function render(data){latest=data;onRender(data)}function refreshForecast(){render(latestForecast)};"+source.slice(first,end),context);
 assert.equal(rendered.length,1,name+' replays a fresh response that arrived before the widget');
 handlers['gw-weather-data']({detail:{key:'/api/longdong',data:old}});assert.equal(rendered.length,1,name+' must not let a late cached fetch overwrite fresh data');
 handlers['gw-weather-data']({detail:{key:'/api/defulan',data:{...fresh,fetchedAt:'2026-11-02T10:00:00Z'}}});assert.equal(rendered.length,1,name+' ignores another crag');
 handlers['gw-weather-data']({detail:{key:'/api/longdong',data:{...fresh,fetchedAt:'2026-11-02T10:00:00Z'}}});assert.equal(rendered.length,2,name+' updates in place');
}
console.log('PASS: all four condition/forecast helpers replay early recovery, ignore older cached data and other crags, render newer data in place.');
