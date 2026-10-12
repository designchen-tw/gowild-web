/* Defulan location schematic traced from the user's reference image.
   Frontier's three subareas share one source-map outline; their exact internal boundaries are not supplied. */
(() => {
  const root = document.querySelector('[data-df-detail]');
  const mount = root?.querySelector('[data-df-sector-map]');
  const cards = [...(root?.querySelectorAll('.df-detail__area-grid > article') || [])];
  if (!mount || cards.length !== 6) return;

  const source = document.currentScript?.src || location.href;
  const mapAsset = new URL('webflow-embeds/defulan-location-map-v1.svg', source).href;
  const regions = [
    '<rect x="656" y="218" width="190" height="77" rx="13"/>',
    '<path d="M411 170 789 76q11-3 14 9l25 76q3 11-8 14L438 268q-11 3-14-8l-22-77q-3-10 9-13Z"/>',
    '<path d="m439 320 112-34 18 66-111 34z"/>',
    '<rect x="948" y="217" width="112" height="77" rx="12"/>'
  ];
  const regionForCard = [0, 0, 0, 1, 2, 3];
  const markers = [
    [691, 255], [750, 255], [810, 255],
    [609, 173], [503, 339], [1004, 257]
  ];
  const labels = {
    zh: {
      north: '北', map: '德芙蘭岩場及步道位置示意圖', scroll: '可自由捲動的德芙蘭岩場位置圖',
      frontier: '邊境區域', loftier: '崇高之地', racketeer: '金三角', orienteer: '青竹東',
      trail: '德芙蘭步道', road: '台 8 線・中部橫貫公路', bridge: '松鶴橋',
      parking: '停車場', bus: '松鶴公車站', toilet: '廁所', camping: '露營區',
      switchbacks: '人工之字坡', marker: '0.2K 木椿', distance: '約 0.4K', entrance: '0.02K',
      spot: name => `在地圖上查看${name}`, card: name => `在地圖上定位${name}`
    },
    en: {
      north: 'N', map: 'Schematic map of Defulan climbing areas and access', scroll: 'Scrollable map of Defulan climbing areas',
      frontier: 'Frontier Area', loftier: 'Loftier', racketeer: 'Racketeer', orienteer: 'Orienteer',
      trail: 'Defulan Trail', road: 'Provincial Highway 8', bridge: 'Songhe Bridge',
      parking: 'Parking', bus: 'Songhe Bus Stop', toilet: 'Toilet', camping: 'Camping',
      switchbacks: 'Switchbacks', marker: '0.2 km post', distance: 'Approx. 0.4 km', entrance: '0.02 km',
      spot: name => `Show ${name} on the map`, card: name => `Locate ${name} on the map`
    }
  };
  const labelPositions = [
    ['loftier', 604, 129, 'area'], ['frontier', 751, 330, 'area'],
    ['racketeer', 497, 288, 'area'], ['orienteer', 1004, 195, 'area'],
    ['trail', 600, 379, 'trail'], ['road', 1320, 550, 'road'],
    ['bridge', 367, 798, 'place'], ['parking', 1113, 405, 'place'],
    ['bus', 275, 697, 'place'], ['toilet', 1011, 427, 'place'],
    ['camping', 734, 484, 'place'], ['switchbacks', 577, 302, 'minor'],
    ['marker', 831, 408, 'minor'], ['distance', 451, 467, 'minor'],
    ['entrance', 989, 312, 'minor']
  ];
  const labelMarkup = labelPositions.map(([key, x, y, kind]) =>
    `<text class="df-map-label df-map-label--${kind}" x="${x}" y="${y}" text-anchor="middle" data-df-map-label="${key}"></text>`
  ).join('');
  const regionMarkup = regions.map((shape, index) => `<g class="df-map-region" data-df-region="${index}">${shape}</g>`).join('');
  const markerMarkup = markers.map(([x, y], index) => `
    <g class="df-map-spot" data-df-spot="${index}" role="button" tabindex="0">
      <circle class="df-map-spot__target" cx="${x}" cy="${y}" r="29"/>
      <circle class="df-map-spot__ring" cx="${x}" cy="${y}" r="19"/>
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${String(index + 1).padStart(2, '0')}</text>
    </g>`).join('');
  mount.innerHTML = `
    <div class="df-map-frame">
      <div class="df-map-compass" role="img" aria-label="北方"><svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 29V4M4 12l8-8 8 8"/></svg><span data-df-map-north>北</span></div>
      <div class="df-map-viewport" role="region" tabindex="0">
        <svg class="df-map-svg" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" role="group">
          <image href="${mapAsset}" width="1600" height="900" preserveAspectRatio="xMidYMid meet"/>
          <g class="df-map-regions">${regionMarkup}</g>
          <g class="df-map-labels">${labelMarkup}</g>
          <g class="df-map-features" aria-hidden="true">
            <g class="df-map-feature df-map-feature--parking" transform="translate(1070 354)"><rect x="-15" y="-15" width="30" height="30" rx="6"/><text text-anchor="middle" dominant-baseline="central">P</text></g>
            <g class="df-map-feature" transform="translate(420 699)"><rect x="-15" y="-15" width="30" height="30" rx="6"/><path d="M-8-4h16v11H-8zM-5 7v4m10-4v4M-5-7h10"/></g>
            <g class="df-map-feature" transform="translate(970 393)"><rect x="-15" y="-15" width="30" height="30" rx="6"/><text text-anchor="middle" dominant-baseline="central">WC</text></g>
            <g class="df-map-feature" transform="translate(737 448)"><rect x="-15" y="-15" width="30" height="30" rx="6"/><path d="m-10 7 10-15L10 7m-10-15V7m-10 0h20"/></g>
          </g>
          <g class="df-map-spots">${markerMarkup}</g>
        </svg>
      </div>
    </div>`;

  const viewport = mount.querySelector('.df-map-viewport');
  const svg = mount.querySelector('.df-map-svg');
  const regionNodes = [...mount.querySelectorAll('.df-map-region')];
  const spotNodes = [...mount.querySelectorAll('.df-map-spot')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const nameOf = (card, language) => card.querySelector(language === 'en' ? '[data-area-en]' : '[data-area-cn]')?.textContent.trim() || '';
  const language = () => root.dataset.language === 'en' ? 'en' : 'zh';

  const updateLanguage = () => {
    const lang = language(), copy = labels[lang];
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
      left: Math.max(0, markers[index][0] / 1600 * width - viewport.clientWidth / 2),
      top: Math.max(0, markers[index][1] / 900 * height - viewport.clientHeight / 2),
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
    viewport.scrollLeft = Math.max(0, 1000 / 1600 * svg.getBoundingClientRect().width - viewport.clientWidth * .65);
  }
})();
