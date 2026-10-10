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
  const mapAsset = new URL('webflow-embeds/longdong-map-vector-v1.svg', sourceScript).href;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const labels = {
    zh: {
      north: '北', south: '南', coast: '海岸線', road: '台 2 線',
      trail: '主要步道', entry: '校門口入口', tunnel: '龍洞隧道',
      reset: '查看全圖',
      mapLabel: '龍洞九個岩區位置圖', spot: name => `在地圖上查看${name}`,
      card: name => `在地圖上定位${name}`
    },
    en: {
      north: 'N', south: 'S', coast: 'Coastline', road: 'Highway 2',
      trail: 'Main trail', entry: 'School Gate access', tunnel: 'Long Dong Tunnel',
      reset: 'Show full map',
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

  mount.innerHTML = `
    <div class="ld-map-frame">
      <svg class="ld-map-svg" viewBox="700 530 900 1600" xmlns="http://www.w3.org/2000/svg" role="group">
        <image class="ld-map-art" href="${mapAsset}" x="700" y="530" width="900" height="1600" preserveAspectRatio="xMidYMid meet"/>
        <g class="ld-map-spots">${markerMarkup}</g>
      </svg>
      <button class="ld-map-reset" type="button" data-map-reset></button>
    </div>`;

  const svg = mount.querySelector('.ld-map-svg');
  const spots = [...mount.querySelectorAll('.ld-map-spot')];
  const resetButton = mount.querySelector('[data-map-reset]');
  const fullView = [700, 530, 900, 1600];
  let currentView = fullView;
  let frame = 0;

  const setView = view => {
    currentView = view;
    svg.setAttribute('viewBox', view.map(value => value.toFixed(2)).join(' '));
  };
  const focusView = ([x, y]) => [Math.max(700, Math.min(1250, x - 175)), Math.max(530, Math.min(1507.78, y - 311.11)), 350, 622.22];
  const moveView = target => {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) { setView(target); return; }
    const start = [...currentView], started = performance.now();
    const tick = now => {
      const progress = Math.min(1, (now - started) / 430);
      const eased = 1 - Math.pow(1 - progress, 3);
      setView(start.map((value, index) => value + (target[index] - value) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };
  const updateLanguage = () => {
    const language = lang(), copy = labels[language];
    mount.querySelectorAll('[data-map-svg]').forEach(node => { node.textContent = copy[node.dataset.mapSvg]; });
    svg.setAttribute('aria-label', copy.mapLabel);
    resetButton.textContent = copy.reset;
    spots.forEach((spot, index) => spot.setAttribute('aria-label', copy.spot(nameOf(cards[index], language))));
    cards.forEach((card, index) => {
      const button = card.querySelector('.ld-map-card-button');
      if (button) button.setAttribute('aria-label', copy.card(nameOf(card, language)));
    });
  };
  const select = (index, fromCard = false) => {
    mount.dataset.selected = String(index + 1);
    spots.forEach((spot, spotIndex) => {
      spot.classList.toggle('is-active', spotIndex === index);
      spot.setAttribute('aria-pressed', String(spotIndex === index));
      spot.setAttribute('tabindex', spotIndex === index ? '0' : '-1');
    });
    cards.forEach((card, cardIndex) => card.classList.toggle('is-map-selected', cardIndex === index));
    resetButton.hidden = false;
    updateLanguage();
    moveView(focusView(positions[index]));
    if (fromCard) mount.scrollIntoView({behavior:reducedMotion.matches ? 'instant' : 'smooth', block:'start'});
  };
  const reset = () => {
    moveView(fullView);
    resetButton.hidden = true;
    spots.forEach(spot => spot.setAttribute('tabindex', '0'));
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
  resetButton.addEventListener('click', reset);
  document.addEventListener('ld-language-change', updateLanguage);
  resetButton.hidden = true;
  updateLanguage();
})();
