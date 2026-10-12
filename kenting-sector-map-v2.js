/* Kenting locator uses the editor-supplied north-left map and exact area shapes. */
(() => {
  const root = document.querySelector('[data-kd-detail]');
  const mount = root?.querySelector('[data-kd-sector-map]');
  const cards = [...(root?.querySelectorAll('.kd-detail__area-grid > article') || [])];
  if (!mount || cards.length !== 9 || mount.dataset.ready) return;
  mount.dataset.ready = 'true';
  const source = document.currentScript?.src || location.href;
  const asset = new URL('webflow-embeds/kenting-location-map-v3.svg', source).href;
  const width = 1046, height = 1048;
  const regions = ["<rect x=\"548.5\" y=\"689.6\" width=\"80\" height=\"153.4\" rx=\"9.5\" ry=\"9.5\" transform=\"translate(-242.9 1258.5) rotate(-83.1)\" />\n    ", "<rect x=\"390.8\" y=\"667.4\" width=\"30.2\" height=\"66.6\" rx=\"9.5\" ry=\"9.5\" transform=\"translate(-376.8 908.7) rotate(-74.8)\" />\n    ", "<path d=\"M126,521.3l63.3-44c2.2-1.5,5-2.1,7.6-1.5l114.2,26.3c1.4.3,2.7,1,3.9,1.9l18.6,15.1c2.4,1.9,3.7,4.9,3.5,8l-4.4,67.9c-.3,5-4.5,8.9-9.6,8.9l-195.1-1c-5.4,0-9.8-4.6-9.5-10l3.5-64.3c.2-2.9,1.7-5.6,4.1-7.3h0Z\" />\n    ", "<rect x=\"428.5\" y=\"462.5\" width=\"242.7\" height=\"80\" rx=\"9.5\" ry=\"9.5\" transform=\"translate(-69 87.9) rotate(-8.6)\" />\n    ", "<path d=\"M148.7,253.8l69.5-19.7c1.1-.3,2.3-.4,3.5-.3l113,10.3c4.6.4,8.3,4.1,8.6,8.8l1.9,25c.4,5-3.1,9.4-8.1,10.2l-177.9,26.9c-5.2.8-10-2.8-10.8-8l-6.5-42.5c-.7-4.8,2.2-9.3,6.8-10.6h0Z\" />\n  ", "<path d=\"M379.9,272.8l5.6-11.1c1-2.1,2.8-3.7,4.9-4.5l25.2-10.1c4.4-1.7,9.3,0,11.7,4l12.6,21.2h0c3.7,6.4-.9,14.4-8.2,14.4h-43.4c-7.1,0-11.7-7.5-8.5-13.8h0Z\" />\n    ", "<rect x=\"227.7\" y=\"60.8\" width=\"155.8\" height=\"57.3\" rx=\"9.5\" ry=\"9.5\" transform=\"translate(-8.8 139.7) rotate(-25.4)\" />\n    ", "<path d=\"M691.3,163.4h23.1c5.6,0,10-4.8,9.5-10.4l-7.6-85.5c-.2-2.1-1.1-4.1-2.5-5.7l-16.7-17.7c-3.5-3.8-9.4-4-13.3-.6l-9.2,8.2c-3.1,2.8-4.1,7.3-2.3,11.1l8.5,18.6c.6,1.2.9,2.6.9,4v68.5c0,5.3,4.3,9.5,9.5,9.5h0Z\" />\n    <path d=\"M591.2,159.3h45c5.3,0,9.5-4.3,9.5-9.5v-40.9c0-3.3,1.7-6.3,4.4-8.1l18.1-11.4c.7-.5,1.4-1,1.9-1.6l18-19.6c1.6-1.8,2.5-4.1,2.5-6.4v-17.9c0-4-2.5-7.5-6.2-8.9-12-4.5-38-11.9-47.8,2.5-11.6,17.1-28,49-31.4,55.5s-.9,1.5-1.5,2.2l-22.3,23.7c-1.7,1.8-2.6,4.1-2.6,6.5v24.4c0,5.3,4.3,9.5,9.5,9.5h2.9Z\" />\n  ", "<rect x=\"513.7\" y=\"566.2\" width=\"42.5\" height=\"114.3\" rx=\"9.5\" ry=\"9.5\" transform=\"translate(-148.2 1079.5) rotate(-83.1)\" />\n    "];
  const markers = [[689, 765], [475, 714], [352, 575], [679, 510], [335, 321], [426, 306], [396, 78], [748, 124], [616, 625]];
  const labelPositions = [[590, 768], [404, 711], [238, 516], [550, 512], [245, 284], [441, 234], [306, 91], [720, 132], [536, 633]];
  const copy = {
    zh: { north:'北', compass:'北方朝左', map:'墾丁岩場位置示意圖', scroll:'可自由捲動的墾丁岩場位置圖', boulder:'抱石', road:'台 26 線', spot:name=>`在地圖上查看${name}`, card:name=>`在地圖上定位${name}` },
    en: { north:'N', compass:'North points left', map:'Map of Kenting climbing areas', scroll:'Scrollable map of Kenting climbing areas', boulder:'Boulder', road:'Highway 26', spot:name=>`Show ${name} on the map`, card:name=>`Locate ${name} on the map` }
  };
  mount.innerHTML = `
    <div class="kd-map-frame">
      <div class="kd-map-compass" role="img"><svg viewBox="0 0 32 24" aria-hidden="true"><path d="M29 12H4m8-8-8 8 8 8"/></svg><span data-kd-map-north></span></div>
      <div class="kd-map-viewport" role="region" tabindex="0">
        <svg class="kd-map-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="group">
          <image href="${asset}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>
          <g class="kd-map-regions">${regions.map((shape,i)=>`<g class="kd-map-region" data-kd-region="${i}">${shape}</g>`).join('')}</g>
          <g class="kd-map-labels">${labelPositions.map(([x,y],i)=>`<text class="kd-map-label kd-map-label--area" x="${x}" y="${y}" text-anchor="${i===7?'end':'middle'}" data-kd-map-area-label="${i}"></text>`).join('')}
            <text class="kd-map-label kd-map-label--minor" x="331" y="657" text-anchor="middle" data-kd-map-copy="boulder"></text>
            <text class="kd-map-label" x="959" y="992" text-anchor="middle" data-kd-map-copy="road"></text>
          </g>
          <g class="kd-map-spots">${markers.map(([x,y],i)=>`<g class="kd-map-spot" data-kd-spot="${i}" role="button" tabindex="0" aria-pressed="false">
            <circle class="kd-map-spot__target" cx="${x}" cy="${y}" r="25"/>
            <circle class="kd-map-spot__ring" cx="${x}" cy="${y}" r="17"/>
            <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${String(i+1).padStart(2,'0')}</text>
          </g>`).join('')}</g>
          <g id="kd-map-sunshine-tree" class="kd-map-landmarks">
        <path d="M225.5,581.6c-13-4.1-17.8-12.3-14.4-19.9-6.2-6.8,2.7-16.4,8.9-19.9,0-8.9,10.3-14.4,18.5-15.1,11-5.5,20.5,2.7,21.9,8.9,12.3,3.4,17.8,12.3,15.8,20.5,5.5,8.2.7,16.4-7.5,19.2-4.1,11.6-18.5,13-26,7.5-7.5,5.5-14.4,3.4-17.1-1.4v.2Z" fill="#394347" stroke="#a7afb1" stroke-width="3.1" stroke-linejoin="round" />
        <path d="M233.7,622.6c8.2-8.9,9.6-31.5,7.5-45.9l-10.3-15.8-2.1-11,2.7-.7,3.4,8.2,1.4-14.4,2.1-1.4,2.1,15.8,7.5-8.9,2.1,1.4-6.8,12.3,4.1,7.5,7.5-10.3,3.4-1.4,1.4,2.7-7.5,15.1c-3.4,16.4-2.1,37.7,2.1,42.5l9.6,2.7v2.1l-16.4-.7-16.4,3.4,2.7-3.4v.2Z" fill="#525f64" stroke="#d2d6d7" stroke-width="2.5" stroke-linejoin="round" />
      </g>
      
        </svg>
      </div>
    </div>`;
  const viewport = mount.querySelector('.kd-map-viewport');
  const svg = mount.querySelector('.kd-map-svg');
  const regionNodes = [...mount.querySelectorAll('.kd-map-region')];
  const spots = [...mount.querySelectorAll('.kd-map-spot')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const nameOf = (i,lang) => cards[i].querySelector(lang==='en'?'[data-area-en]':'[data-area-cn]').textContent.trim();
  const updateLanguage = () => {
    const lang = root.dataset.language === 'en' ? 'en' : 'zh';
    const labels = copy[lang];
    mount.querySelector('[data-kd-map-north]').textContent = labels.north;
    mount.querySelector('.kd-map-compass').setAttribute('aria-label',labels.compass);
    svg.setAttribute('aria-label',labels.map);
    viewport.setAttribute('aria-label',labels.scroll);
    mount.querySelectorAll('[data-kd-map-area-label]').forEach(node=>{node.textContent=nameOf(Number(node.dataset.kdMapAreaLabel),lang)});
    mount.querySelectorAll('[data-kd-map-copy]').forEach(node=>{node.textContent=labels[node.dataset.kdMapCopy]});
    spots.forEach((spot,i)=>spot.setAttribute('aria-label',labels.spot(nameOf(i,lang))));
    cards.forEach((card,i)=>card.querySelector('.kd-map-card-button').setAttribute('aria-label',labels.card(nameOf(i,lang))));
  };
  const centerPoint = (x, y, behavior) => {
    const bounds = svg.getBoundingClientRect();
    viewport.scrollTo({left:Math.max(0,x/width*bounds.width-viewport.clientWidth/2),top:Math.max(0,y/height*bounds.height-viewport.clientHeight/2),behavior});
  };
  const select = (i,fromCard=false) => {
    mount.dataset.selected=String(i+1);
    regionNodes.forEach((node,index)=>node.classList.toggle('is-active',index===i));
    spots.forEach((spot,index)=>{const active=index===i;spot.classList.toggle('is-active',active);spot.setAttribute('aria-pressed',String(active))});
    cards.forEach((card,index)=>{const active=index===i;card.classList.toggle('is-map-selected',active);card.querySelector('button').setAttribute('aria-pressed',String(active))});
    const behavior=reduced.matches?'instant':'smooth';
    centerPoint(...markers[i],behavior);
    if(fromCard)window.scrollTo({top:window.scrollY+mount.getBoundingClientRect().top-18,behavior});
  };
  cards.forEach((card,i)=>{
    card.classList.add('kd-map-linked-card');
    const button=document.createElement('button');
    button.type='button';button.className='kd-map-card-button';button.setAttribute('aria-pressed','false');
    card.appendChild(button);button.addEventListener('click',()=>select(i,true));
  });
  spots.forEach((spot,i)=>{
    spot.addEventListener('click',()=>select(i));
    spot.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(i)}});
  });
  document.addEventListener('kd-language-change',updateLanguage);
  updateLanguage();
  requestAnimationFrame(()=>{
    if(matchMedia('(max-width:520px)').matches)centerPoint(432,435,'instant');
    else centerPoint(...markers[0],'instant');
  });
})();
