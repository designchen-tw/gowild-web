/* Temporary schematic locator for the Long Dong Webflow Embed.
   Replace its geometry and sector coordinates with verified vector source. */
(() => {
  const root = document.querySelector('[data-ld-detail]');
  const mount = root?.querySelector('[data-ld-sector-map]');
  const cards = [...(root?.querySelectorAll('.ld-detail__sector-grid > article') || [])];
  if (!mount || cards.length !== 9) return;

  // Positions follow the north-to-south sector order in the TOCC map.
  // These are illustrative SVG coordinates, not GPS or rescue point positions.
  const positions = [
    [484, 156], [542, 253], [568, 350], [574, 444], [580, 533],
    [585, 630], [579, 724], [613, 837], [623, 953]
  ];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const labels = {
    zh: {
      north: '北', south: '南', coast: '海岸線', road: '台 2 線',
      trail: '主要步道', entry: '校門口入口', tunnel: '龍洞隧道',
      reset: '查看全圖',
      mapLabel: '龍洞九個岩區示意位置圖', spot: name => `在地圖上查看${name}`,
      card: name => `在地圖上定位${name}`
    },
    en: {
      north: 'N', south: 'S', coast: 'Coastline', road: 'Highway 2',
      trail: 'Main trail', entry: 'School Gate access', tunnel: 'Long Dong Tunnel',
      reset: 'Show full map',
      mapLabel: 'Schematic map of the nine Long Dong climbing sectors',
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
        <svg class="ld-map-svg" viewBox="0 0 760 1060" xmlns="http://www.w3.org/2000/svg" role="group">
          <defs>
            <pattern id="ld-map-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.035)" stroke-width="1"/></pattern>
            <linearGradient id="ld-map-sea" x1="0" x2="1"><stop stop-color="#0d171b"/><stop offset="1" stop-color="#05090b"/></linearGradient>
          </defs>
          <rect width="760" height="1060" fill="#0b0e0e"/>
          <rect width="760" height="1060" fill="url(#ld-map-grid)"/>
          <path class="ld-map-sea" d="M513 0 C496 42 477 77 469 116 C490 146 502 188 530 218 C548 245 543 287 562 321 C579 353 551 393 575 430 C601 468 592 505 580 544 C567 588 597 617 585 652 C567 696 604 744 620 775 C643 806 605 844 614 874 C626 915 652 943 638 981 C627 1012 651 1038 668 1060 H760 V0 Z"/>
          <path class="ld-map-coast" d="M513 0 C496 42 477 77 469 116 C490 146 502 188 530 218 C548 245 543 287 562 321 C579 353 551 393 575 430 C601 468 592 505 580 544 C567 588 597 617 585 652 C567 696 604 744 620 775 C643 806 605 844 614 874 C626 915 652 943 638 981 C627 1012 651 1038 668 1060"/>
          <g class="ld-map-contours" fill="none">
            <path d="M437 14 C407 85 432 128 462 178 C494 220 475 277 500 314 C523 365 496 418 518 471 C534 514 510 573 524 624 C533 687 546 719 566 779 C583 839 564 889 589 952"/>
            <path d="M372 0 C359 87 383 141 401 205 C438 269 421 315 447 378 C460 440 445 495 455 565 C483 630 476 700 491 754 C505 831 507 900 534 996"/>
            <path d="M318 36 C301 128 328 188 347 243 C378 308 373 376 387 427 C401 513 395 578 420 642 C426 709 436 776 446 835"/>
          </g>
          <path class="ld-map-road-halo" d="M154 -30 C177 81 200 171 206 250 C229 331 246 395 241 474 C233 538 247 614 268 687 C291 771 291 834 317 916 C329 972 336 1027 356 1090"/>
          <path class="ld-map-road" d="M154 -30 C177 81 200 171 206 250 C229 331 246 395 241 474 C233 538 247 614 268 687 C291 771 291 834 317 916 C329 972 336 1027 356 1090"/>
          <path class="ld-map-trail" d="M281 96 C333 115 382 107 450 134 C427 179 470 212 495 252 C473 310 510 344 525 396 C494 445 531 480 530 534 C503 591 531 650 535 716 C522 770 566 803 570 848 C562 895 582 948 609 1002"/>
          <path class="ld-map-trail ld-map-trail--branch" d="M240 460 C320 450 400 457 517 471 M265 697 C360 681 448 693 538 712 M317 912 C411 886 493 903 582 951"/>
          <g class="ld-map-parking" aria-hidden="true"><rect x="239" y="82" width="33" height="33" rx="6"/><text x="255.5" y="99" text-anchor="middle" dominant-baseline="central">P</text><rect x="267" y="667" width="33" height="33" rx="6"/><text x="283.5" y="684" text-anchor="middle" dominant-baseline="central">P</text><rect x="322" y="887" width="33" height="33" rx="6"/><text x="338.5" y="904" text-anchor="middle" dominant-baseline="central">P</text></g>
          <g class="ld-map-static-labels"><text x="95" y="60" data-map-svg="north">N</text><path d="M109 69 L109 105 M109 69 L102 83 M109 69 L116 83"/>
            <text x="89" y="582" data-map-svg="road"></text><text x="285" y="291" data-map-svg="trail"></text>
            <text x="365" y="131" data-map-svg="entry"></text><text x="316" y="742" data-map-svg="tunnel"></text>
            <text x="666" y="544" transform="rotate(90 666 544)" data-map-svg="coast"></text>
            <text x="92" y="1014" data-map-svg="south"></text></g>
          <g class="ld-map-spots">${markerMarkup}</g>
        </svg>
        <button class="ld-map-reset" type="button" data-map-reset></button>
    </div>`;

  const svg = mount.querySelector('.ld-map-svg');
  const spots = [...mount.querySelectorAll('.ld-map-spot')];
  const resetButton = mount.querySelector('[data-map-reset]');
  const fullView = [0, 0, 760, 1060];
  let currentView = fullView;
  let frame = 0;

  const setView = view => {
    currentView = view;
    svg.setAttribute('viewBox', view.map(value => value.toFixed(2)).join(' '));
  };
  const focusView = ([x, y]) => [Math.max(0, Math.min(760 - 310, x - 155)), Math.max(0, Math.min(1060 - 433, y - 216.5)), 310, 433];
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
