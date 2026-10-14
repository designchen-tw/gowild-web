/* Long Dong sector browser: selected card, sub-sectors and grade-sorted route recommendations. */
(() => {
  const root = document.querySelector('[data-ld-detail]');
  if (!root) return;

  const boot = (attempt = 0) => {
    const mount = root.querySelector('[data-ld-sector-map]');
    const dialog = root.querySelector('[data-subsector-dialog]');
    if (!mount?.dataset.ready || !root.dataset.routesReady || !dialog) {
      if (attempt < 120) setTimeout(() => boot(attempt + 1), 50);
      return;
    }

    const grid = root.querySelector('.ld-detail__sector-grid');
    const cards = [...grid.children];
    const routeGroups = [...root.querySelectorAll('[data-route-group]')];
    const subPanels = [...dialog.querySelectorAll('[data-subsector-panel]')];
    if (cards.length !== 9 || routeGroups.length !== 9 || subPanels.length !== 9) return;

    const gradeRank = grade => {
      const match = grade.match(/^5\.(\d+)([a-d+-]?)/i);
      if (!match) return Infinity;
      const level = Number(match[1]);
      const suffix = match[2].toLowerCase();
      const steps = {a: 0, b: 1, c: 2, d: 3, '-': .5, '+': 2.5};
      return level * 10 + (suffix ? steps[suffix] : (level >= 10 ? 1.5 : 0));
    };
    const omitSector = (caption, name, restoreSubsector) => {
      const parts = caption.split(/\s*·\s*/);
      if (parts[0] === name) parts.shift();
      if (restoreSubsector) parts.unshift(restoreSubsector);
      return parts.join(' · ');
    };
    const data = cards.map((card, index) => {
      card.dataset.sectorBrowserIndex = String(index);
      const sectorZh = card.querySelector('[data-area-cn]')?.textContent.trim() || '';
      const sectorEn = card.querySelector('[data-area-en]')?.textContent.trim() || '';
      const subsectors = [...subPanels[index].querySelectorAll('.ld-subsector-list li')].map(item => ({
        zh: item.querySelector('[data-area-cn]')?.textContent.trim() || '',
        en: item.querySelector('[data-area-en]')?.textContent.trim() || ''
      }));
      const routes = [...routeGroups[index].querySelectorAll('[data-ld-route]')].map(row => {
        const caption = row.querySelector('p');
        const sameSubsector = row.dataset.routeSubsector === sectorZh;
        const subsectionEn = subsectors.find(item => item.zh === sectorZh)?.en || sectorEn;
        return {
          zh: row.querySelector('[data-route-cn]')?.textContent.trim() || '',
          en: row.querySelector('[data-route-en]')?.textContent.trim() || '',
          captionZh: omitSector(caption?.textContent.trim() || '', sectorZh, sameSubsector ? sectorZh : ''),
          captionEn: omitSector(caption?.dataset.langEn || '', sectorEn, sameSubsector ? subsectionEn : ''),
          grade: row.querySelector('strong')?.textContent.trim() || ''
        };
      }).sort((a, b) => gradeRank(a.grade) - gradeRank(b.grade));
      return {routes, subsectors};
    });

    const panel = document.createElement('div');
    panel.className = 'ld-sector-expanded';
    panel.dataset.mobileView = 'routes';
    panel.setAttribute('aria-label', '岩區詳細資訊');
    panel.innerHTML = '<div class="ld-sector-expanded__tabs" role="tablist" aria-label="岩區資訊">' +
      '<button type="button" role="tab" data-sector-browser-tab="subsectors" aria-controls="ld-sector-browser-subsectors" aria-selected="false">細分區</button>' +
      '<button type="button" role="tab" data-sector-browser-tab="routes" aria-controls="ld-sector-browser-routes" aria-selected="true">推薦路線</button></div>' +
      '<div class="ld-sector-expanded__columns">' +
      '<section class="ld-sector-expanded__subsectors" id="ld-sector-browser-subsectors" role="tabpanel" aria-label="細分區"><h4 data-sector-browser-subtitle>細分區</h4><ul></ul></section>' +
      '<section class="ld-sector-expanded__routes" id="ld-sector-browser-routes" role="tabpanel"><h4 data-sector-browser-routes-title>推薦路線</h4><div class="ld-sector-expanded__route-scroll" tabindex="0" aria-label="可捲動的推薦路線"><ol></ol></div></section></div>';
    const subList = panel.querySelector('.ld-sector-expanded__subsectors ul');
    const routeList = panel.querySelector('.ld-sector-expanded__routes ol');
    const tabs = [...panel.querySelectorAll('[data-sector-browser-tab]')];
    const mobile = matchMedia('(max-width: 700px)');
    const language = () => root.dataset.language === 'en' ? 'en' : 'zh';
    const selectedIndex = () => mount.dataset.selected ? Number(mount.dataset.selected) - 1 : -1;

    const pair = (zh, en) => {
      const wrap = document.createElement('span');
      wrap.className = 'ld-sector-expanded__pair';
      const main = document.createElement('span');
      main.className = 'ld-sector-expanded__primary';
      const secondary = document.createElement('span');
      secondary.className = 'ld-sector-expanded__secondary';
      const english = language() === 'en';
      main.textContent = english ? (en || zh) : zh;
      secondary.textContent = english ? zh : (en || zh);
      wrap.append(main, secondary);
      return wrap;
    };

    function showTab(which, focus = false) {
      panel.dataset.mobileView = which;
      tabs.forEach(tab => {
        const active = tab.dataset.sectorBrowserTab === which;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active && focus) tab.focus();
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => showTab(tab.dataset.sectorBrowserTab));
      tab.addEventListener('keydown', event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        showTab(tabs[1 - index].dataset.sectorBrowserTab, true);
      });
    });

    function render() {
      const index = selectedIndex();
      if (!Number.isInteger(index) || index < 0 || index >= cards.length) return;
      const en = language() === 'en';
      subList.replaceChildren();
      data[index].subsectors.forEach(item => {
        const li = document.createElement('li');
        li.append(pair(item.zh, item.en));
        subList.append(li);
      });
      routeList.replaceChildren();
      data[index].routes.forEach(route => {
        const li = document.createElement('li');
        const copy = document.createElement('div');
        const title = document.createElement('h5');
        title.append(pair(route.zh, route.en));
        const caption = document.createElement('p');
        caption.textContent = en ? route.captionEn : route.captionZh;
        const grade = document.createElement('strong');
        grade.textContent = route.grade;
        copy.append(title, caption);
        li.append(copy, grade);
        routeList.append(li);
      });
      panel.querySelector('[data-sector-browser-subtitle]').textContent = en ? 'Sub-sectors' : '細分區';
      panel.querySelector('.ld-sector-expanded__subsectors').setAttribute('aria-label', en ? 'Sub-sectors' : '細分區');
      panel.querySelector('.ld-sector-expanded__routes').setAttribute('aria-label', en ? 'Recommended routes' : '推薦路線');
      panel.querySelector('[data-sector-browser-routes-title]').textContent = en ? 'Recommended routes' : '推薦路線';
      panel.querySelector('.ld-sector-expanded__route-scroll').setAttribute('aria-label', en ? 'Scrollable recommended routes' : '可捲動的推薦路線');
      tabs[0].textContent = en ? 'Sub-sectors' : '細分區';
      tabs[1].textContent = en ? 'Routes' : '推薦路線';
      const name = cards[index].querySelector(en ? '[data-area-en]' : '[data-area-cn]')?.textContent.trim() || '';
      panel.setAttribute('aria-label', en ? `${name} details` : `${name}詳細資訊`);
    }

    let current = -1;
    function syncSelection() {
      const index = selectedIndex();
      if (!Number.isInteger(index) || index < 0 || index >= cards.length) return;
      if (index !== current) {
        current = index;
        grid.append(cards[index], ...cards.filter((_, i) => i !== index));
        cards.forEach((card, i) => card.classList.toggle('ld-sector-browser__active', i === index));
        cards[index].append(panel);
        panel.querySelector('.ld-sector-expanded__route-scroll').scrollTop = 0;
        showTab('routes');
      }
      render();
    }
    new MutationObserver(syncSelection).observe(mount, {attributes: true, attributeFilter: ['data-selected']});
    document.addEventListener('ld-language-change', render);
    mobile.addEventListener('change', () => showTab(panel.dataset.mobileView));
    cards.forEach(card => card.querySelector('.ld-map-card-button')?.addEventListener('click', () => {
      requestAnimationFrame(() => card.scrollIntoView({
        block: 'start',
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
      }));
    }));

    const note = root.querySelector('#ld-classics .ld-detail__note');
    if (note) grid.after(note);
    root.querySelector('#ld-classics')?.setAttribute('aria-hidden', 'true');
    syncSelection();
  };
  boot();
})();
