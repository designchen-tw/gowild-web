/* Selected-sector route lists for Defulan, Kenting and Guanziling. */
(() => {
  const root = document.querySelector('[data-gw-sector-browser]');
  if (!root || root.dataset.sectorBrowserReady) return;
  const prefix = root.dataset.gwSectorBrowser;
  const mount = root.querySelector('[data-' + prefix + '-sector-map]');
  const grid = root.querySelector('.' + prefix + '-detail__area-grid');
  const source = root.querySelector('#' + prefix + '-routes');
  if (!mount || !grid || !source) return;

  const boot = (attempt = 0) => {
    if (!mount.dataset.ready || !grid.querySelector('.' + prefix + '-map-card-button')) {
      if (attempt < 120) setTimeout(() => boot(attempt + 1), 50);
      return;
    }
    root.dataset.sectorBrowserReady = 'true';
    root.classList.add('gw-sector-browser');
    grid.classList.add('gw-sector-grid');
    const cards = [...grid.children];
    const rows = [...source.querySelectorAll('.' + prefix + '-detail__route-list > article')];
    const gradeRank = grade => {
      const match = grade.match(/^5\.(\d+)([a-d+-]?)(?:\/([a-d]))?/i);
      if (!match) return Infinity;
      const level = Number(match[1]);
      const steps = {a: 0, b: 1, c: 2, d: 3, '-': .5, '+': 2.5};
      const step = suffix => suffix ? steps[suffix.toLowerCase()] : (level >= 10 ? 1.5 : 0);
      return level * 10 + (match[3] ? (step(match[2]) + step(match[3])) / 2 : step(match[2]));
    };
    const routes = cards.map((card, index) => {
      card.classList.add('gw-sector-card');
      const button = card.querySelector('.' + prefix + '-map-card-button');
      button.classList.add('gw-sector-card-button');
      button.addEventListener('click', () => requestAnimationFrame(() => card.scrollIntoView({
        block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
      })));
      return rows.filter(row => Number(row.dataset.routeSector) === index + 1).map(row => {
        const caption = row.querySelector('p');
        const omitArea = text => text.split(/\s*·\s*/).slice(1).join(' · ');
        return {
          zh: row.querySelector('[data-route-cn]')?.textContent.trim() || '',
          en: row.querySelector('[data-route-en]')?.textContent.trim() || '',
          captionZh: omitArea(caption?.dataset.langZh || caption?.textContent.trim() || ''),
          captionEn: omitArea(caption?.dataset.langEn || ''),
          grade: row.querySelector('strong')?.textContent.trim() || ''
        };
      }).sort((a, b) => gradeRank(a.grade) - gradeRank(b.grade));
    });

    const panel = document.createElement('section');
    panel.className = 'gw-sector-panel';
    const heading = document.createElement('h4');
    const scroll = document.createElement('div');
    scroll.className = 'gw-sector-panel__scroll';
    scroll.tabIndex = 0;
    const list = document.createElement('ol');
    const empty = document.createElement('p');
    empty.className = 'gw-sector-panel__empty';
    scroll.append(list);
    panel.append(heading, scroll, empty);
    const language = () => root.dataset.language === 'en' ? 'en' : 'zh';
    const selected = () => mount.dataset.selected ? Number(mount.dataset.selected) - 1 : -1;

    const render = () => {
      const index = selected();
      if (!Number.isInteger(index) || index < 0 || index >= cards.length) return;
      const en = language() === 'en';
      heading.textContent = en ? 'Recommended routes' : '推薦路線';
      panel.setAttribute('aria-label', heading.textContent);
      scroll.setAttribute('aria-label', en ? 'Scrollable recommended routes' : '可捲動的推薦路線');
      list.replaceChildren();
      routes[index].forEach(route => {
        const row = document.createElement('li');
        const copy = document.createElement('div');
        const title = document.createElement('h5');
        const primary = document.createElement('span');
        primary.className = 'gw-sector-panel__primary';
        primary.textContent = en ? (route.en || route.zh) : (route.zh || route.en);
        const secondary = document.createElement('span');
        secondary.className = 'gw-sector-panel__secondary';
        secondary.textContent = en ? (route.zh || route.en) : (route.en || route.zh);
        title.append(primary, secondary);
        const caption = document.createElement('p');
        caption.textContent = en ? route.captionEn : route.captionZh;
        const grade = document.createElement('strong');
        grade.textContent = route.grade;
        copy.append(title, caption);
        row.append(copy, grade);
        list.append(row);
      });
      const hasRoutes = routes[index].length > 0;
      scroll.hidden = !hasRoutes;
      empty.hidden = hasRoutes;
      empty.textContent = en ? 'No recommended routes have been listed for this sector yet.' : '此區目前尚未收錄推薦路線。';
    };
    let current = -1;
    const syncSelection = () => {
      const index = selected();
      if (!Number.isInteger(index) || index < 0 || index >= cards.length) return;
      if (current !== index) {
        current = index;
        grid.append(cards[index], ...cards.filter((_, i) => i !== index));
        cards.forEach((card, i) => card.classList.toggle('gw-sector-card--active', i === index));
        cards[index].append(panel);
        scroll.scrollTop = 0;
      }
      render();
    };
    new MutationObserver(syncSelection).observe(mount, {attributes: true, attributeFilter: ['data-selected']});
    document.addEventListener(prefix + '-language-change', render);
    const note = source.querySelector('.' + prefix + '-detail__note');
    if (note) grid.after(note);
    syncSelection();
  };
  boot();
})();
