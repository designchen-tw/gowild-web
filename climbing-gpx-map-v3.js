/* Shared camera, selection, positioning and compass for GPX crag maps. */
window.GoWildGPXMap = function ({
  prefix, samples, css, markup, sectors, translate, labelAnchors = {},
  sectorAliases = {}, annotationId, overviewBounds, overviewPadding,
  sectorView, numberOffset, hitPadding = 14, getArtwork
}) {
  const root = document.querySelector(`[data-${prefix}-detail]`);
  const mount = root?.querySelector(`[data-${prefix}-sector-map]`);
  const cards = [...(root?.querySelectorAll(`.${prefix}-detail__area-grid > article`) || [])];
  if (!mount || cards.length !== sectors.length || mount.dataset.ready) return;
  const style = document.createElement('style');
  const waypoint = `[data-${prefix}-sector-map] #${prefix}-gps-map-art.gw-gpx-map .gw-gpx-waypoint`;
  const scope = `main.${prefix}-detail [data-${prefix}-sector-map]`;
  style.textContent = css + `
    ${scope} .gw-gpx-expand {
      position:absolute; right:14px; bottom:14px;
      background:var(--gw-map-control-bg); -webkit-tap-highlight-color:transparent;
    }
    ${scope} .map-views { max-width:calc(100% - 84px); flex-wrap:wrap; }
    @media (hover:hover) and (pointer:fine) {
      ${scope} .gw-gpx-expand:hover { background:var(--gw-map-control-hover-bg); }
    }
    html:has(.gw-gpx-dialog[open]) { overflow:hidden; }
    ${scope} .gw-gpx-dialog {
      box-sizing:border-box; inset:0; width:100%; max-width:none;
      height:100vh; height:100dvh; max-height:none; margin:0; border:0;
      padding:env(safe-area-inset-top) env(safe-area-inset-right)
        env(safe-area-inset-bottom) env(safe-area-inset-left);
      background:var(--gw-crag-bg,#0b0d0e); color:var(--gw-crag-text,#ededed);
      overflow:hidden;
    }
    ${scope} .gw-gpx-dialog[open] { display:flex; flex-direction:column; }
    ${scope} .gw-gpx-dialog::backdrop { background:var(--gw-crag-bg,#0b0d0e); }
    ${scope} .gw-gpx-dialog > header {
      display:flex; align-items:center; justify-content:space-between;
      flex:none; min-height:48px; padding:0 12px 0 16px;
    }
    ${scope} .gw-gpx-dialog h3 { margin:0; font-family:inherit; font-size:14px; font-weight:500; line-height:1.5; outline:none; }
    ${scope} .gw-gpx-close {
      width:44px; height:44px; display:grid; place-items:center; padding:0;
      border:0; border-radius:4px; background:transparent;
      -webkit-tap-highlight-color:transparent;
    }
    ${scope} .gw-gpx-close svg {
      width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:1.5;
    }
    ${scope} .gw-gpx-dialog .gw-gpx-content {
      display:flex; flex:1; flex-direction:column; min-height:0;
    }
    ${scope} .gw-gpx-dialog .map-frame {
      flex:1; min-height:0; height:auto; aspect-ratio:auto; border:0; border-radius:0;
    }
    ${scope} .gw-gpx-dialog .map-views { max-width:calc(100% - 28px); }
    ${scope} .gw-gpx-dialog .gw-gpx-expand,
    ${scope} .gw-gpx-dialog .location-detail:empty { display:none; }
    ${scope} .gw-gpx-dialog .location-status { flex:none; margin:8px 16px 4px; }
    ${scope} .gw-gpx-dialog .location-detail { flex:none; margin:0 16px 4px 31px; min-height:0; }

    ${waypoint} {
      fill: #c3decf !important;
      stroke: #20292a !important;
      stroke-width: 1px !important;
      vector-effect: non-scaling-stroke;
    }
    html[data-gw-theme="light"] ${waypoint} {
      fill: var(--gw-crag-map-landmark, #69765f) !important;
      stroke: var(--gw-crag-map-open, #e0e5dc) !important;
    }
  `;
  const template = document.createElement('template');
  template.innerHTML = markup;
  const content = document.createElement('div');
  content.className = 'gw-gpx-content';
  content.append(template.content);
  mount.append(style, content);
  const get = id => mount.querySelector(`#${prefix}-gps-${id}`);
  const viewport = mount.querySelector('.viewport');
  const mapFrame = mount.querySelector('.map-frame');
  const svg = get('map-art');
  svg.classList.add('gw-gpx-map');
  svg.querySelectorAll('#point circle, circle[data-map-waypoint]').forEach(point => {
    point.classList.add('gw-gpx-waypoint');
  });
  const ns = 'http://www.w3.org/2000/svg';
  const [left, top, width, height] = samples.bounds;
  const right = left + width;
  const bottom = top + height;
  const units = samples.svgUnitsPerMeter;
  sectors.forEach(([zh, en]) => { translate[zh] = en; });
  let language = 'zh';
  const t = (zh,en) => language === 'en' ? en : zh;
  function make(tag, attributes, parent) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key,value]) => node.setAttribute(key,String(value)));
    parent.append(node);
    return node;
  }
  function project(latitude, longitude) {
    return [
      samples.origin.x + (longitude - samples.origin.longitude) * samples.metersPerDegree.longitude * units,
      samples.origin.y - (latitude - samples.origin.latitude) * samples.metersPerDegree.latitude * units
    ];
  }
  function inside([x,y]) {
    return x >= left && x <= right && y >= top && y <= bottom;
  }
  const recordedSegments = samples.recordedSegments;
  function trackDistance([x,y]) {
    let nearest = Infinity;
    for (const segment of recordedSegments) {
      for (let i=1; i<segment.length; i++) {
        const [ax,ay] = segment[i-1];
        const [bx,by] = segment[i];
        const length = (bx-ax)**2 + (by-ay)**2;
        const fraction = length ? Math.max(0,Math.min(1,((x-ax)*(bx-ax)+(y-ay)*(by-ay))/length)) : 0;
        nearest = Math.min(nearest,Math.hypot(x-ax-fraction*(bx-ax),y-ay-fraction*(by-ay)));
      }
    }
    return nearest / units;
  }
  const liveLayer = make('g',{id:'gps-live-layer',display:'none'},svg);
  const halo = make('circle',{id:'gps-area',cx:0,cy:0,r:0},liveLayer);
  const headingGradient=make('radialGradient',{id:'gps-heading-gradient',cx:'.5',cy:'1',r:'1'},svg.querySelector('defs'));
  make('stop',{offset:'0%','stop-color':'#78c7e7','stop-opacity':'.4'},headingGradient);
  make('stop',{offset:'100%','stop-color':'#78c7e7','stop-opacity':'0'},headingGradient);
  const directionLayer = make('g',{id:'gps-direction',display:'none'},liveLayer);
  make('path',{d:'M0 -4 L-27 -51 Q0 -67 27 -51 Z',class:'direction-beam'},directionLayer);
  make('path',{d:'M0 -25 L-7 -10 L0 -13 L7 -10 Z',class:'direction-tip'},directionLayer);
  const dot = make('circle',{id:'gps-dot',cx:0,cy:0,r:1},liveLayer);
  const camera = {x:left+width/2,y:top+height/2,scale:1};
  let minScale;
  let maxScale;
  function drawCamera() {
    camera.scale = Math.max(minScale,Math.min(maxScale,camera.scale));
    const viewWidth = viewport.clientWidth / camera.scale;
    const viewHeight = viewport.clientHeight / camera.scale;
    camera.x = viewWidth >= width ? left+width/2 : Math.max(left+viewWidth/2,Math.min(right-viewWidth/2,camera.x));
    camera.y = viewHeight >= height ? top+height/2 : Math.max(top+viewHeight/2,Math.min(bottom-viewHeight/2,camera.y));
    svg.setAttribute('viewBox',`${camera.x-viewWidth/2} ${camera.y-viewHeight/2} ${viewWidth} ${viewHeight}`);
    dot.setAttribute('r',6/camera.scale);
    renderHeading();
    get('zoom-out').disabled = camera.scale <= minScale+.00001;
    get('zoom-in').disabled = camera.scale >= maxScale-.00001;
  }
  function frame(rect, padding=100) {
    camera.scale = Math.min(viewport.clientWidth/(rect.width+padding*2),viewport.clientHeight/(rect.height+padding*2));
    camera.x = rect.x + rect.width/2;
    camera.y = rect.y + rect.height/2;
    drawCamera();
  }
  function overview() { frame(overviewBounds, overviewPadding); }
  function fullMap() { frame({x:left,y:top,width,height},0); }
  function zoom(multiplier, screenX=viewport.clientWidth/2, screenY=viewport.clientHeight/2) {
    const x = camera.x + (screenX-viewport.clientWidth/2)/camera.scale;
    const y = camera.y + (screenY-viewport.clientHeight/2)/camera.scale;
    camera.scale = Math.max(minScale,Math.min(maxScale,camera.scale*multiplier));
    camera.x = x - (screenX-viewport.clientWidth/2)/camera.scale;
    camera.y = y - (screenY-viewport.clientHeight/2)/camera.scale;
    drawCamera();
  }
  let initialCamera = true;
  const resize = new ResizeObserver(() => {
    const oldMin = minScale;
    minScale = Math.max(viewport.clientWidth/width,viewport.clientHeight/height);
    maxScale = Math.max(minScale*12,viewport.clientWidth/850);
    if (initialCamera) { overview(); initialCamera=false; }
    else {
      if (Math.abs(camera.scale-oldMin)<.00001) camera.scale = minScale;
      drawCamera();
    }
  });
  resize.observe(viewport);
  get('zoom-in').onclick = () => zoom(1.35);
  get('zoom-out').onclick = () => zoom(1/1.35);
  get('overview').onclick = overview;
  get('full').onclick = fullMap;
  // Keep touch coordinates in screen space while changing the SVG viewBox.
  const pointers = new Map();
  let gesture = null;
  let lastTap = null;
  let press = null;
  let moved = false;
  let quickZoom = null;

  function gestureState() {
    const [first, second] = pointers.values();
    if (!second) return {...first, distance: 0};
    return {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
      distance: Math.hypot(second.x - first.x, second.y - first.y)
    };
  }

  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const point = {x: event.clientX, y: event.clientY};
    pointers.set(event.pointerId, point);
    gesture = gestureState();
    if (pointers.size === 1) {
      press = {...point, time: event.timeStamp, sector: event.target.closest('[data-sector]')};
      moved = false;
      if (event.pointerType === 'touch' && lastTap && event.timeStamp - lastTap.time <= 325 &&
          Math.hypot(point.x - lastTap.x, point.y - lastTap.y) <= 32) {
        quickZoom = point;
      }
    } else {
      quickZoom = null;
      moved = true;
    }
    lastTap = null;
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  });

  viewport.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    const next = gestureState();
    if (!moved) {
      const distance = quickZoom ? Math.abs(next.y - press.y) : Math.hypot(next.x - press.x, next.y - press.y);
      if (distance <= 6) return;
      moved = true;
    }
    get('follow').checked = false;
    const rect = viewport.getBoundingClientRect();
    if (quickZoom) {
      zoom(Math.exp((next.y - gesture.y) / 120), quickZoom.x - rect.left, quickZoom.y - rect.top);
    } else {
      if (gesture.distance && next.distance) {
        zoom(next.distance / gesture.distance, gesture.x - rect.left, gesture.y - rect.top);
      }
      camera.x -= (next.x - gesture.x) / camera.scale;
      camera.y -= (next.y - gesture.y) / camera.scale;
      drawCamera();
    }
    gesture = next;
  });

  function release(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    if (!pointers.size) {
      if (event.type === 'pointerup' && !moved) {
        if (press.sector) selectSector(Number(press.sector.dataset.sector));
        if (event.pointerType === 'touch' && !quickZoom && event.timeStamp - press.time <= 250) {
          lastTap = {x: event.clientX, y: event.clientY, time: event.timeStamp};
        }
      }
      quickZoom = null;
      press = null;
      viewport.classList.remove('is-dragging');
    }
    gesture = pointers.size ? gestureState() : null;
  }
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('lostpointercapture', release);
  viewport.addEventListener('wheel',event => {
    event.preventDefault();
    get('follow').checked=false;
    if (event.ctrlKey || event.metaKey) {
      const rect=viewport.getBoundingClientRect();
      zoom(Math.exp(-event.deltaY*.008),event.clientX-rect.left,event.clientY-rect.top);
    } else {
      camera.x+=event.deltaX/camera.scale;
      camera.y+=event.deltaY/camera.scale;
      drawCamera();
    }
  },{passive:false});
  viewport.addEventListener('keydown',event => {
    if (event.target!==viewport) return;
    const shifts={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
    if (shifts[event.key]) {
      event.preventDefault();
      get('follow').checked=false;
      camera.x+=shifts[event.key][0]*70/camera.scale;
      camera.y+=shifts[event.key][1]*70/camera.scale;
      drawCamera();
    } else if (event.key==='+' || event.key==='=') zoom(1.35);
    else if (event.key==='-') zoom(1/1.35);
  });

  const {crag, sources, orderedRings} = getArtwork(svg);
  let selected = -1;
  const mapLabels = [];
  function accessibleSector(node,index) {
    node.dataset.sector=index;
    node.setAttribute('role','button');
    node.setAttribute('tabindex','0');
    node.setAttribute('aria-pressed','false');
    node.addEventListener('keydown',event=>{
      if(event.key==='Enter' || event.key===' ') { event.preventDefault(); selectSector(index); }
    });
  }
  const numbers=sectors.map((_,index)=>{
    for (const shape of sources[index]) {
      shape.classList.add('sector-shape');
      accessibleSector(shape,index);
    }
    const ring=orderedRings[index];
    ring.classList.add('sector-ring');
    accessibleSector(ring,index);
    return make('text',{x:ring.getAttribute('cx'),y:Number(ring.getAttribute('cy'))+numberOffset,'text-anchor':'middle','class':'sector-number'},crag);
  });
  numbers.forEach((node,index)=>{node.textContent=String(index+1).padStart(2,'0');});
  const nameIndices=Object.fromEntries(sectors.map(([name],index)=>[name,index]));
  Object.assign(nameIndices, sectorAliases);
  [...svg.querySelectorAll('text:not(.sector-number)')].forEach(text=>{
    const zh=text.textContent.trim();
    const en=translate[zh] || zh;
    const index=nameIndices[zh];
    const labelId=text.closest('[id^="gpx-label-"]')?.id;
    const original=[...text.childNodes].map(node=>node.cloneNode(true));
    const originalX=text.getAttribute('x');
    const originalAnchor=text.getAttribute('text-anchor');
    const anchor=originalAnchor || text.dataset.align || labelAnchors[labelId] || 'start';
    let group=null;
    if (index!==undefined) {
      group=make('g',{'class':'sector-label'},text.parentNode);
      const transform=text.getAttribute('transform');
      if (transform) {group.setAttribute('transform',transform); text.removeAttribute('transform');}
      group.append(text);
      const hit=make('rect',{},group);
      group.insertBefore(hit,text);
      accessibleSector(group,index);
    }
    mapLabels.push({text,zh,en,index,group,original,originalX,originalAnchor,anchor});
  });
  const guideAnnotation=annotationId ? svg.querySelector(annotationId) : null;
  let annotationChinese=null,annotationEnglish=null;
  if(guideAnnotation) {
    const box=guideAnnotation.getBBox();
    const children=[...guideAnnotation.childNodes];
    annotationChinese=make('g',{'class':'guide-annotation-chinese'},guideAnnotation);
    annotationChinese.append(...children);
    annotationEnglish=make('text',{'class':'cls-6','text-anchor':'end',display:'none'},guideAnnotation);
    ['Sunshine Wall rock formation','Listed in the Dragon Wall guide'].forEach((line,index)=>{
      const span=make('tspan',{x:box.x+box.width,y:box.y+11+index*14.4},annotationEnglish);
      span.textContent=line;
    });
  }
  function renderCards() {
    cards.forEach((card,index)=>{
      card.classList.toggle('is-map-selected',index===selected);
      card.setAttribute('aria-pressed',String(index===selected));
      card.querySelector(`.${prefix}-map-card-button`)?.setAttribute('aria-pressed',String(index===selected));
    });
  }
  function selectSector(index) {
    if (!Number.isInteger(index) || !sectors[index]) return;
    selected=index;
    mount.dataset.selected=String(index+1);
    svg.querySelectorAll('[data-sector]').forEach(node=>{
      const active=Number(node.dataset.sector)===index;
      node.classList.toggle('is-active',active);
      node.setAttribute('aria-pressed',String(active));
    });
    numbers.forEach((node,i)=>node.classList.toggle('is-active',i===index));
    renderCards();
    const ring=orderedRings[index];
    const bounds=sources[index].reduce((rect,node)=>{
      const b=node.getBBox();
      return {x:Math.min(rect.x,b.x),y:Math.min(rect.y,b.y),right:Math.max(rect.right,b.x+b.width),bottom:Math.max(rect.bottom,b.y+b.height)};
    },{x:Number(ring.getAttribute('cx'))-100,y:Number(ring.getAttribute('cy'))-100,right:Number(ring.getAttribute('cx'))+100,bottom:Number(ring.getAttribute('cy'))+100});
    // Preserve a surrounding view so the selected rock still has geographic context.
    camera.x=(bounds.x+bounds.right)/2;
    camera.y=(bounds.y+bounds.bottom)/2;
    camera.scale=Math.max(camera.scale,Math.min(viewport.clientWidth/sectorView.width,viewport.clientHeight/sectorView.height));
    get('follow').checked=false;
    drawCamera();
  }

  let mode='idle';
  let fix=null;
  let watch=null;
  let generation=0;
  let lastProblem=null;
  const status=get('status');
  function renderPosition() {
    mount.querySelector('.location-status').dataset.mode=mode;
    get('gps').setAttribute('aria-pressed',String(mode==='gps'));
    get('gps').setAttribute('aria-label',mode==='gps'?t('停止裝置定位','Stop GPS'):t('使用裝置定位','Use GPS'));
    get('gps').title=get('gps').getAttribute('aria-label');
    get('recenter').hidden=!fix || !inside(fix.xy);
    liveLayer.setAttribute('display',fix && inside(fix.xy)?'inline':'none');
    get('position-detail').textContent='';
    if(lastProblem) {status.textContent=t(...lastProblem);renderHeading();return;}
    if(!fix) {
      status.textContent=mode==='gps'?t('正在取得裝置位置…','Acquiring device location…'):t('點選地圖定位按鈕，查看目前位置。','Use the location button to see your current position.');
      renderHeading();
      return;
    }
    renderHeading();
    const prefix=t('裝置定位','Device GPS');
    if(!inside(fix.xy)) {
      status.textContent=`${prefix} · ${t('目前位置在此地圖範圍外','The current location is outside this map')}`;
      get('position-detail').textContent=t('仍會持續接收位置，回到地圖範圍內後會自動恢復顯示。','Location updates remain active. The marker will reappear automatically when you return to this map.');
      return;
    }
    liveLayer.setAttribute('transform',`translate(${fix.xy.join(' ')})`);
    halo.setAttribute('r',fix.accuracy*units);
    const nearest=samples.waypoints.reduce((best,p)=>{
      const distance=Math.hypot(p.x-fix.xy[0],p.y-fix.xy[1])/units;
      return !best || distance<best.distance?{...p,distance}:best;
    },null);
    const name=language==='en'?(translate[nearest.name]||nearest.name):nearest.name;
    status.textContent=`${prefix} · ${t('精度約','Accuracy ≈')} ${Math.round(fix.accuracy)} m · ${t('接近','Near')} ${name}`;
    const time=new Date(fix.time).toLocaleTimeString(language==='en'?'en-GB':'zh-TW',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
    get('position-detail').textContent=`${t('距 GPX 記錄路徑約','Distance from recorded GPX ≈')} ${Math.round(trackDistance(fix.xy))} m · ${t('定位時間','Position time')} ${time}`;
  }
  function setPosition(latitude,longitude,accuracy,time=Date.now(),course=null) {
    if(![latitude,longitude,accuracy,time].every(Number.isFinite) || accuracy<0) return;
    lastProblem=null;
    fix={latitude,longitude,accuracy,time,course,xy:project(latitude,longitude)};
    renderPosition();
    if(get('follow').checked && inside(fix.xy)) {camera.x=fix.xy[0];camera.y=fix.xy[1];drawCamera();}
  }
  function stopGPS() {
    generation++;
    if(watch!==null) navigator.geolocation.clearWatch(watch);
    watch=null;
    if(mode==='gps') {mode='idle';fix=null;}
  }
  function startGPS() {
    if(mode==='gps') {stopGPS();lastProblem=null;renderPosition();return;}
    if(!window.isSecureContext || !navigator.geolocation) {
      lastProblem=['此環境無法開啟定位。請透過 HTTPS 開啟，並確認位置權限。','GPS is unavailable here. Open this page via HTTPS and check location permission.'];renderPosition();return;
    }
    stopGPS();mode='gps';fix=null;lastProblem=null;
    get('follow').checked=true;
    renderPosition();
    const request=++generation;
    watch=navigator.geolocation.watchPosition(position=>{
      if(request!==generation) return;
      const {latitude,longitude,accuracy}=position.coords;
      const course=Number.isFinite(position.coords.heading) && position.coords.speed>=.5 ? position.coords.heading : null;
      setPosition(latitude,longitude,accuracy,position.timestamp,course);
    },error=>{
      if(request!==generation) return;
      if(error.code===1) {stopGPS();lastProblem=['定位權限未開啟。請在瀏覽器設定中允許位置權限。','Location permission was denied. Enable it in your browser settings.'];}
      else lastProblem=['暫時無法取得位置，正在等待下一次定位。','Location is temporarily unavailable. Waiting for another fix.'];
      fix=null;renderPosition();
    },{enableHighAccuracy:true,maximumAge:0,timeout:15000});
  }
  get('gps').onclick=startGPS;
  get('recenter').onclick=()=>{if(!fix || !inside(fix.xy))return;get('follow').checked=true;camera.x=fix.xy[0];camera.y=fix.xy[1];drawCamera();};
  get('follow').onchange=()=>{if(get('follow').checked && fix && inside(fix.xy)) {camera.x=fix.xy[0];camera.y=fix.xy[1];drawCamera();}};
  let compassEnabled=false;
  let compassReading=null;
  let compassProblem='';
  let compassGeneration=0;
  let compassTimer=null;
  let compassFrame=null;
  let arrowAngle=null;
  let arrowSource=null;
  const normalHeading=value=>(value%360+360)%360;
  function screenAngle() {
    const value=window.screen.orientation?.angle ?? window.orientation ?? 0;
    return Number.isFinite(value)?value:0;
  }
  function absoluteHeading(event) {
    const alpha=event.alpha*Math.PI/180;
    const beta=(event.beta || 0)*Math.PI/180;
    const gamma=(event.gamma || 0)*Math.PI/180;
    const angle=screenAngle()*Math.PI/180;
    const x=(Math.cos(alpha)*Math.cos(gamma)-Math.sin(alpha)*Math.sin(beta)*Math.sin(gamma))*Math.sin(angle)-Math.sin(alpha)*Math.cos(beta)*Math.cos(angle);
    const y=(Math.sin(alpha)*Math.cos(gamma)+Math.cos(alpha)*Math.sin(beta)*Math.sin(gamma))*Math.sin(angle)+Math.cos(alpha)*Math.cos(beta)*Math.cos(angle);
    if(Math.hypot(x,y)<.25) return null;
    return normalHeading(Math.atan2(x,y)*180/Math.PI);
  }
  function directionName(value) {
    const index=Math.round(normalHeading(value)/45)%8;
    return t(['北','東北','東','東南','南','西南','西','西北'][index],['N','NE','E','SE','S','SW','W','NW'][index]);
  }
  function headingMessage() {
    return {
      permission:t('手機方向權限未開啟。可以重新按方向按鈕授權。','Phone direction permission was denied. Tap the compass button to try again.'),
      unavailable:t('此裝置暫時沒有可用的指南針資料。','Compass readings are unavailable on this device.'),
      insecure:t('手機方向需要透過 HTTPS 開啟此頁。','Phone direction requires opening this page via HTTPS.'),
      inaccurate:t('指南針精度不足，請移開磁性配件，並稍微放平手機。','Compass accuracy is low. Move away from magnetic accessories and hold the phone flatter.')
    }[compassProblem] || '';
  }
  function renderHeading() {
    if(!get('heading-toggle')) return;
    const button=get('heading-toggle');
    button.setAttribute('aria-pressed',String(compassEnabled));
    button.setAttribute('aria-label',compassEnabled?t('停止手機方向','Stop phone compass'):t('啟用手機方向','Enable phone compass'));
    button.title=button.getAttribute('aria-label');
    let heading=null;
    let source=null;
    if(compassEnabled && compassReading && Date.now()-compassReading.time<5000 && !compassProblem) {
      heading=compassReading.heading;source='compass';
    } else if(mode==='gps' && fix && Number.isFinite(fix.course) && Date.now()-fix.time<15000) {
      heading=fix.course;source='course';
    }
    directionLayer.setAttribute('display',heading!==null && fix && inside(fix.xy)?'inline':'none');
    if(heading!==null) {
      // Interpolate along the shorter arc when a reading crosses north.
      const delta=arrowAngle===null?0:((heading-arrowAngle+540)%360)-180;
      arrowAngle=arrowAngle===null || source!==arrowSource || source!=='compass'?heading:arrowAngle+delta*.35;
      arrowSource=source;
      directionLayer.setAttribute('transform',`rotate(${arrowAngle}) scale(${1/camera.scale})`);
      directionLayer.dataset.source=source;
      directionLayer.dataset.heading=String(Math.round(normalHeading(heading)));
      const description={
        simulation:t('模擬手機朝向','Simulated phone direction'),track:t('GPX 行走方向','GPX travel direction'),
        compass:t('手機朝向','Phone direction'),course:t('GPS 行走方向','GPS travel direction')
      }[source];
      get('heading-status').textContent=`${description} · ${directionName(heading)} ${Math.round(normalHeading(heading))}°`;
    } else {
      arrowAngle=null;arrowSource=null;
      get('heading-status').textContent=headingMessage() || (compassEnabled?t('正在等待手機方向；請稍微放平手機。','Waiting for phone direction. Hold the phone flatter.'):'');
    }
  }
  function receiveOrientation(event) {
    if(!compassEnabled) return;
    let heading=null;
    if(Number.isFinite(event.webkitCompassHeading) && event.webkitCompassHeading>=0) {
      if(Number.isFinite(event.webkitCompassAccuracy) && (event.webkitCompassAccuracy<0 || event.webkitCompassAccuracy>50)) {
        compassProblem='inaccurate';compassReading=null;renderHeading();return;
      }
      heading=normalHeading(event.webkitCompassHeading+screenAngle());
    } else if((event.absolute===true || event.type==='deviceorientationabsolute') && Number.isFinite(event.alpha)) {
      heading=absoluteHeading(event);
    }
    if(heading===null) return;
    compassProblem='';
    compassReading={heading,time:Date.now()};
    if(compassFrame===null) compassFrame=requestAnimationFrame(()=>{compassFrame=null;renderHeading();});
  }
  function stopCompass() {
    compassGeneration++;
    compassEnabled=false;compassReading=null;
    window.removeEventListener('deviceorientation',receiveOrientation);
    window.removeEventListener('deviceorientationabsolute',receiveOrientation);
    clearInterval(compassTimer);compassTimer=null;
    if(compassFrame!==null) cancelAnimationFrame(compassFrame);
    compassFrame=null;renderHeading();
  }
  get('heading-toggle').onclick=async()=>{
    if(compassEnabled) {compassProblem='';stopCompass();return;}
    if(!window.isSecureContext) {compassProblem='insecure';renderHeading();return;}
    const Orientation=window.DeviceOrientationEvent;
    if(!Orientation) {compassProblem='unavailable';renderHeading();return;}
    const request=++compassGeneration;
    try {
      // iPhone requires this permission request inside a deliberate user action.
      if(typeof Orientation.requestPermission==='function') {
        const result=await Orientation.requestPermission(true);
        if(request!==compassGeneration) return;
        if(result!=='granted') {compassProblem='permission';renderHeading();return;}
      }
      if(request!==compassGeneration) return;
      compassProblem='';compassEnabled=true;
      window.addEventListener('deviceorientation',receiveOrientation,{passive:true});
      window.addEventListener('deviceorientationabsolute',receiveOrientation,{passive:true});
      compassTimer=setInterval(renderHeading,1000);
      renderHeading();
    }catch(error){if(request===compassGeneration){compassProblem='permission';renderHeading();}}
  };
  window.addEventListener('orientationchange',()=>{compassReading=null;renderHeading();});
  window.screen.orientation?.addEventListener('change',()=>{compassReading=null;renderHeading();});

  function updateLabelHits() {
    for (const {text,group} of mapLabels) {
      if (!group) continue;
      const b=text.getBBox();
      const rect=group.querySelector('rect');
      for (const [key,value] of Object.entries({x:b.x-hitPadding,y:b.y-hitPadding,width:b.width+hitPadding*2,height:b.height+hitPadding*2})) rect.setAttribute(key,value);
    }
  }
  function setLanguage(value) {
    language=value;
    document.documentElement.lang=language==='en'?'en':'zh-Hant';
    mount.querySelectorAll('[data-zh][data-en]').forEach(node=>{node.textContent=node.dataset[language];});
    for(const label of mapLabels) {
      const {text}=label;
      text.replaceChildren(...label.original.map(node=>node.cloneNode(true)));
      if(label.originalX===null) text.removeAttribute('x'); else text.setAttribute('x',label.originalX);
      if(label.originalAnchor===null) text.removeAttribute('text-anchor'); else text.setAttribute('text-anchor',label.originalAnchor);
      if(language==='en') {
        const box=text.getBBox();
        text.replaceChildren(document.createTextNode(label.en));
        if(label.anchor!=='start') {
          text.setAttribute('text-anchor',label.anchor);
          text.setAttribute('x',label.anchor==='end'?box.x+box.width:box.x+box.width/2);
        }
      }

    }
    updateLabelHits();
    svg.querySelectorAll('[data-sector]').forEach(node=>node.setAttribute('aria-label',sectors[Number(node.dataset.sector)][language==='en'?1:0]));
    annotationChinese?.setAttribute('display',language==='en'?'none':'inline');
    annotationEnglish?.setAttribute('display',language==='en'?'inline':'none');
    cards.forEach((card,index)=>card.querySelector(`.${prefix}-map-card-button`)?.setAttribute('aria-label',sectors[index][language==='en'?1:0]));
    viewport.setAttribute('aria-label',t('岩場地圖，可拖曳及縮放','Crag map, drag to pan or zoom'));
    mount.querySelector('.compass').setAttribute('aria-label',t('北方朝上','North is up'));
    renderCards();renderPosition();
  }
  cards.forEach((card,index)=>{
    card.classList.add(`${prefix}-map-linked-card`);
    const button=document.createElement('button');
    button.type='button';button.className=`${prefix}-map-card-button`;button.setAttribute('aria-pressed','false');
    button.setAttribute('aria-label',sectors[index][root.dataset.language==='en'?1:0]);
    button.onclick=()=>selectSector(index);
    card.append(button);
  });
  const expand = document.createElement('button');
  expand.type = 'button';
  expand.className = 'icon-button gw-gpx-expand';
  expand.setAttribute('aria-haspopup', 'dialog');
  expand.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/></svg>';
  mapFrame.append(expand);

  const dialog = document.createElement('dialog');
  dialog.className = 'gw-gpx-dialog';
  dialog.setAttribute('aria-labelledby', `${prefix}-gpx-dialog-title`);
  dialog.innerHTML = `<header><h3 id="${prefix}-gpx-dialog-title" tabindex="-1" autofocus></h3><button type="button" class="gw-gpx-close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header>`;
  mount.append(dialog);
  const title = dialog.querySelector('h3');
  const close = dialog.querySelector('button');
  const placeholder = document.createElement('div');
  placeholder.setAttribute('aria-hidden', 'true');

  expand.addEventListener('click', () => {
    if (dialog.open) return;
    placeholder.style.height = `${content.getBoundingClientRect().height}px`;
    content.before(placeholder);
    dialog.append(content);
    dialog.showModal();
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    placeholder.replaceWith(content);
    expand.focus({preventScroll:true});
  });

  const syncLanguage = () => {
    setLanguage(root.dataset.language === 'en' ? 'en' : 'zh');
    title.textContent = t('岩場地圖', 'Crag map');
    expand.setAttribute('aria-label', t('全螢幕瀏覽地圖', 'Expand map'));
    expand.title = expand.getAttribute('aria-label');
    close.setAttribute('aria-label', t('關閉全螢幕地圖', 'Close expanded map'));
  };
  document.addEventListener(`${prefix}-language-change`,syncLanguage);
  new MutationObserver(syncLanguage).observe(root,{attributes:true,attributeFilter:['data-language']});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){stopCompass();if(mode==='gps'){stopGPS();lastProblem=['頁面已暫停定位。返回後可再次開啟。','GPS paused while the page was hidden. Enable it again to resume.'];renderPosition();}}
  });
  window.addEventListener('pagehide', () => {
    if (dialog.open) dialog.close();
    stopCompass();stopGPS();renderPosition();
  });
  syncLanguage();
  document.fonts?.ready.then(syncLanguage);
  mount.dataset.ready = 'true';
};
