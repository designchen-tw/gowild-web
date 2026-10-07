(()=>{
const card=document.querySelector('[data-cwa-location][data-cwa-endpoint]');if(!card)return;
const pageRoot=card.closest('[data-kd-detail],[data-df-detail]'),prefix=pageRoot?.hasAttribute('data-kd-detail')?'kd-detail':'df-detail';
const API_URL='https://cwa-weather.designchenme.workers.dev'+card.dataset.cwaEndpoint;
const q=name=>card.querySelector('.'+prefix+'__'+name),qa=name=>[...card.querySelectorAll('.'+prefix+'__'+name)];
const note=q('cwa-note');
const conditionEl=q('cwa-condition');
const noteZh='資料每 15 分鐘更新；出發前仍請確認官方公告與現場狀況。';
const noteEn='Forecast data refreshes every 15 minutes. Check official notices and on-site conditions before setting out.';
const failZh='天氣資料暫時無法載入，請稍後再試或查看中央氣象署。';
const failEn='Forecast data is temporarily unavailable. Please try again or check the CWA website.';
const setNote=(zh,en)=>{if(!note)return;const lang=pageRoot?.dataset.language||'zh';note.textContent=lang==='en'?en:zh;note.dataset.langZh=zh;note.dataset.langEn=en};
const setCondition=(zh,en)=>{if(!conditionEl)return;const lang=pageRoot?.dataset.language||'zh';conditionEl.dataset.langZh=zh;conditionEl.dataset.langEn=en;conditionEl.textContent=lang==='en'?en:zh};
const flattenLocations=data=>{
const found=[];const visit=value=>{if(!value)return;if(Array.isArray(value)){value.forEach(visit);return}if(typeof value!=='object')return;const name=value.LocationName||value.locationName,weather=value.WeatherElement||value.weatherElement;if(name&&Array.isArray(weather))found.push({...value,LocationName:name,LocationId:value.LocationId||value.locationId,WeatherElement:weather});Object.values(value).forEach(visit)};visit(data?.records||data);return found;
};
const parseRows=data=>{
const locations=flattenLocations(data);
const wanted=card.dataset.cwaLocation||'';const loc=locations.find(x=>String(x.LocationId||x.LocationID||x.locationId||'')===wanted||String(x.LocationName||'').includes(wanted));
if(!loc)return[];
const rows=new Map();
(loc.WeatherElement||[]).forEach(el=>{
(el.Time||el.time||[]).forEach((period,index)=>{
const start=period.StartTime||period.startTime||period.DataTime||period.dataTime||`period-${index}`;
const key=String(start);
const name=el.ElementName||el.elementName||'',end=period.EndTime||period.endTime||'';
const row=rows.get(key)||{start,end,fields:{},intervals:[]};
const values=period.ElementValue||period.elementValue||period.parameter||period.Parameter||[],value=Array.isArray(values)?(values[0]??{}):values;
row.fields[name]=value;row.intervals.push({name,start,end,value});
rows.set(key,row);
});
});
return [...rows.values()].sort((a,b)=>String(a.start).localeCompare(String(b.start)));
};
const fieldValue=(row,patterns)=>{
const read=value=>{if(value==null)return'';if(Array.isArray(value)){for(const item of value){const result=read(item);if(result!=='')return result}return''}if(typeof value==='object'){for(const key of ['Value','value','ParameterValue','parameterValue','Weather','weather','WeatherDescription'])if(value[key]!=null)return read(value[key]);for(const[key,item]of Object.entries(value))if(!/^(Measure|Unit|ParameterName|ElementName)$/i.test(key)){const result=read(item);if(result!=='')return result}return''}return String(value)};
for(const[name,raw]of Object.entries(row?.fields||{}))if(patterns.some(pattern=>pattern.test(name))){const result=read(raw);if(result!=='')return result}return'';
};
const num=value=>{if(/無雨|無降雨|未降雨/.test(String(value??'')))return 0;const match=String(value??'').match(/-?\d+(?:\.\d+)?/);return match?Number(match[0]):null};
const dateText=(value,lang)=>{const d=new Date(value);if(Number.isNaN(d.getTime()))return value||'--';return new Intl.DateTimeFormat(lang==='en'?'en-US':'zh-TW',{month:'numeric',day:'numeric',weekday:'short',timeZone:'Asia/Taipei'}).format(d)};
const timeText=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?'--':new Intl.DateTimeFormat('zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Taipei'}).format(d)};
const temperature=row=>num(fieldValue(row,[/溫度|Temperature/i]));
const weather=row=>fieldValue(row,[/天氣現象|天氣預報綜合描述|WeatherDescription|Weather/i]);
const weatherEn=value=>{let s=String(value||'');[['陰時多雲短暫陣雨','Cloudy, becoming partly cloudy with brief showers'],['陰時多雲','Cloudy, then partly cloudy'],['多雲時陰','Partly cloudy, then cloudy'],['晴時多雲','Sunny, then partly cloudy'],['多雲時晴','Partly cloudy, then sunny'],['雷陣雨','thunderstorms'],['短暫陣雨','brief showers'],['短暫雨','brief rain'],['陣雨','showers'],['午後','afternoon'],['局部','isolated'],['多雲','partly cloudy'],['陰','cloudy'],['晴','sunny'],['雨','rain']].forEach(([a,b])=>s=s.replaceAll(a,b));return s.replace(/，/g,', ').replace(/\s*,\s*/g,', ').replace(/\s+/g,' ').trim().replace(/^./,c=>c.toUpperCase())};
const rainPattern=/降雨機率|降水機率|ProbabilityOfPrecipitation|PoP/i;
const rain=row=>num(fieldValue(row,[rainPattern]));
const rainPeriods=rows=>rows.flatMap(row=>row.intervals.filter(x=>rainPattern.test(x.name)).map(x=>({start:Date.parse(x.start),end:Date.parse(x.end),value:num(fieldValue({fields:{[x.name]:x.value}},[rainPattern]))}))).filter(x=>Number.isFinite(x.start)&&x.value!==null).sort((a,b)=>a.start-b.start);
const rainAt=(time,periods)=>{const t=Date.parse(time);if(!Number.isFinite(t))return null;const match=periods.find(x=>t>=x.start&&(!Number.isFinite(x.end)||t<x.end));if(match)return match.value;const prior=[...periods].reverse().find(x=>x.start<=t);return prior&&t-prior.start<=12*3600000?prior.value:null};
const put=(el,value)=>{if(el&&value!==null&&value!==undefined&&value!=='')el.textContent=value};
const icons={sun:'<circle cx="16" cy="16" r="5"/><path d="M16 2v4m0 20v4M2 16h4m20 0h4M6 6l3 3m14 14 3 3M26 6l-3 3M9 23l-3 3"/>',cloud:'<path d="M8 25h16a7 7 0 0 0 0-14 9 9 0 0 0-17-1 7.5 7.5 0 0 0 1 15Z"/>',partly:'<circle cx="12" cy="11" r="4"/><path d="M12 2v2m0 14v2M3 11h2m14 0h2M6 5l2 2m8 8 2 2M10 25h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/>',rain:'<path d="M8 21h16a6 6 0 0 0 0-12 8 8 0 0 0-15-1 6.5 6.5 0 0 0-1 13Z"/><path d="m11 24-2 4m9-4-2 4m9-4-2 4"/>',storm:'<path d="M8 19h16a6 6 0 0 0 0-12 8 8 0 0 0-15-1 6.5 6.5 0 0 0-1 13Z"/><path d="m17 18-5 7h4l-1 5 6-8h-4l2-4"/>',snow:'<path d="M8 20h16a6 6 0 0 0 0-12 8 8 0 0 0-15-1 6.5 6.5 0 0 0-1 13Z"/><path d="M12 24v5m-2-2 4-1m-4-1 4 2m6-3v5m-2-2 4-1m-4-1 4 2"/>',fog:'<path d="M8 17h16a6 6 0 0 0 0-12 8 8 0 0 0-15-1 6.5 6.5 0 0 0-1 13Z"/><path d="M4 22h22M7 27h18"/>'};
const iconType=text=>{const s=String(text||'').toLowerCase();if(/雷|thunder|lightning/.test(s))return'storm';if(/雪|snow|sleet/.test(s))return'snow';if(/雨|陣雨|豪雨|rain|shower|drizzle/.test(s))return'rain';if(/霧|fog|mist/.test(s))return'fog';if(/晴時多雲|多雲時晴|partly|晴.*多雲/.test(s))return'partly';if(/多雲|陰|cloud|overcast/.test(s))return'cloud';return'sun'};
const setIcon=(el,text)=>{if(el){el.setAttribute('viewBox','0 0 32 32');el.innerHTML=icons[iconType(text)]}};
const render=(threeHour,fiveDay)=>{
const lang=pageRoot?.dataset.language||'zh';
const hourly=parseRows(threeHour),daily=parseRows(fiveDay),hourlyRain=rainPeriods(hourly),dailyRain=rainPeriods(daily);if(!hourly.length&&!daily.length)throw new Error('No forecast locations returned');
const now=Date.now(),forecastAt=t=>hourly.filter(row=>{const start=Date.parse(row.start);return start<=t&&(temperature(row)!==null||weather(row))}).pop()||hourly[0],current=forecastAt(now)||{start:'',fields:{},intervals:[]},temp=temperature(current),condition=weather(current),precip=rain(current)??rainAt(current.start,hourlyRain);
put(q('cwa-temp'),temp===null?'--°':`${Math.round(temp)}°`);
setCondition(condition||'預報資料已載入',condition?weatherEn(condition):'Forecast data loaded');setIcon(q('cwa-icon'),condition);
const meta=q('cwa-current-meta');if(meta){const strong=meta.querySelector('strong');put(strong,precip===null?'--%':`${Math.round(precip)}%`)}
const issued=q('cwa-observed-at');if(issued)put(issued,current.start?`${lang==='en'?'Forecast':'預報'} ${timeText(current.start)}`:'');
const slots=qa('cwa-slot'),nextHour=Math.floor(now/3600000)*3600000+3600000;slots.forEach((slot,i)=>{const target=new Date(nextHour+i*3600000),stamp=target.toISOString(),row=forecastAt(target.getTime()),spans=slot.querySelectorAll('span'),t=temperature(row),p=rain(row)??rainAt(stamp,hourlyRain);put(spans[0],timeText(stamp));setIcon(slot.querySelector('svg'),weather(row));put(slot.querySelector('strong'),t===null?'--°':`${Math.round(t)}°`);put(slot.querySelector('small'),p===null?(lang==='en'?'Rain --%':'降雨 --%'):(lang==='en'?`Rain ${Math.round(p)}%`:`降雨 ${Math.round(p)}%`))});
const days=qa('cwa-day');
const grouped=new Map();daily.forEach(row=>{const key=String(row.start).slice(0,10);if(!key)return;const item=grouped.get(key)||{date:row.start,rows:[]};item.rows.push(row);grouped.set(key,item)});
[...grouped.values()].slice(0,5).forEach((day,i)=>{
const tile=days[i];if(!tile)return;const rows=day.rows;
let low=null,high=null,prob=null,conditionText='';
rows.forEach(row=>{
const lo=num(fieldValue(row,[/最低溫|MinTemperature|最低溫度/i]));const hi=num(fieldValue(row,[/最高溫|MaxTemperature|最高溫度/i]));const t=temperature(row);if(lo!==null)low=low===null?lo:Math.min(low,lo);if(hi!==null)high=high===null?hi:Math.max(high,hi);if(t!==null){low=low===null?t:Math.min(low,t);high=high===null?t:Math.max(high,t)}const p=rain(row);if(p!==null)prob=prob===null?p:Math.max(prob,p);if(!conditionText||iconType(weather(row))==='storm'||iconType(weather(row))==='rain')conditionText=weather(row);
});
if(prob===null){const start=Date.parse(`${String(day.date).slice(0,10)}T00:00:00+08:00`),end=start+86400000,values=dailyRain.filter(x=>x.start<end&&(!Number.isFinite(x.end)||x.end>start)).map(x=>x.value);if(values.length)prob=Math.max(...values)}const strongs=tile.querySelectorAll('strong');put(strongs[0],dateText(day.date,lang));setIcon(tile.querySelector('svg'),conditionText);put(strongs[1],low===null&&high===null?'--° / --°':`${low===null?'--':Math.round(low)}° / ${high===null?'--':Math.round(high)}°`);const small=tile.querySelector('small');put(small,prob===null?(lang==='en'?weatherEn(conditionText||'--'):(conditionText||'--')):(lang==='en'?`Rain ${Math.round(prob)}%`:`降雨 ${Math.round(prob)}%`));
});
setNote(noteZh,noteEn);
};
let latestForecast=null;const refreshForecast=()=>{if(!latestForecast)return;render(latestForecast.threeHour,latestForecast.fiveDay);if(latestForecast.weeklyError)setNote('目前天氣已載入；五日預報暫時無法取得。','Current weather loaded; the 5-day forecast is temporarily unavailable.')};document.addEventListener(card.dataset.cwaLanguageEvent,refreshForecast);
setCondition('天氣資料載入中…','Loading weather data…');
fetch(API_URL,{headers:{Accept:'application/json'}}).then(async response=>{const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Weather API ${response.status}: ${data.detail||data.error||'no diagnostic returned'}`);return data}).then(data=>{latestForecast=data;refreshForecast()}).catch(error=>{console.warn('CWA forecast unavailable:',error);setCondition('氣象資料暫時無法載入','Weather data is temporarily unavailable');setNote(failZh,failEn)});
})();
