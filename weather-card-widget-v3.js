(()=>{
const mount=document.querySelector('[data-cwa-location][data-cwa-endpoint]');if(!mount)return;
const pageRoot=mount.closest('[data-kd-detail],[data-df-detail]');if(!pageRoot)return;
const prefix=pageRoot.hasAttribute('data-kd-detail')?'kd-detail':'df-detail';
const titleZh=prefix==='kd-detail'?'墾丁鄉鎮預報':'德芙蘭鄉鎮預報';
const titleEn=prefix==='kd-detail'?'Kenting Town Forecast':'Defulan Town Forecast';
const sourceHref=mount.dataset.cwaSourceHref||'';
const card=document.createElement('article');
card.className=prefix+'__live-card '+prefix+'__live-card--cwa';
['cwaLocation','cwaEndpoint','cwaLanguageEvent','cwaDays'].forEach(key=>{if(mount.dataset[key])card.dataset[key]=mount.dataset[key]});
card.innerHTML=('<div class="PFX__live-card-head"><div><p class="PFX__eyebrow" data-lang-zh="CWA LOCAL FORECAST" data-lang-en="CWA LOCAL FORECAST">CWA LOCAL FORECAST</p><h3 data-lang-zh="TITLE_ZH" data-lang-en="TITLE_EN">TITLE_ZH</h3></div><span class="PFX__cwa-source-label" data-lang-zh="中央氣象署" data-lang-en="CWA">中央氣象署</span></div>'+
'<div class="PFX__cwa-layout"><div class="PFX__cwa-current"><p class="PFX__cwa-kicker" data-lang-zh="目前預報" data-lang-en="Current Forecast">目前預報</p><div class="PFX__cwa-current-row"><svg class="PFX__cwa-icon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="18" cy="18" r="7"/><path d="M18 4v4m0 20v4M4 18h4m20 0h4M8.1 8.1 11 11m14 14 2.9 2.9M27.9 8.1 25 11"/><path d="M17 36h19a7 7 0 0 0 0-14 10 10 0 0 0-19-2 8 8 0 0 0 0 16Z"/></svg><div><strong class="PFX__cwa-temp">--°</strong><span class="PFX__cwa-condition" data-lang-zh="等待資料串接" data-lang-en="Waiting for data connection">等待資料串接</span></div></div><div class="PFX__cwa-current-meta"><span data-lang-zh="降雨機率" data-lang-en="Rain chance">降雨機率</span><strong>--%</strong><span class="PFX__cwa-observed-at" data-lang-zh="預報更新後顯示時間" data-lang-en="Forecast issue time appears here">預報更新後顯示時間</span></div></div>'+
'<div class="PFX__cwa-upcoming-wrap"><p class="PFX__cwa-kicker" data-lang-zh="接下來的天氣" data-lang-en="Coming Up">接下來的天氣</p><div class="PFX__cwa-upcoming">'+
'<div class="PFX__cwa-slot"><span data-lang-zh="下一時段" data-lang-en="Next">下一時段</span><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4"/><path d="M12 3v2m0 12v2M4 11h2m12 0h2M9 24h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/></svg><strong>--°</strong><small data-lang-zh="降雨 --%" data-lang-en="Rain --%">降雨 --%</small></div>'+
'<div class="PFX__cwa-slot"><span data-lang-zh="之後" data-lang-en="Later">之後</span><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4"/><path d="M12 3v2m0 12v2M4 11h2m12 0h2M9 24h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/></svg><strong>--°</strong><small data-lang-zh="降雨 --%" data-lang-en="Rain --%">降雨 --%</small></div>'+
'<div class="PFX__cwa-slot"><span data-lang-zh="稍後" data-lang-en="Afterward">Afterward</span><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4"/><path d="M12 3v2m0 12v2M4 11h2m12 0h2M9 24h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/></svg><strong>--°</strong><small data-lang-zh="降雨 --%" data-lang-en="Rain --%">降雨 --%</small></div>'+
'</div></div></div><div class="PFX__cwa-five-day"><p class="PFX__cwa-kicker" data-lang-zh="未來五天" data-lang-en="Next Five Days">未來五天</p><div class="PFX__cwa-days">'+
Array.from({length:5},()=>'<div class="PFX__cwa-day"><strong>--/--</strong><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4"/><path d="M12 3v2m0 12v2M4 11h2m12 0h2M9 24h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/></svg><strong>--° <i>/</i> --°</strong><small data-lang-zh="降雨 --%" data-lang-en="Rain --%">降雨 --%</small></div>').join('')+
'</div></div><p class="PFX__cwa-note" data-lang-zh="五日預報資料來自中央氣象署；出發前請再次確認官方預報與現場狀況。" data-lang-en="The five-day forecast is provided by the CWA. Check the official forecast and on-site conditions before setting out.">五日預報資料來自中央氣象署；出發前請再次確認官方預報與現場狀況。</p><a class="PFX__live-source" href="SOURCE_HREF" target="_blank" rel="noopener" data-lang-zh="中央氣象署鄉鎮預報" data-lang-en="Open CWA Forecast">中央氣象署鄉鎮預報</a>')
.replaceAll('PFX',prefix).replaceAll('TITLE_ZH',titleZh).replaceAll('TITLE_EN',titleEn).replaceAll('SOURCE_HREF',sourceHref);
mount.replaceWith(card);
const style=document.createElement('style');
style.textContent=('.PFX__live-card--cwa{grid-column:1/-1;padding:22px 24px}.PFX__live-card--cwa .PFX__live-card-head{align-items:flex-end;margin-bottom:20px}.PFX__live-card--cwa .PFX__eyebrow{margin:0 0 5px;font-size:14px}.PFX__live-card--cwa .PFX__live-card-head h3{font-size:14px}.PFX__cwa-source-label{color:var(--gray);font-size:12px}.PFX__cwa-layout{display:grid;grid-template-columns:minmax(220px,.8fr) minmax(0,1.8fr);gap:28px;align-items:stretch}.PFX__cwa-current{display:flex;min-width:0;flex-direction:column;align-items:center;justify-content:center;padding:18px;border:0;border-radius:0;background:transparent;text-align:center}.PFX__cwa-kicker{margin:0 0 14px;color:var(--gray);font-size:12px;letter-spacing:.06em}.PFX__cwa-current-row{display:flex;min-height:76px;align-items:center;justify-content:center;gap:16px}.PFX__cwa-current-row>div{display:flex;flex-direction:column;gap:4px;text-align:left}.PFX__cwa-icon{width:54px;height:54px;fill:none;stroke:#f5f5f5;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.PFX__cwa-temp{font-size:34px;font-weight:500;line-height:1}.PFX__cwa-condition{color:var(--gray);font-size:14px}.PFX__cwa-current-meta{display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:6px 10px;margin-top:18px;padding:0;border:0;color:var(--gray);font-size:12px;text-align:center}.PFX__cwa-current-meta strong{color:#f5f5f5;font-size:14px;font-weight:600}.PFX__cwa-observed-at{font-size:11px;white-space:nowrap}.PFX__cwa-upcoming-wrap{min-width:0;padding:18px 0 18px 24px;border-left:1px solid var(--line)}.PFX__cwa-upcoming{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.PFX__cwa-slot{display:flex;min-width:0;min-height:126px;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:12px 8px;border:0;border-radius:0;background:transparent;text-align:center}.PFX__cwa-slot span,.PFX__cwa-slot small{color:var(--gray);font-size:11px}.PFX__cwa-slot svg{width:30px;height:30px;fill:none;stroke:#f5f5f5;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}.PFX__cwa-slot strong{font-size:17px;font-weight:500;line-height:1}.PFX__cwa-five-day{margin-top:20px;padding-top:18px;border-top:1px solid var(--line)}.PFX__cwa-days{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.PFX__cwa-day{display:flex;min-width:0;min-height:142px;flex-direction:column;align-items:center;justify-content:space-between;gap:8px;padding:14px 9px;border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.025);text-align:center}.PFX__cwa-day small{color:var(--gray);font-size:11px}.PFX__cwa-day>strong:first-of-type{color:var(--gray);font-size:11px;font-weight:400}.PFX__cwa-day svg{width:32px;height:32px;fill:none;stroke:#f5f5f5;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}.PFX__cwa-day strong{font-size:14px;font-weight:500;white-space:nowrap}.PFX__cwa-day i{color:var(--gray);font-size:11px;font-style:normal}.PFX__cwa-note{margin:14px 0 0;color:var(--gray);font-size:12px;line-height:1.7}@media(max-width:760px){.PFX__live-card--cwa{padding:16px 14px}.PFX__cwa-layout{grid-template-columns:1fr;gap:12px}.PFX__cwa-current{padding:14px 0 16px}.PFX__cwa-upcoming-wrap{box-sizing:border-box;width:100%;margin:0;padding:14px 0 0;border:0;border-top:1px solid var(--line)}.PFX__cwa-upcoming{gap:4px}.PFX__cwa-slot{min-height:106px;padding:8px 4px}.PFX__cwa-days{grid-template-columns:repeat(5,minmax(94px,1fr));overflow-x:auto;padding-bottom:4px}.PFX__cwa-day{min-height:132px;padding:12px 7px}}').replaceAll('PFX',prefix);
document.head.appendChild(style);
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
(window.__gowildCwaRequest?window.__gowildCwaRequest(card.dataset.cwaEndpoint):fetch(API_URL,{headers:{Accept:'application/json'}}).then(async response=>{const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Weather API ${response.status}: ${data.detail||data.error||'no diagnostic returned'}`);return data})).then(data=>{latestForecast=data;refreshForecast()}).catch(error=>{console.warn('CWA forecast unavailable:',error);setCondition('氣象資料暫時無法載入','Weather data is temporarily unavailable');setNote(failZh,failEn)});
})();
