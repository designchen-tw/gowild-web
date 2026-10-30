import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const folder=path.dirname(fileURLToPath(import.meta.url));
const sourceFile=process.argv[2]||path.join(folder,'../longdong-conditions-widget-v37.js');
const source=fs.readFileSync(sourceFile,'utf8');
new vm.Script(source);
const start=source.indexOf('function bindRoadCamera(image)');
const end=source.indexOf("cameras.querySelectorAll('img[data-camera-src]')");
assert.ok(start>0&&end>start);
const loader=source.slice(start,end);

function fixture(language='zh',observe=true){
  let next=0,observer,offline=false;const card={dataset:{}};const timers=new Map(),created=[];
  const message={dataset:{},hidden:false,textContent:'',setAttribute(){}};
  const frame={appendChild(node){created.push(node);}};
  class Image extends EventTarget{
    constructor(){super();this.dataset={cameraSrc:'https://camera.example/stream'};this.classList={add(){}};this.naturalWidth=0;this.hidden=false;this.src='';}
    closest(selector){return selector==='article'?card:frame;}getAttribute(key){return this[key]||null;}removeAttribute(key){delete this[key];}
  }
  const root={dataset:{language}},image=new Image();
  const context={root,mediaControls:[],sortCameras(){},isOffline:()=>offline,document:{createElement:()=>message},setTimeout(callback,delay){timers.set(++next,{callback,delay});return next;},clearTimeout(id){timers.delete(id);}};
  if(observe)context.IntersectionObserver=class{constructor(callback){this.callback=callback;observer=this;}observe(){}disconnect(){this.disconnected=true;}};
  vm.createContext(context);vm.runInContext(loader+'\nthis.bind=bindRoadCamera;',context);
  context.bind(image);
  function run(delay){const row=[...timers].find(([,value])=>value.delay===delay);assert.ok(row,'Expected timer '+delay);timers.delete(row[0]);row[1].callback();}
  return {root,image,message,timers,created,run,setOffline(value){offline=value;context.mediaControls.forEach(sync=>sync());},show(){observer.callback([{isIntersecting:true}]);},observer};
}
let f=fixture();
assert.equal(f.image.src,'','Off-screen cameras should not start streams');
f.show();assert.equal(f.image.src,'https://camera.example/stream');
f.image.dispatchEvent(new Event('error'));
assert.equal(f.message.textContent,'影像來源暫時失效');assert.equal(f.image.hidden,true);assert.equal(f.image.src,undefined);assert.equal(f.timers.size,0);

f=fixture();f.show();f.image.naturalWidth=640;f.run(500);
assert.equal(f.image.dataset.cameraState,'ready','MJPEG first frame must work without a load event');
assert.equal(f.message.hidden,true);assert.equal(f.image.hidden,false);assert.equal(f.timers.size,0);
f.image.dispatchEvent(new Event('error'));assert.equal(f.image.hidden,true);assert.equal(f.message.hidden,false);

f=fixture('en');f.show();f.run(16000);
assert.equal(f.message.textContent,'Camera source temporarily unavailable');assert.equal(f.image.hidden,true);assert.equal(f.timers.size,0);
f.image.naturalWidth=640;f.image.dispatchEvent(new Event('load'));
assert.equal(f.image.dataset.cameraState,'unavailable','Ignore stale events after a timed-out request is cancelled');

f=fixture('en',false);assert.equal(f.image.src,'https://camera.example/stream');
f.image.naturalWidth=640;f.image.dispatchEvent(new Event('load'));
assert.equal(f.image.dataset.cameraState,'ready');assert.equal(f.created.length,1);
assert.equal(f.message.dataset.langZh,'影像載入中…');
f=fixture();f.setOffline(true);f.show();assert.equal(f.message.textContent,'此內容需要網路連線');f.image.dispatchEvent(new Event('error'));assert.equal(f.message.textContent,'此內容需要網路連線');assert.equal(f.image.hidden,true);f.setOffline(false);assert.equal(f.image.dataset.cameraState,'loading');f.image.naturalWidth=320;f.image.dispatchEvent(new Event('load'));assert.equal(f.image.dataset.cameraState,'ready');
assert.ok(source.includes('88K+150(S)'));
assert.ok(source.includes('7fDA_cR12qg'));assert.ok(!source.includes('q7wy94TiBBw'));
assert.ok(source.includes('img[data-camera-src]'));
console.log('PASS: first frame, errors, timeout, offline precedence and reconnect recovery');
