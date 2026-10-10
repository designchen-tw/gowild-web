/* Long Dong locator: geometry extracted from the supplied Illustrator map.
   Sector numbers refer to the nine climbing areas, not rescue point IDs. */
(() => {
  const root = document.querySelector('[data-ld-detail]');
  const mount = root?.querySelector('[data-ld-sector-map]');
  const cards = [...(root?.querySelectorAll('.ld-detail__sector-grid > article') || [])];
  if (!mount || cards.length !== 9) return;

  // Anchor points are placed inside the corresponding polygons of the source map.
  const positions = [
    [1250, 730], [1330, 920], [1345, 1045], [1345, 1120], [1268, 1198],
    [1280, 1270], [1350, 1420], [1380, 1700], [1400, 1970]
  ];
  const sourceScript = document.currentScript?.src || location.href;
  const mapAsset = new URL('webflow-embeds/longdong-map-vector-v2.svg', sourceScript).href;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const labels = {
    zh: {
      north: '北', schoolTrail: '校門口小徑', capeTrail: '龍洞岬灣步道',
      goldenTrail: '黃金谷小徑', backTrail: '後門小徑', road: '台 2 線濱海公路',
      tunnel: '龍洞隧道', parking: '停車場', school: '和美國小',
      temple: '西靈巖寺', park: '龍洞南口海洋公園',
      overview: '查看全圖', browse: '放大地圖',
      scrollLabel: '可上下捲動的龍洞岩區地圖',
      mapLabel: '龍洞九個岩區位置圖', spot: name => `在地圖上查看${name}`,
      card: name => `在地圖上定位${name}`
    },
    en: {
      north: 'N', schoolTrail: 'School Gate Trail', capeTrail: 'Long Dong Cape Bay Trail',
      goldenTrail: 'Golden Valley Trail', backTrail: 'Back Door Trail', road: 'Coastal Highway 2',
      tunnel: 'Long Dong Tunnel', parking: 'Parking', school: 'Ho-Mei School',
      temple: 'Hsilingyan Temple', park: 'Long Dong South Ocean Park',
      overview: 'Show full map', browse: 'Explore map',
      scrollLabel: 'Scrollable map of Long Dong climbing sectors',
      mapLabel: 'Map of the nine Long Dong climbing sectors',
      spot: name => `Show ${name} on the map`, card: name => `Locate ${name} on the map`
    }
  };
  const lang = () => root.dataset.language === 'en' ? 'en' : 'zh';
  const nameOf = (card, language) => card.querySelector(language === 'en' ? '[data-area-en]' : '[data-area-cn]')?.textContent.trim() || '';
  const markerMarkup = positions.map(([x, y], index) => `
    <g class="ld-map-spot" data-map-index="${index}" role="button" tabindex="0">
      <circle class="ld-map-spot__target" cx="${x}" cy="${y}" r="42"/>
      <circle class="ld-map-spot__ring" cx="${x}" cy="${y}" r="23"/>
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${String(index + 1).padStart(2, '0')}</text>
    </g>`).join('');

  const landmarks = [
    ['north', 755, 600, 'direction'],
    ['schoolTrail', 1110, 656, 'trail'],
    ['parking', 774, 747, 'parking'],
    ['school', 815, 880, 'place'],
    ['capeTrail', 1170, 880, 'trail'],
    ['parking', 1105, 1150, 'parking'],
    ['road', 750, 1200, 'road'],
    ['capeTrail', 1180, 1345, 'trail'],
    ['goldenTrail', 1210, 1530, 'trail'],
    ['tunnel', 940, 1745, 'place'],
    ['temple', 1090, 1890, 'place'],
    ['parking', 1255, 1995, 'parking'],
    ['backTrail', 1240, 2080, 'trail'],
    ['park', 810, 2275, 'place']
  ];
  const landmarkMarkup = landmarks.map(([key, x, y, kind]) =>
    `<text class="ld-map-label ld-map-label--${kind}" x="${x}" y="${y}" data-map-svg="${key}"></text>`
  ).join('');

  mount.innerHTML = `
    <div class="ld-map-frame">
      <div class="ld-map-viewport" role="region" tabindex="0">
      <svg class="ld-map-svg" viewBox="700 530 900 1840" xmlns="http://www.w3.org/2000/svg" role="group">
        <image class="ld-map-art" href="${mapAsset}" x="700" y="530" width="900" height="1840" preserveAspectRatio="xMidYMid meet"/>
        <g class="ld-map-labels">${landmarkMarkup}</g>
        <g class="ld-map-spots">${markerMarkup}</g>
        <text class="ld-map-selected-name" data-map-selected-name text-anchor="start" hidden></text>
      </svg>
      </div>
      <button class="ld-map-reset" type="button" data-map-reset></button>
    </div>`;

  const svg = mount.querySelector('.ld-map-svg');
  const viewport = mount.querySelector('.ld-map-viewport');
  const spots = [...mount.querySelectorAll('.ld-map-spot')];
  const resetButton = mount.querySelector('[data-map-reset]');
  const selectedName = mount.querySelector('[data-map-selected-name]');
  const landmarkNodes = [...mount.querySelectorAll('.ld-map-label')];
  let landmarkBounds = [];
  let activeIndex = -1;
  let isOverview = false;
  const fullView = [700, 530, 900, 1840];

  const setView = view => {
    svg.setAttribute('viewBox', view.map(value => value.toFixed(2)).join(' '));
  };
  const focusView = ([x, y]) => [Math.max(700, Math.min(1250, x - (x >= 1390 ? 205 : 175))), Math.max(530, Math.min(1654.44, y - 357.78)), 350, 715.56];
  const showLabelsWithin = ([x, y, width, height]) => {
    const padding = 8;
    landmarkNodes.forEach((node, index) => {
      const box = landmarkBounds[index];
      node.style.visibility = box && box.x >= x + padding && box.y >= y + padding &&
        box.x + box.width <= x + width - padding && box.y + box.height <= y + height - padding
        ? 'visible' : 'hidden';
    });
  };
  const measureLabels = () => {
    landmarkNodes.forEach(node => { node.style.visibility = 'visible'; });
    landmarkBounds = landmarkNodes.map(node => node.getBBox());
  };
  const updateLanguage = () => {
    const language = lang(), copy = labels[language];
    mount.classList.toggle('is-map-en', language === 'en');
    mount.querySelectorAll('[data-map-svg]').forEach(node => { node.textContent = copy[node.dataset.mapSvg]; });
    if (activeIndex >= 0) selectedName.textContent = nameOf(cards[activeIndex], language);
    measureLabels();
    showLabelsWithin(activeIndex >= 0 ? focusView(positions[activeIndex]) : fullView);
    svg.setAttribute('aria-label', copy.mapLabel);
    viewport.setAttribute('aria-label', copy.scrollLabel);
    resetButton.textContent = isOverview ? copy.browse : copy.overview;
    resetButton.setAttribute('aria-pressed', String(isOverview));
    spots.forEach((spot, index) => spot.setAttribute('aria-label', copy.spot(nameOf(cards[index], language))));
    cards.forEach((card, index) => {
      const button = card.querySelector('.ld-map-card-button');
      if (button) button.setAttribute('aria-label', copy.card(nameOf(card, language)));
    });
  };
  const select = (index, fromCard = false) => {
    isOverview = false;
    mount.classList.remove('is-map-overview');
    activeIndex = index;
    const targetView = focusView(positions[index]);
    selectedName.setAttribute('x', targetView[0] + 24);
    selectedName.setAttribute('y', targetView[1] + 46);
    selectedName.removeAttribute('hidden');
    mount.dataset.selected = String(index + 1);
    spots.forEach((spot, spotIndex) => {
      spot.classList.toggle('is-active', spotIndex === index);
      spot.setAttribute('aria-pressed', String(spotIndex === index));
      spot.setAttribute('tabindex', spotIndex === index ? '0' : '-1');
    });
    cards.forEach((card, cardIndex) => card.classList.toggle('is-map-selected', cardIndex === index));
    updateLanguage();
    setView(targetView);
    viewport.scrollTop = Math.max(0, (svg.getBoundingClientRect().height - viewport.clientHeight) / 2);
    if (fromCard) window.scrollTo({
      top: window.scrollY + mount.getBoundingClientRect().top - 18,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  };
  const clearSelection = () => {
    activeIndex = -1;
    selectedName.setAttribute('hidden', '');
    delete mount.dataset.selected;
    spots.forEach(spot => {
      spot.classList.remove('is-active');
      spot.setAttribute('aria-pressed', 'false');
      spot.setAttribute('tabindex', '0');
    });
    cards.forEach(card => card.classList.remove('is-map-selected'));
    showLabelsWithin(fullView);
  };
  const toggleOverview = () => {
    isOverview = !isOverview;
    mount.classList.toggle('is-map-overview', isOverview);
    clearSelection();
    setView(fullView);
    viewport.scrollTop = 0;
    updateLanguage();
  };

  cards.forEach((card, index) => {
    card.classList.add('ld-map-linked-card');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ld-map-card-button';
    card.appendChild(button);
    button.addEventListener('click', () => select(index, true));
  });
  spots.forEach((spot, index) => {
    spot.addEventListener('click', () => select(index));
    spot.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(index); }
    });
  });
  resetButton.addEventListener('click', toggleOverview);
  document.addEventListener('ld-language-change', updateLanguage);
  updateLanguage();
})();
