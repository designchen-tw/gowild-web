import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../longdong-conditions-widget-v35.js',import.meta.url),'utf8');
new vm.Script(source);
const walk=source.slice(source.indexOf('function walk('),source.indexOf('const val='));
const helpers=source.slice(source.indexOf('// CWA F-A0021-001:'),source.indexOf('// A cold full forecast'));
const stamp='2026-11-16T12:00:00+08:00';
class Clock extends Date{constructor(...args){super(...(args.length?args:[stamp]));}static now(){return Date.parse(stamp);}}
const ctx=vm.createContext({Date:Clock,Intl});vm.runInContext(walk+helpers,ctx);
const event=(time,tide,height)=>({DateTime:time,Tide:tide,TideHeights:{AboveLocalMSL:height,AboveChartDatum:999}});
const tides={records:{TideForecasts:[{Location:{LocationId:'A01800',TimePeriods:{Daily:[{Date:'2026-11-16',TideRange:'大',Time:[event('2026-11-16T15:18:00+08:00','滿潮',999)]}]}}},{Location:{LocationId:'A01400',TimePeriods:{Daily:[
 {Date:'2026-11-16',TideRange:'小',Time:[event('2026-11-16T05:46:00+08:00','乾潮',-45),event('2026-11-16T15:18:00+08:00','滿潮',15)]},
 {Date:'2026-11-17',TideRange:'中',Time:[event('2026-11-17T06:51:00+08:00','乾潮',-38)]}
]}}}]}};
ctx.data={tides,tideHistory:{events:[{time:'2026-11-16T07:18:00Z',kind:'high'},{time:'2026-11-15T23:00:00+08:00',kind:'high'}]}};
const forecast=vm.runInContext('tideForecast(data.tides)',ctx);
assert.equal(forecast.ranges['2026-11-16'],'小');assert.equal(forecast.ranges['2026-11-17'],'中');
assert.equal(forecast.events.length,3);assert.equal(forecast.events[1].heightCm,15);
const merged=vm.runInContext('mergeTideDisplayEvents(tideForecast(data.tides).events,data.tideHistory.events)',ctx);
assert.equal(merged.length,4);assert.equal(merged.find(e=>e.time.toISOString()==='2026-11-16T07:18:00.000Z').heightCm,15,'current forecast height must survive time-only history duplicate');
for(const [value,expected]of [[0,'0.00 m'],[15,'+0.15 m'],[-38,'−0.38 m'],[null,'—'],[undefined,'—'],[NaN,'—']]){ctx.value=value;assert.equal(vm.runInContext('tideHeightText(value)',ctx),expected);}
for(const height of [null,undefined,'',' ','-','invalid']){
 ctx.empty={records:{Location:{locationId:'A01400',Daily:[{date:'2026-11-16',tideRange:'小潮',time:[{dateTime:'2026-11-16T15:18:00',tide:'滿潮',tideHeights:{aboveLocalMSL:height}}]}]}}};
 const f=vm.runInContext('tideForecast(empty)',ctx);assert.equal(f.events[0].heightCm,null);assert.equal(f.ranges['2026-11-16'],'小');
}
ctx.empty.records.Location.Daily[0].time[0].tideHeights.aboveLocalMSL='0';assert.equal(vm.runInContext('tideForecast(empty).events[0].heightCm',ctx),0);
assert.equal(vm.runInContext('tideForecast({}).events.length',ctx),0);

const render=source.slice(source.indexOf('const now=new Date();\nconst tideForecastData='),source.indexOf('const updatedTime='));
function display(en){
 const fields=new Map();const widget={querySelector(selector){if(!fields.has(selector))fields.set(selector,{dataset:{},textContent:'',innerHTML:''});return fields.get(selector);}};
 const context=vm.createContext({Date:Clock,Intl,data:ctx.data,widget,lang:en,taipeiDay:date=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(date)});
 vm.runInContext(walk+helpers+render,context);return fields;
}
let fields=display(false);assert.equal(fields.get('[data-tide-range]').textContent,'小潮');assert.equal(fields.get('[data-tide-state]').textContent,'正在漲潮');
assert.match(fields.get('.ld-condition-tide-times').innerHTML,/>\+1<\/small>/);assert.match(fields.get('.ld-condition-tide-times').innerHTML,/\+0\.15 m/);assert.match(fields.get('.ld-condition-tide-times').innerHTML,/−0\.38 m/);
assert.doesNotMatch(fields.get('.ld-condition-tide-times').innerHTML,/明日|Tomorrow/);assert.equal(fields.get('[data-tide-date]').textContent,'龍洞南口 · 預報');
assert.match(fields.get('[data-tide-last-time]').innerHTML,/05:46/);
fields=display(true);assert.equal(fields.get('[data-tide-range]').textContent,'Neap');assert.equal(fields.get('[data-tide-state]').textContent,'Rising tide');assert.equal(fields.get('[data-tide-date]').textContent,'Longdong South · Forecast');
console.log('PASS: correct location, official range, cm-to-m conversion, signed/zero/missing values, casing, timezone, current forecast priority, bilingual display, original +1 layout and no duplicate retrieval timestamp.');
