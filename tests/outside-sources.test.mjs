import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const script=fs.readFileSync(new URL('../outside-of-rock-v9.js',import.meta.url),'utf8');
const original=fs.readFileSync(new URL('../outside-of-rock-v8.js',import.meta.url),'utf8');
assert.equal(script.slice(script.indexOf('  const systems ='),script.indexOf('  function render(language)')),original.slice(original.indexOf('  const systems ='),original.indexOf('  function render(language)')),'Instructor, skill and guide data changed');
assert.equal(script.slice(script.indexOf('  const goals ='),script.indexOf('  const lanes =')),original.slice(original.indexOf('  const goals ='),original.indexOf('  const lanes =')),'Activity descriptions changed');
assert.equal(script.slice(script.indexOf('  const lanes ='),script.indexOf('  const sourceGroups =')),original.slice(original.indexOf('  const lanes ='),original.indexOf('  const sources =')),'Avalanche or medicine data changed');
new vm.Script(script);
const fields=new Map(),listeners=new Map();
function node(id){if(!fields.has(id))fields.set(id,{id,innerHTML:'',dataset:{},hidden:false,setAttribute(){},removeAttribute(){},addEventListener(){},focus(){},getBoundingClientRect(){return{top:1000}}});return fields.get(id);}
const sourceOpen=[{dataset:{sourceCategory:'medicine'}}];
const root={dataset:{},addEventListener:(name,handler)=>listeners.set(name,handler),querySelector(selector){return node(selector.match(/\[id="([^"]+)"\]/)?.[1]||selector)},querySelectorAll(selector){if(selector==='.source-category[open]')return sourceOpen;if(selector===':scope > section')return ['outside-paths','outside-skills','outside-avalanche','outside-medicine','outside-profession','outside-sources'].map(node);return[]}};
const context=vm.createContext({document:{getElementById:()=>root},window:{innerHeight:800,addEventListener(){},requestAnimationFrame(){}}});
vm.runInContext(script,context);
function assertSources(){
 const html=node('source-grid').innerHTML;
 const urls=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(urls.length,65);assert.equal(new Set(urls).size,65);
 assert.equal((html.match(/class="source-category"/g)||[]).length,6);
 assert.match(html,/data-source-category="medicine" open/);
 assert.doesNotMatch(html,/undefined|\[object Object\]/);
 assert(urls.includes('https://casi-acms.com/courses/level-3-instructor/'));
 assert(urls.includes('https://avalancheassociation.ca/training/prior-learning-assessment/'));
 assert(urls.includes('https://wildmed.com/courses/recertification/hybrid-wilderness-first-responder-recertification/'));
 for(const [id,field]of fields)if(id!=='source-grid')assert.doesNotMatch(field.innerHTML,/<a\b[^>]*href="https?:/,id);
 assert.doesNotMatch(node('medicine-list').innerHTML,/medicine-provider-sources/);
 assert.equal((node('medicine-list').innerHTML.match(/class="medicine-provider-card"/g)||[]).length,8);
 assert.doesNotMatch(node('medicine-list').innerHTML,/<table/);
 return html;
}
assert.equal(root.dataset.outsideReady,'true');assertSources();
function click(selector,button){listeners.get('click')({target:{closest:value=>value===selector?button:null}});}
click('[data-lane]',{dataset:{lane:'operations'}});assert.match(node('avalanche-panel').innerHTML,/Ops 2/);assertSources();
click('[data-lane]',{dataset:{lane:'rescue'}});assert.match(node('avalanche-panel').innerHTML,/AvSAR L2/);assertSources();
click('button[data-language]',{dataset:{language:'en'}});assert.equal(root.dataset.language,'en');assert.match(assertSources(),/Wilderness medicine/);assert.match(node('avalanche-panel').innerHTML,/AvSAR L2/);
click('button[data-language]',{dataset:{language:'zh'}});assert.equal(root.dataset.language,'zh');assert.match(assertSources(),/野外急救/);
const page=fs.readFileSync(new URL('../webflow-embeds/outside-of-rock.html',import.meta.url),'utf8');
assert(page.length<50000);
for(const m of page.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
const before=page.slice(0,page.indexOf('id="outside-sources"'));
assert.doesNotMatch(before,/<a\b[^>]*href="https?:/);
assert(page.includes('&#x2197;&#xFE0E;'));assert(script.includes('\\u2197\\uFE0E'));assert.equal((page.match(/data-nav="/g)||[]).length,5);
console.log('PASS: 65 unique sources, six categories, body links removed, eight separate provider cards, no empty table/source rows, bilingual state preserved, five nav items, fallback sources, valid scripts and Embed <50,000 characters.');
