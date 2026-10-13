/* Uses the editor-supplied SVG viewBox and exact sector paths.
   Frontier's three cards share the source SVG's Frontier Area outline. */
(() => {
  const root = document.querySelector('[data-df-detail]');
  const mount = root?.querySelector('[data-df-sector-map]');
  const cards = [...(root?.querySelectorAll('.df-detail__area-grid > article') || [])];
  if (!mount || cards.length !== 6) return;

  const source = document.currentScript?.src || location.href;
  const mapAsset = new URL('webflow-embeds/defulan-location-map-v3-art.svg', source).href;
  const mapWidth = 1766.57983, mapHeight = 1240.78784;
  const regions = ["<path d=\"M1040.45068,392.73053H865.32574   c-8.40192,0-15.21307-6.8111-15.21307-15.21301v-45.68854c0-8.40192,6.81116-15.21301,15.21307-15.21301h175.12494   c8.40198,0,15.21313,6.8111,15.21313,15.21301v45.68854C1055.66382,385.91943,1048.85266,392.73053,1040.45068,392.73053z\"/>", "<path d=\"M1042.07678,242.94965L577.00873,364.25742   c-8.12988,2.12061-16.43958-2.75092-18.56018-10.88083l-20.77386-79.64267c-2.12061-8.12991,2.75092-16.43958,10.8808-18.56018   l465.06805-121.30777c8.12988-2.12059,16.43958,2.75092,18.56018,10.88081l20.77393,79.6427   C1055.07812,232.51938,1050.20667,240.82906,1042.07678,242.94965z\"/>", "<path d=\"M700.94507,499.93347l-108.42694,41.91754   c-7.83667,3.02966-16.64557-0.86719-19.67523-8.70392l-16.47479-42.61481c-3.0296-7.83667,0.86725-16.64557,8.70392-19.6752   l108.42694-41.91757c7.83667-3.02963,16.64557,0.86722,19.67523,8.70392l16.47473,42.61481   C712.67859,488.09494,708.78174,496.90381,700.94507,499.93347z\"/>", "<path d=\"M1326.38464,402.2182h-93.29883   c-8.40186,0-15.21301-6.81113-15.21301-15.21304v-45.68854c0-8.40192,6.81116-15.21301,15.21301-15.21301h93.29883   c8.40186,0,15.21301,6.8111,15.21301,15.21301v45.68854C1341.59766,395.40707,1334.7865,402.2182,1326.38464,402.2182z\"/>"];
  const regionForCard = [0, 0, 0, 1, 2, 3];
  const markers = [
    [885, 354], [953, 354], [1021, 354],
    [797, 247], [633, 485], [1280, 364]
  ];
  const labels = {
    zh: {
      north: '北', map: '德芙蘭岩場及步道位置示意圖', scroll: '可自由捲動的德芙蘭岩場位置圖',
      frontier: '邊境區域', loftier: '崇高之地', racketeer: '金三角', orienteer: '青竹東',
      trail: '德芙蘭步道', road: '台 8 線・中部橫貫公路', bridge: '松鶴橋',
      parking: '德芙蘭步道停車場', bus: '松鶴公車站', toilet: '廁所', camping: '山上松亭露營區', river: '大甲溪',
      switchbacks: '人工之字坡', marker: '0.2K 木樁', distance: '約 0.4K',
      spot: name => `在地圖上查看${name}`, card: name => `在地圖上定位${name}`
    },
    en: {
      north: 'N', map: 'Schematic map of Defulan climbing areas and access', scroll: 'Scrollable map of Defulan climbing areas',
      frontier: 'Frontier Area', loftier: 'Loftier', racketeer: 'Racketeer', orienteer: 'Orienteer',
      trail: 'Defulan Trail', road: 'Provincial Highway 8', bridge: 'Songhe Bridge',
      parking: 'Defulan Trail Parking', bus: 'Songhe Bus Stop', toilet: 'Toilet', camping: 'Shanshang Songting Campsite', river: 'Dajia River',
      switchbacks: 'Switchbacks', marker: '0.2 km post', distance: 'Approx. 0.4 km',
      spot: name => `Show ${name} on the map`, card: name => `Locate ${name} on the map`
    }
  };
  // Labels follow the editor's outlined text positions; trail is added along its path.
  const labelPositions = [
    ['loftier', 643, 194, 'area'], ['frontier', 960, 446, 'area'],
    ['racketeer', 470, 510, 'area'], ['orienteer', 1308, 305, 'area'],
    ['trail', 835, 540, 'trail'], ['road', 1458, 696, 'road'],
    ['bridge', 534, 1170, 'place'], ['parking', 1551, 423, 'place'],
    ['bus', 389, 904, 'place'], ['toilet', 1201, 553, 'place'],
    ['camping', 962, 695, 'place'], ['switchbacks', 697, 392, 'minor'],
    ['marker', 1066, 515, 'minor'], ['distance', 706, 600, 'minor'],
    ['river', 973, 1018, 'place']
  ];
  const labelMarkup = labelPositions.map(([key, x, y, kind]) =>
    `<text class="df-map-label df-map-label--${kind}" x="${x}" y="${y}" text-anchor="middle" data-df-map-label="${key}"></text>`
  ).join('');
  const regionMarkup = regions.map((shape, index) => `<g class="df-map-region" data-df-region="${index}">${shape}</g>`).join('');
  const markerMarkup = markers.map(([x, y], index) => `
    <g class="df-map-spot" data-df-spot="${index}" role="button" tabindex="0" aria-pressed="false">
      <circle class="df-map-spot__target" cx="${x}" cy="${y}" r="32"/>
      <circle class="df-map-spot__ring" cx="${x}" cy="${y}" r="22"/>
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${String(index + 1).padStart(2, '0')}</text>
    </g>`).join('');
  mount.innerHTML = `
    <div class="df-map-frame">
      <div class="df-map-compass" role="img" aria-label="北方"><svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 29V4M4 12l8-8 8 8"/></svg><span data-df-map-north>北</span></div>
      <div class="df-map-viewport" role="region" tabindex="0">
        <svg class="df-map-svg" viewBox="0 0 ${mapWidth} ${mapHeight}" xmlns="http://www.w3.org/2000/svg" role="group">
          <image href="${mapAsset}" width="${mapWidth}" height="${mapHeight}" preserveAspectRatio="xMidYMid meet"/>
          <g class="df-map-regions">${regionMarkup}</g>
          <g class="df-map-labels">${labelMarkup}</g>
          <g class="df-map-spots">${markerMarkup}</g>
        </svg>
      </div>
    </div>`;

  const viewport = mount.querySelector('.df-map-viewport');
  const svg = mount.querySelector('.df-map-svg');
  const zoomControls = window.GoWildMapZoom({ mount, viewport, svg });
  const regionNodes = [...mount.querySelectorAll('.df-map-region')];
  const spotNodes = [...mount.querySelectorAll('.df-map-spot')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const nameOf = (card, language) => card.querySelector(language === 'en' ? '[data-area-en]' : '[data-area-cn]')?.textContent.trim() || '';
  const language = () => root.dataset.language === 'en' ? 'en' : 'zh';

  const updateLanguage = () => {
    const lang = language(), copy = labels[lang];
    zoomControls.setLanguage(lang);
    mount.querySelectorAll('[data-df-map-label]').forEach(node => { node.textContent = copy[node.dataset.dfMapLabel]; });
    mount.querySelector('[data-df-map-north]').textContent = copy.north;
    mount.querySelector('.df-map-compass').setAttribute('aria-label', lang === 'en' ? 'North' : '北方');
    svg.setAttribute('aria-label', copy.map);
    viewport.setAttribute('aria-label', copy.scroll);
    spotNodes.forEach((spot, index) => spot.setAttribute('aria-label', copy.spot(nameOf(cards[index], lang))));
    cards.forEach(card => card.querySelector('.df-map-card-button')?.setAttribute('aria-label', copy.card(nameOf(card, lang))));
  };
  const select = (index, fromCard = false) => {
    mount.dataset.selected = String(index + 1);
    regionNodes.forEach((region, i) => region.classList.toggle('is-active', i === regionForCard[index]));
    spotNodes.forEach((spot, i) => {
      const active = i === index;
      spot.classList.toggle('is-active', active);
      spot.setAttribute('aria-pressed', String(active));
    });
    cards.forEach((card, i) => card.classList.toggle('is-map-selected', i === index));
    const width = svg.getBoundingClientRect().width;
    const height = svg.getBoundingClientRect().height;
    viewport.scrollTo({
      left: Math.max(0, markers[index][0] / mapWidth * width - viewport.clientWidth / 2),
      top: Math.max(0, markers[index][1] / mapHeight * height - viewport.clientHeight / 2),
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
    if (fromCard) window.scrollTo({
      top: window.scrollY + mount.getBoundingClientRect().top - 18,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  };
  cards.forEach((card, index) => {
    card.classList.add('df-map-linked-card');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'df-map-card-button';
    card.appendChild(button);
    button.addEventListener('click', () => select(index, true));
  });
  spotNodes.forEach((spot, index) => {
    spot.addEventListener('click', () => select(index));
    spot.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(index); }
    });
  });
  document.addEventListener('df-language-change', updateLanguage);
  updateLanguage();
  if (viewport.scrollWidth > viewport.clientWidth) {
    viewport.scrollLeft = Math.max(0, 1280 / mapWidth * svg.getBoundingClientRect().width - viewport.clientWidth * .65);
  }
})();
