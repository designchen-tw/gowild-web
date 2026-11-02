import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../course-pdf-lightbox-v3.js',import.meta.url),'utf8');
function fixture(mode='normal'){
 const rootAttrs=new Map(),listeners={},attrs=new Map(),views=[],styles=[];let focused=0;
 const button={dataset:{pdfUrl:'https://example.org/course.pdf',pdfFileName:'課程.pdf'},isConnected:true,addEventListener:(name,fn)=>listeners[name]=fn,setAttribute:(key,value)=>attrs.set(key,value),removeAttribute:key=>attrs.delete(key),focus:()=>focused++};
 const container={id:'adobe-pdf-view',dataset:{pdfClientId:'public-client-id'}},status={hidden:true,setAttribute(){}};
 class View{constructor(){views.push(this)}registerCallback(kind,fn,options){this.callback=fn;this.options=options}previewFile(content,options){this.previewOptions=options;assert(rootAttrs.has('data-gw-course-pdf-open'));if(mode==='throw')throw Error('sdk');if(mode==='reject')return Promise.reject(Error('network'));return Promise.resolve({})}}
 View.Enum={CallbackType:{EVENT_LISTENER:'EVENT_LISTENER'}};
 const document={documentElement:{setAttribute:(key,val)=>rootAttrs.set(key,val),removeAttribute:key=>rootAttrs.delete(key)},readyState:'complete',getElementById:()=>null,querySelector:selector=>({'[data-course-pdf]':button,'[data-course-pdf-view]':container,'[data-course-pdf-status]':status,'[data-gw-course]':{dataset:{language:'zh'}}})[selector]||null,createElement:()=>({}),head:{appendChild:node=>styles.push(node)},addEventListener(){}};
 vm.runInNewContext(source,{document,window:{AdobeDC:{View}},Promise,Error,console:{warn(){}}});
 return{open:()=>listeners.click({preventDefault(){}}),event:(type,index=views.length-1)=>views[index].callback({type}),attrs,views,status,styles,hidden:()=>rootAttrs.has('data-gw-course-pdf-open'),focused:()=>focused};
}
const ui=fixture();ui.open();assert(ui.hidden());assert(ui.attrs.has('aria-busy'));assert(ui.views[0].options.enableFilePreviewEvents);ui.event('PDF_VIEWER_OPEN');await Promise.resolve();await Promise.resolve();assert(ui.hidden(),'preview promise completion must not restore header');assert(!ui.attrs.has('aria-busy'));assert.equal(ui.views[0].previewOptions.showDownloadPDF,false);assert.equal(ui.views[0].previewOptions.showPrintPDF,false);assert.equal(ui.views[0].previewOptions.exitPDFViewerType,'CLOSE');
ui.open();assert.equal(ui.views.length,1,'do not open another viewer over an open lightbox');
ui.event('PDF_VIEWER_CLOSE');assert(!ui.hidden());assert.equal(ui.focused(),1);
ui.open();assert.equal(ui.views.length,2);ui.event('PDF_VIEWER_OPEN');ui.event('PDF_VIEWER_CLOSE',0);assert(ui.hidden(),'late events from a previous viewer must not expose App header');
ui.event('APP_RENDERING_FAILED');assert(ui.hidden(),'visible error viewer still needs an unobstructed native close');ui.event('PDF_VIEWER_CLOSE');assert(!ui.hidden());
for(const mode of ['throw','reject']){const failed=fixture(mode);failed.open();await Promise.resolve();await Promise.resolve();assert(!failed.hidden(),mode);assert(!failed.status.hidden,mode);assert(!failed.attrs.has('aria-busy'),mode)}
const css=ui.styles[0].textContent;for(const name of ['.navigation.gw','.gw-app-brand','.navi-buttom-block.gw','.gw-app-reload','.gw-course__nav'])assert(css.includes(name));assert(css.includes('visibility:hidden!important'));assert(!css.includes('display:none'));
console.log('PASS: hide all site/App chrome before preview, retain native close and PDF controls, restore on close/early failure, keep error viewer close usable, repeated opens, ignore stale callbacks, no print/download, preserve page layout.');
