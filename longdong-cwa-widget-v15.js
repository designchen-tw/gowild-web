(()=>{
const root=document.querySelector('[data-ld-detail]');
const mount=root?.querySelector('[data-cwa-widget]');
if(!root||!mount||mount.dataset.cwaReady)return;
mount.dataset.cwaReady='true';
mount.innerHTML=`
<div class="ld-detail__live-card-head"><div><h3 data-lang-en="Longdong Bay Forecast">龍洞灣公園天氣</h3></div><a class="ld-detail__cwa-source-label" href="https://www.cwa.gov.tw/V8/C/L/Beach/Beach.html?PID=A018" target="_blank" rel="noopener noreferrer" data-lang-en="CWA Beach Forecast">中央氣象署海水浴場預報</a></div>
<div class="ld-detail__cwa-layout">
<div class="ld-detail__cwa-current">
<p class="ld-detail__cwa-kicker"><span data-lang-en="Current Forecast">目前預報</span><time class="ld-detail__cwa-observed-at"></time></p>
<div class="ld-detail__cwa-current-row">
<svg class="ld-detail__cwa-icon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="18" cy="18" r="7"/><path d="M18 4v4m0 20v4M4 18h4m20 0h4M8.1 8.1 11 11m14 14 2.9 2.9M27.9 8.1 25 11"/><path d="M17 36h19a7 7 0 0 0 0-14 10 10 0 0 0-19-2 8 8 0 0 0 0 16Z"/></svg>
<div><strong class="ld-detail__cwa-temp">--°</strong><span class="ld-detail__cwa-condition" data-lang-en="Waiting for data connection">等待資料串接</span></div>
</div>
<div class="ld-detail__cwa-current-meta"><span data-lang-en="Rain chance">降雨機率</span><span class="ld-detail__cwa-rain-value">--%</span></div>
</div>
<div class="ld-detail__cwa-upcoming-wrap"><p class="ld-detail__cwa-kicker" data-lang-en="Coming Up">接下來的天氣</p><div class="ld-detail__cwa-upcoming" aria-live="polite"></div></div>
</div>
<div class="ld-detail__cwa-five-day">
<p class="ld-detail__cwa-kicker"><span data-lang-en="Next Five Days">未來五天</span><span class="ld-detail__cwa-kicker-hint" data-lang-en="(Select a day for hourly details)">（點擊可查看詳細分時預報）</span></p>
<div class="ld-detail__cwa-days">
<button type="button" class="ld-detail__cwa-day" aria-expanded="false" aria-controls="ld-cwa-day-detail"><strong>--/--</strong><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4"/><path d="M12 3v2m0 12v2M4 11h2m12 0h2M9 24h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/></svg><strong>--° <i>/</i> --°</strong><small data-lang-en="Rain --%">降雨 --%</small></button>
<button type="button" class="ld-detail__cwa-day" aria-expanded="false" aria-controls="ld-cwa-day-detail"><strong>--/--</strong><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4"/><path d="M12 3v2m0 12v2M4 11h2m12 0h2M9 24h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/></svg><strong>--° <i>/</i> --°</strong><small data-lang-en="Rain --%">降雨 --%</small></button>
<button type="button" class="ld-detail__cwa-day" aria-expanded="false" aria-controls="ld-cwa-day-detail"><strong>--/--</strong><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4"/><path d="M12 3v2m0 12v2M4 11h2m12 0h2M9 24h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/></svg><strong>--° <i>/</i> --°</strong><small data-lang-en="Rain --%">降雨 --%</small></button>
<button type="button" class="ld-detail__cwa-day" aria-expanded="false" aria-controls="ld-cwa-day-detail"><strong>--/--</strong><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4"/><path d="M12 3v2m0 12v2M4 11h2m12 0h2M9 24h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/></svg><strong>--° <i>/</i> --°</strong><small data-lang-en="Rain --%">降雨 --%</small></button>
<button type="button" class="ld-detail__cwa-day" aria-expanded="false" aria-controls="ld-cwa-day-detail"><strong>--/--</strong><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4"/><path d="M12 3v2m0 12v2M4 11h2m12 0h2M9 24h14a6 6 0 0 0 0-12 8 8 0 0 0-15-1"/></svg><strong>--° <i>/</i> --°</strong><small data-lang-en="Rain --%">降雨 --%</small></button>
</div>
<div id="ld-cwa-day-detail" class="ld-detail__cwa-day-detail" hidden></div>
</div>
<p class="ld-detail__cwa-note" data-lang-en="The five-day forecast is provided by the CWA. Check the official forecast and on-site conditions before setting out.">五日預報資料來自中央氣象署；出發前請再次確認官方預報與現場狀況。</p>
`;
const style=document.createElement('style');
style.textContent=`.ld-detail__live-card--cwa{grid-column:1/-1;padding:22px 24px}.ld-detail__live-card--cwa .ld-detail__live-card-head{align-items:flex-end;margin-bottom:20px}.ld-detail__live-card--cwa .ld-detail__eyebrow{margin:0 0 5px;font-size:14px}.ld-detail__live-card--cwa .ld-detail__live-card-head h3{font-size:14px}.ld-detail__cwa-source-label{color:var(--gray);font-size:12px}.ld-detail__cwa-layout{display:grid;grid-template-columns:minmax(220px,.8fr) minmax(0,1.8fr);gap:28px;align-items:stretch}.ld-detail__cwa-current{display:flex;flex-direction:column;align-items:stretch;min-width:0;padding:8px 0;border:0;background:transparent;text-align:left}.ld-detail__cwa-kicker{display:block;width:100%;margin:0 0 14px;color:var(--gray);font-size:14px;font-weight:500;line-height:1.4;letter-spacing:0;text-align:left}.ld-detail__cwa-current .ld-detail__cwa-kicker{align-self:stretch;text-align:left}.ld-detail__cwa-current-row{display:flex;align-items:center;justify-content:center;gap:16px;min-height:76px}.ld-detail__cwa-current-row>div{display:flex;flex-direction:column;gap:3px}.ld-detail__cwa-icon{width:54px;height:54px;fill:none;stroke:#f5f5f5;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ld-detail__cwa-temp{font-size:34px;font-weight:500;line-height:1}.ld-detail__cwa-condition{color:var(--gray);font-size:14px}.ld-detail__cwa-current-meta{display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:6px 10px;margin-top:14px;padding-top:0;border-top:0;font-size:12px;color:var(--gray)}.ld-detail__cwa-current-meta strong{color:#f5f5f5;font-size:14px;font-weight:600}.ld-detail__cwa-observed-at{margin-left:0;font-size:11px;text-align:center;white-space:nowrap}.ld-detail__cwa-upcoming-wrap{min-width:0;padding:18px 0 18px 24px;border-left:1px solid var(--line)}.ld-detail__cwa-upcoming{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.ld-detail__cwa-slot{display:flex;min-width:0;min-height:126px;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:12px 8px;border:0;border-radius:0;background:transparent;text-align:center}.ld-detail__cwa-slot span,.ld-detail__cwa-slot small{color:var(--gray);font-size:11px}.ld-detail__cwa-slot svg{width:30px;height:30px;fill:none;stroke:#f5f5f5;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}.ld-detail__cwa-slot strong{font-size:17px;font-weight:500;line-height:1}.ld-detail__cwa-five-day{margin-top:20px;padding-top:18px;border-top:1px solid var(--line)}.ld-detail__cwa-days{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.ld-detail__cwa-day{display:flex;min-width:0;min-height:142px;flex-direction:column;align-items:center;justify-content:space-between;gap:8px;padding:14px 9px;border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.025);text-align:center}.ld-detail__cwa-day>span,.ld-detail__cwa-day small{color:var(--gray);font-size:11px}.ld-detail__cwa-day>strong:first-of-type{color:var(--gray);font-size:11px;font-weight:400}.ld-detail__cwa-day svg{width:32px;height:32px;fill:none;stroke:#f5f5f5;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}.ld-detail__cwa-day strong{font-size:14px;font-weight:500;white-space:nowrap}.ld-detail__cwa-day i{color:var(--gray);font-size:11px;font-style:normal}.ld-detail__cwa-note{margin:14px 0 0;color:var(--gray);font-size:12px;line-height:1.7}@media(max-width:760px){.ld-detail__cwa-kicker{font-size:12px;margin-bottom:12px}.ld-detail__live-card--cwa{padding:16px 12px}.ld-detail__cwa-layout{grid-template-columns:1fr!important;gap:12px!important}.ld-detail__cwa-current{padding:0 0 12px!important}.ld-detail__cwa-upcoming-wrap{box-sizing:border-box;width:100%;margin:0;padding:14px 0 0!important;border-left:0!important;border-top:1px solid var(--line)!important}.ld-detail__cwa-days{grid-template-columns:repeat(5,minmax(94px,1fr));overflow-x:auto;padding-bottom:4px}.ld-detail__cwa-day{min-height:132px;padding:12px 7px}}`;
style.textContent+=`\n/* Hourly strip through the end of today, with a six-hour minimum. */
main.ld-detail .ld-detail__cwa-layout{grid-template-columns:minmax(205px,.68fr) minmax(0,2.32fr);gap:20px}
main.ld-detail .ld-detail__cwa-current,main.ld-detail .ld-detail__cwa-upcoming-wrap{padding-top:8px}
main.ld-detail .ld-detail__cwa-upcoming-wrap{padding-left:18px}
main.ld-detail .ld-detail__live-card--cwa .ld-detail__live-card-head .ld-detail__cwa-source-label{color:var(--gw-ink-detail,rgba(245,245,245,.62))!important;font-size:var(--gw-type-detail,12px)!important;font-weight:400!important;line-height:1.6!important;letter-spacing:0!important}
main.ld-detail .ld-detail__cwa-upcoming{display:flex;gap:0;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:thin;padding-bottom:4px}
main.ld-detail .ld-detail__cwa-slot{min-height:130px;flex:0 0 clamp(84px,8.5vw,110px);padding:10px 6px;scroll-snap-align:start}
main.ld-detail .ld-detail__cwa-slot+.ld-detail__cwa-slot{border-left:1px solid var(--line)}
main.ld-detail .ld-detail__cwa-day{appearance:none;width:100%;min-height:126px;font:inherit;color:inherit;cursor:pointer;transition:border-color .2s ease,background .2s ease}
main.ld-detail .ld-detail__cwa-day:hover,main.ld-detail .ld-detail__cwa-day.is-selected{border-color:rgba(245,245,245,.48);background:rgba(255,255,255,.065)}
main.ld-detail .ld-detail__cwa-day:focus-visible{outline:2px solid #f5f5f5;outline-offset:3px}
main.ld-detail .ld-detail__cwa-day[hidden],main.ld-detail .ld-detail__cwa-day-detail[hidden]{display:none}
main.ld-detail .ld-detail__cwa-day-detail{margin-top:14px;padding:16px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.025)}
main.ld-detail .ld-detail__cwa-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}
main.ld-detail .ld-detail__cwa-detail-head strong{color:#f5f5f5;font-size:var(--gw-type-card,16px);font-weight:600;line-height:1.45}
main.ld-detail .ld-detail__cwa-detail-note{margin:0 0 12px;color:var(--gw-ink-detail,rgba(245,245,245,.62));font-size:var(--gw-type-detail,12px);line-height:1.6}
main.ld-detail .ld-detail__cwa-detail-hours{display:flex;gap:0;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:thin;padding-bottom:5px}
main.ld-detail .ld-detail__cwa-hour{display:flex;min-width:96px;flex:1 0 96px;flex-direction:column;align-items:center;gap:6px;padding:8px 7px;text-align:center;scroll-snap-align:start}
main.ld-detail .ld-detail__cwa-hour+.ld-detail__cwa-hour{border-left:1px solid var(--line)}
main.ld-detail .ld-detail__cwa-hour time,main.ld-detail .ld-detail__cwa-hour small,main.ld-detail .ld-detail__cwa-hour span{color:var(--gw-ink-detail,rgba(245,245,245,.62));font-size:var(--gw-type-detail,12px);line-height:1.45}
main.ld-detail .ld-detail__cwa-hour span{max-width:100%;min-height:2.9em;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}
main.ld-detail .ld-detail__cwa-hour strong{color:#f5f5f5;font-size:var(--gw-type-value,20px);font-weight:600;line-height:1.3}
main.ld-detail .ld-detail__cwa-hour svg{width:25px;height:25px;fill:none;stroke:#f5f5f5;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
@media(max-width:1100px){main.ld-detail .ld-detail__cwa-layout{grid-template-columns:1fr;gap:14px}main.ld-detail .ld-detail__cwa-upcoming-wrap{padding:14px 0 0;border-left:0;border-top:1px solid var(--line)}}
@media(max-width:700px){main.ld-detail .ld-detail__cwa-upcoming{scroll-snap-type:x mandatory}main.ld-detail .ld-detail__cwa-slot{flex-basis:104px}main.ld-detail .ld-detail__cwa-day{min-height:120px}main.ld-detail .ld-detail__cwa-day-detail{padding:12px}main.ld-detail .ld-detail__cwa-hour{min-width:92px;flex-basis:92px}}
`;
style.textContent+=`main.ld-detail .ld-detail__cwa-kicker-hint{margin-left:.45em;color:var(--gw-ink-muted,rgba(245,245,245,.48));font-size:var(--gw-type-detail,12px);font-weight:400;line-height:1.5;letter-spacing:0}main.ld-detail .ld-detail__cwa-five-day>.ld-detail__cwa-kicker{white-space:nowrap}main.ld-detail .ld-detail__cwa-source-label{text-decoration:underline;text-underline-offset:3px;white-space:nowrap}main.ld-detail .ld-detail__cwa-current{justify-content:space-between}main.ld-detail .ld-detail__cwa-current-row{flex:1;min-height:96px;justify-content:center}main.ld-detail .ld-detail__cwa-current-meta{justify-content:center;align-self:stretch;min-height:24px;margin:0 0 17px;gap:4px 8px}main.ld-detail .ld-detail__cwa-upcoming-wrap{padding-bottom:18px}main.ld-detail .ld-detail__cwa-slot{justify-content:space-between}main.ld-detail .ld-detail__cwa-slot svg{margin-top:auto}main.ld-detail .ld-detail__cwa-slot small{margin-top:auto}@media(max-width:1100px){main.ld-detail .ld-detail__cwa-current-row{min-height:90px}main.ld-detail .ld-detail__cwa-current-meta{margin-bottom:0}}@media(max-width:520px){main.ld-detail .ld-detail__cwa-kicker-hint{display:inline;margin:0 0 0 .3em;font-size:var(--gw-type-detail,10px)}main.ld-detail .ld-detail__cwa-five-day>.ld-detail__cwa-kicker{font-size:12px}main.ld-detail .ld-detail__cwa-current-row{min-height:84px}}`;
style.textContent+=`main.ld-detail .ld-detail__cwa-current .ld-detail__cwa-observed-at{display:inline;margin-left:.5em;color:var(--gw-ink-muted,rgba(245,245,245,.48))!important;font-size:var(--gw-type-detail,12px)!important;font-weight:400!important;line-height:inherit!important;text-align:left}main.ld-detail .ld-detail__cwa-current-meta .ld-detail__cwa-rain-value{color:var(--gw-ink-muted,rgba(245,245,245,.48))!important;font-size:var(--gw-type-label,14px)!important;font-weight:400!important;line-height:1.45!important}main.ld-detail .ld-detail__cwa-slot-time{white-space:nowrap;font-variant-numeric:tabular-nums}`;
document.head.appendChild(style);
const localize=()=>{const en=root.dataset.language==='en';mount.querySelectorAll('[data-lang-en]').forEach(el=>{if(!el.dataset.langZh)el.dataset.langZh=el.textContent;el.textContent=en?el.dataset.langEn:el.dataset.langZh})};
document.addEventListener('ld-language-change',localize);
localize();
(()=>{
const API_URL='https://cwa-weather.designchenme.workers.dev/api/longdong';
const card=mount;if(!card)return;
const note=card.querySelector('.ld-detail__cwa-note');
const conditionEl=card.querySelector('.ld-detail__cwa-condition');
const noteZh='資料每 15 分鐘更新；出發前仍請確認官方公告與現場狀況。';
const noteEn='Forecast data refreshes every 15 minutes. Check official notices and on-site conditions before setting out.';
const failZh='天氣資料暫時無法載入，請稍後再試或查看中央氣象署。';
const failEn='Forecast data is temporarily unavailable. Please try again or check the CWA website.';
const setNote=(zh,en)=>{if(!note)return;const lang=document.querySelector('[data-ld-detail]')?.dataset.language||'zh';note.textContent=lang==='en'?en:zh;note.dataset.langZh=zh;note.dataset.langEn=en};
const setCondition=(zh,en,placeholder=false)=>{if(!conditionEl)return;const lang=document.querySelector('[data-ld-detail]')?.dataset.language||'zh';conditionEl.classList.toggle('is-placeholder',placeholder);conditionEl.dataset.langZh=zh;conditionEl.dataset.langEn=en;conditionEl.textContent=lang==='en'?en:zh};
const flattenLocations=data=>{
const found=[];const visit=value=>{if(!value)return;if(Array.isArray(value)){value.forEach(visit);return}if(typeof value!=='object')return;const name=value.LocationName||value.locationName,weather=value.WeatherElement||value.weatherElement;if(name&&Array.isArray(weather))found.push({...value,LocationName:name,LocationId:value.LocationId||value.locationId,WeatherElement:weather});Object.values(value).forEach(visit)};visit(data?.records||data);return found;
};
const parseRows=data=>{
const locations=flattenLocations(data);
const loc=locations.find(x=>String(x.LocationId||x.LocationID||x.locationId||'')==='A01800'||/龍洞灣公園|Longdong Bay Park/i.test(x.LocationName||''));
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
const taipeiDateKey=value=>{const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));const part=type=>parts.find(item=>item.type===type)?.value||'';return`${part('year')}-${part('month')}-${part('day')}`};
const upcomingTargets=now=>{const start=Math.floor(now/3600000)*3600000+3600000,today=taipeiDateKey(now),targets=[];for(let target=start;taipeiDateKey(target)===today;target+=3600000)targets.push(target);while(targets.length<6)targets.push(start+targets.length*3600000);return{today,targets}};
const upcomingTimeText=(value,today)=>{const time=timeText(value);return taipeiDateKey(value)===today?time:`${time} +1`};
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
let selectedDayKey=null;
const sourceRowAt=(rows,time,read)=>{
  let found=null;
  for(const row of rows){
    const start=Date.parse(row.start);
    if(!Number.isFinite(start))continue;
    if(start>time)break;
    const value=read(row);
    if(value!==null&&value!=='')found=row;
  }
  return found;
};
const currentRowAt=(rows,time,read)=>{
  const current=sourceRowAt(rows,time,read);
  if(current&&time-Date.parse(current.start)<=3*3600000)return current;
  return rows.find(row=>{
    const start=Date.parse(row.start),value=read(row);
    return Number.isFinite(start)&&start>time&&start-time<=3*3600000&&value!==null&&value!=='';
  })||null;
};
const representativeDayWeather=(rows,key,fallback)=>{
  const counts=new Map();
  rows.forEach(row=>{
    const start=String(row.start),hour=Number(start.slice(11,13));
    if(start.slice(0,10)!==key||hour<6||hour>18||(temperature(row)===null&&!weather(row)))return;
    const sky=weather(sourceRowAt(rows,Date.parse(row.start),weather));
    if(!sky)return;
    const kind=iconType(sky),entry=counts.get(kind)||{count:0,text:sky};
    entry.count++;counts.set(kind,entry);
  });
  for(const kind of ['storm','rain','snow'])if(counts.has(kind))return counts.get(kind).text;
  return [...counts.values()].sort((a,b)=>b.count-a.count)[0]?.text||fallback;
};
const render=(threeHour,fiveDay)=>{
  const lang=root.dataset.language||'zh';
  const hourly=parseRows(threeHour),daily=parseRows(fiveDay);
  const hourlyRain=rainPeriods(hourly),dailyRain=rainPeriods(daily);
  if(!hourly.length&&!daily.length)throw new Error('No forecast locations returned');
  const now=Date.now(),tempRow=currentRowAt(hourly,now,temperature),skyRow=currentRowAt(hourly,now,weather);
  const temp=temperature(tempRow),condition=weather(skyRow);
  const activeRain=rainAt(new Date(now).toISOString(),hourlyRain);
  const nextRain=hourlyRain.find(period=>period.start>now&&period.start-now<=3*3600000);
  const precip=activeRain===null?(nextRain?.value??null):activeRain;
  put(card.querySelector('.ld-detail__cwa-temp'),temp===null?'--°':`${Math.round(temp)}°`);
  setCondition(condition||'預報資料已載入',condition?weatherEn(condition):'Forecast data loaded',!condition);
  setIcon(card.querySelector('.ld-detail__cwa-icon'),condition);
  const meta=card.querySelector('.ld-detail__cwa-current-meta');
  if(meta)put(meta.querySelector('.ld-detail__cwa-rain-value'),precip===null?'--%':`${Math.round(precip)}%`);
  const issued=card.querySelector('.ld-detail__cwa-observed-at');
  if(issued){issued.textContent=tempRow?.start?timeText(tempRow.start):'';if(tempRow?.start)issued.dateTime=tempRow.start;else issued.removeAttribute('datetime')}

  const upcoming=card.querySelector('.ld-detail__cwa-upcoming');
  const {today:todayForUpcoming,targets}=upcomingTargets(now);
  upcoming.replaceChildren();
  targets.forEach(target=>{
    const slot=document.createElement('div');slot.className='ld-detail__cwa-slot';
    const stamp=new Date(target).toISOString();
    const tRow=sourceRowAt(hourly,target,temperature),wRow=sourceRowAt(hourly,target,weather);
    const t=tRow&&target-Date.parse(tRow.start)<3*3600000?temperature(tRow):null;
    const w=wRow&&target-Date.parse(wRow.start)<3*3600000?weather(wRow):'';
    const p=rainAt(stamp,hourlyRain);
    const time=document.createElement('span');time.className='ld-detail__cwa-slot-time';time.textContent=upcomingTimeText(stamp,todayForUpcoming);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('aria-hidden','true');setIcon(svg,w);
    const value=document.createElement('strong');value.textContent=t===null?'--°':`${Math.round(t)}°`;
    const rainText=document.createElement('small');rainText.textContent=p===null?(lang==='en'?'Rain --%':'降雨 --%'):(lang==='en'?`Rain ${Math.round(p)}%`:`降雨 ${Math.round(p)}%`);
    slot.append(time,svg,value,rainText);upcoming.append(slot);
    slot.setAttribute('aria-label',`${upcomingTimeText(stamp,todayForUpcoming)} ${t===null?'--':Math.round(t)}° ${lang==='en'?'rain':'降雨'} ${p===null?'--':Math.round(p)}%`);
  });

  const grouped=new Map();
  daily.forEach(row=>{
    const key=String(row.start).slice(0,10);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(key))return;
    const item=grouped.get(key)||{date:row.start,rows:[]};
    item.rows.push(row);grouped.set(key,item);
  });
  const taipeiDateParts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const datePart=type=>taipeiDateParts.find(part=>part.type===type)?.value||'';
  const todayKey=`${datePart('year')}-${datePart('month')}-${datePart('day')}`;
  const visibleDays=[...grouped.entries()].filter(([key])=>key>todayKey).slice(0,5);
  const tiles=[...card.querySelectorAll('.ld-detail__cwa-day')];
  tiles.forEach((tile,i)=>{
    const entry=visibleDays[i];
    tile.hidden=!entry;
    if(!entry)return;
    const [key,day]=entry,rows=day.rows;
    tile.dataset.dayKey=key;
    const expanded=selectedDayKey===key;
    tile.classList.toggle('is-selected',expanded);
    tile.setAttribute('aria-expanded',String(expanded));
    let low=null,high=null,prob=null,conditionText='';
    rows.forEach(row=>{
      const lo=num(fieldValue(row,[/最低溫|MinTemperature|最低溫度/i]));
      const hi=num(fieldValue(row,[/最高溫|MaxTemperature|最高溫度/i]));
      const t=temperature(row);
      if(lo!==null)low=low===null?lo:Math.min(low,lo);
      if(hi!==null)high=high===null?hi:Math.max(high,hi);
      if(t!==null){low=low===null?t:Math.min(low,t);high=high===null?t:Math.max(high,t)}
      const p=rain(row);if(p!==null)prob=prob===null?p:Math.max(prob,p);
      if(!conditionText||iconType(weather(row))==='storm'||iconType(weather(row))==='rain')conditionText=weather(row);
    });
    conditionText=representativeDayWeather(hourly,key,conditionText);
    if(prob===null){
      const start=Date.parse(`${key}T00:00:00+08:00`),end=start+86400000;
      const values=dailyRain.filter(x=>x.start<end&&(!Number.isFinite(x.end)||x.end>start)).map(x=>x.value);
      if(values.length)prob=Math.max(...values);
    }
    const strongs=tile.querySelectorAll('strong');
    put(strongs[0],dateText(day.date,lang));setIcon(tile.querySelector('svg'),conditionText);
    put(strongs[1],low===null&&high===null?'--° / --°':`${low===null?'--':Math.round(low)}° / ${high===null?'--':Math.round(high)}°`);
    put(tile.querySelector('small'),prob===null?(lang==='en'?weatherEn(conditionText||'--'):(conditionText||'--')):(lang==='en'?`Rain ${Math.round(prob)}%`:`降雨 ${Math.round(prob)}%`));
    tile.setAttribute('aria-label',`${dateText(day.date,lang)} ${expanded?(lang==='en'?'Collapse daytime forecast':'收合白天預報'):(lang==='en'?'Open daytime forecast':'查看白天預報')}`);
  });
  setNote(noteZh,noteEn);
  const detail=card.querySelector('.ld-detail__cwa-day-detail');
  const selected=visibleDays.find(([key])=>key===selectedDayKey);
  detail.replaceChildren();
  detail.hidden=!selected;
  if(!selected)return;
  const [key,day]=selected;
  const head=document.createElement('div');head.className='ld-detail__cwa-detail-head';
  const title=document.createElement('strong');title.textContent=`${dateText(day.date,lang)} · ${lang==='en'?'Daytime forecast':'白天預報'}`;
  head.append(title);detail.append(head);
  const dayRows=hourly.filter(row=>{
    const start=String(row.start),hour=Number(start.slice(11,13));
    return start.slice(0,10)===key&&hour>=6&&hour<=18&&(temperature(row)!==null||weather(row));
  });
  const noteEl=document.createElement('p');noteEl.className='ld-detail__cwa-detail-note';
  if(!dayRows.length){
    noteEl.textContent=lang==='en'?'The CWA has not released time-of-day forecasts for this date. Use the daily overview above.':'氣象署尚未提供這一天的分時預報；請參考上方每日概覽。';
    detail.append(noteEl);return;
  }
  const gaps=dayRows.slice(1).map((row,i)=>Date.parse(row.start)-Date.parse(dayRows[i].start));
  const hourlyCoverage=gaps.length&&gaps.every(gap=>gap===3600000);
  noteEl.textContent=hourlyCoverage
    ?(lang==='en'?'Hourly temperature; sky and rain are shown at the CWA’s available intervals.':'氣溫逐時提供；天氣與降雨依氣象署提供的時段顯示。')
    :(lang==='en'?'The CWA provides forecasts only at the times shown below for this date.':'此日期僅顯示氣象署實際提供的分時資料。');
  detail.append(noteEl);
  const strip=document.createElement('div');strip.className='ld-detail__cwa-detail-hours';
  dayRows.forEach(row=>{
    const t=Date.parse(row.start),w=weather(sourceRowAt(hourly,t,weather));
    const p=rainAt(row.start,hourlyRain),c=temperature(row);
    const item=document.createElement('div');item.className='ld-detail__cwa-hour';
    const time=document.createElement('time');time.dateTime=row.start;time.textContent=timeText(row.start);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('aria-hidden','true');setIcon(svg,w);
    const value=document.createElement('strong');value.textContent=c===null?'--°':`${Math.round(c)}°`;
    const conditionText=document.createElement('span');conditionText.textContent=w?(lang==='en'?weatherEn(w):w):'--';conditionText.title=conditionText.textContent;
    const rainText=document.createElement('small');rainText.textContent=p===null?(lang==='en'?'Rain --%':'降雨 --%'):(lang==='en'?`Rain ${Math.round(p)}%`:`降雨 ${Math.round(p)}%`);
    item.append(time,svg,value,conditionText,rainText);strip.append(item);
  });
  detail.append(strip);
};
let latestForecast=null;const refreshForecast=()=>{if(!latestForecast)return;render(latestForecast.threeHour,latestForecast.fiveDay);if(latestForecast.weeklyError)setNote('目前天氣已載入；五日預報暫時無法取得。','Current weather loaded; the 5-day forecast is temporarily unavailable.')};document.addEventListener('ld-language-change',refreshForecast);
card.addEventListener('click',event=>{const tile=event.target.closest('.ld-detail__cwa-day');if(tile?.dataset.dayKey){selectedDayKey=selectedDayKey===tile.dataset.dayKey?null:tile.dataset.dayKey;refreshForecast()}});
setCondition('天氣資料載入中…','Loading weather data…',true);
fetch(API_URL,{headers:{Accept:'application/json'}}).then(async response=>{const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Weather API ${response.status}: ${data.detail||data.error||'no diagnostic returned'}`);return data}).then(data=>{latestForecast=data;refreshForecast()}).catch(error=>{console.warn('CWA forecast unavailable:',error);setCondition('氣象資料暫時無法載入','Weather data is temporarily unavailable',true);setNote(failZh,failEn)});
})();
})();
