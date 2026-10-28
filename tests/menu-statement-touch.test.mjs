import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const base=path.dirname(fileURLToPath(import.meta.url));
const embedPath=process.argv[2]||path.join(base,'../webflow-embeds/menu-overlay-full.html');
const html=fs.readFileSync(embedPath,'utf8');
const registration=html.match(/scroll\.addEventListener\('touchmove',[^\n]+/);
assert.ok(registration,'The statement scroll surface needs a touch handler');
const handlers=new Map();
const dialog={open:true};
vm.runInNewContext(registration[0],{
  scroll:{addEventListener(type,listener,options){handlers.set(type,{listener,options});}},
  dialog
});
const {listener,options}=handlers.get('touchmove');
assert.equal(options.passive,true,'Native scrolling must remain passive');

// Finsweet v1 blocks single-finger touchmove at document level while the menu
// is locked. Model propagation from a child of a late-created dialog to it.
function gesture({inside=true,fingers=1,open=true}={}){
  dialog.open=open;
  let stopped=false,prevented=false,documentReached=false;
  const event={touches:Array(fingers).fill({clientY:100}),
    stopPropagation(){stopped=true;},preventDefault(){prevented=true;}};
  if(inside)listener(event);
  if(!stopped){documentReached=true;if(fingers===1)event.preventDefault();}
  return {stopped,prevented,documentReached};
}
assert.deepEqual(gesture(),{stopped:true,prevented:false,documentReached:false},
  'A single-finger gesture in the open statement must reach native scrolling');
assert.deepEqual(gesture({inside:false}),{stopped:false,prevented:true,documentReached:true},
  'The surrounding page must remain locked');
assert.deepEqual(gesture({fingers:2}),{stopped:false,prevented:false,documentReached:true},
  'Do not intercept pinch gestures');
assert.deepEqual(gesture({open:false}),{stopped:false,prevented:true,documentReached:true},
  'Do not bypass the page lock when the statement is closed');
assert.match(html,/scroll\.setAttribute\('fs-scrolldisable-element','preserve'\)/);
assert.ok(html.length<50000,'The full Embed must fit Webflow');
for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
console.log('PASS: statement native touch scrolling, background lock, pinch gestures and Embed syntax');
