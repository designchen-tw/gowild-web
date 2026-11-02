import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
for(const slug of ['longdong','defulan','guanziling','kenting']){
 const html=readFileSync(new URL('../webflow-embeds/'+slug+'.html',import.meta.url),'utf8');
 assert.ok(html.length<50000,slug+' Webflow Embed limit');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
 for(const code of scripts)new vm.Script(code,{filename:slug+'.html'});
 const sources=[];const context={location:{protocol:'https:',hostname:'gowild.one'},document:{createElement:()=>({}),head:{appendChild:el=>{if(el.src)sources.push(el.src)}}}};
 vm.runInNewContext(scripts.at(-1),context);
 const names=slug==='longdong'?['longdong-conditions-widget-v39.js','longdong-cwa-widget-v18.js']:['climbing-conditions-widget-v8.js','weather-card-widget-v9.js'];
 for(const name of names)assert.ok(sources.some(url=>/^https:\/\/cdn.jsdelivr.net\/gh\/designchen-tw\/gowild-web@[a-f0-9]{40}\//.test(url)&&url.endsWith('/'+name)),slug+' pinned '+name);
 assert.ok(sources.some(url=>url.includes('sector-map-')),slug+' map loader retained');
 console.log('PASS: '+slug+' inline syntax, exact pinned weather helpers, map loader and Embed size');
}
