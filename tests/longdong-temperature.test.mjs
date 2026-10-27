import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../longdong-conditions-widget-v34.js',import.meta.url),'utf8');
new vm.Script(source);
const now=Date.parse('2026-10-27T17:10:00+08:00');const RealDate=Date;
class Clock extends RealDate{constructor(...args){super(...(args.length?args:[now]))}static now(){return now}}
const ctx=vm.createContext({Date:Clock,Intl});vm.runInContext(source.slice(source.indexOf('function walk('),source.indexOf('function tideEvents(')),ctx);
function run(data){ctx.data=data;return JSON.parse(vm.runInContext('JSON.stringify(todayTemperatureRange(data))',ctx))}
const row=(day,high,low)=>({LocationName:'龍洞灣公園',WeatherElement:[{ElementName:'最高溫度',Time:[{StartTime:day+'T00:00:00+08:00',ElementValue:{MaxTemperature:String(high)}}]},{ElementName:'最低溫度',Time:[{StartTime:day+'T00:00:00+08:00',ElementValue:{MinTemperature:String(low)}}]}]});
const station={stationId:'C0A950',stationName:'鼻頭角',observedAt:'2026-10-27T16:00:00+08:00',dailyHigh:null,dailyLow:null};
const nearby={stationId:'NEARBY',stationName:'鄰近測站',observedAt:'2026-10-27T16:00:00+08:00',dailyHigh:26.8,dailyLow:22.4};
let result=run({fiveDay:{records:{Location:[row('2026-10-28',30,25)]}},station,dailyTemperatureStation:nearby});
assert.equal(result.high.value,26.8);assert.equal(result.low.value,22.4);assert.equal(result.high.station.stationId,'NEARBY');
ctx.reading=result.high;assert.match(vm.runInContext('temperatureSource(reading,false)',ctx),/鄰近測站/);assert.match(vm.runInContext('temperatureSource(reading,true)',ctx),/observed today so far/);
result=run({fiveDay:{records:{Location:[row('2026-10-27',27,23)]}},station,dailyTemperatureStation:nearby});assert.equal(result.high.value,27);assert.equal(result.low.value,23);assert.equal(result.high.forecast,true);
result=run({station:{...nearby,observedAt:'2026-10-26T23:50:00+08:00'}});assert.equal(result.high.value,null);assert.equal(result.low.value,null);
result=run({station:{...nearby,observedAt:'2026-10-27T10:00:00+08:00'}});assert.equal(result.high.value,null);
result=run({station:{...nearby,dailyHigh:-99,dailyLow:-99}});assert.equal(result.high.value,null);assert.equal(result.low.value,null);
const byId=row('2026-10-27',28,21);delete byId.LocationName;byId.ParameterSet={Parameter:{ParameterValue:'A018'}};result=run({fiveDay:{records:{Location:[byId]}}});assert.equal(result.high.value,28);assert.equal(result.low.value,21);
console.log('PASS: tomorrow-only forecast fallback, explicit source text, today forecast priority, day rollover, stale/invalid observations and CWA ParameterSet location IDs.');
