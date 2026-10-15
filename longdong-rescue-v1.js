/* Equipment lists transcribed from the rescue map supplied by the editor. */
(() => {
  const root = document.querySelector('[data-ld-detail]');
  if (!root || root.dataset.rescuePreviewReady) return;
  root.dataset.rescuePreviewReady = 'true';
  const equipment = {
    aid: {zh: '急救器材', en: 'EMS equipment', icon: '<rect x="5" y="5" width="14" height="16" rx="3"/><path d="M9 5V3h6v2M9 13h6m-3-3v6"/>'},
    board: {zh: '長背板', en: 'Spinal board', icon: '<rect x="7" y="2" width="10" height="20" rx="3"/><path d="M10 6h4M10 18h4M10 9v6m4-6v6"/>'},
    sked: {zh: '卷式擔架', en: 'SKED stretcher', icon: '<path d="M8 3h8l2 5v9l-3 4H9l-3-4V8Zm0 5h8m-8 4h8m-8 4h8M6 8H3m15 0h3M6 16H3m15 0h3"/>'}
  };
  const sites = [
    ['aid', 'board'],
    ['aid', 'board'],
    ['aid', 'sked', 'board'],
    [], [],
    ['aid', 'sked', 'board'],
    [],
    ['aid', 'sked', 'board'],
    ['aid', 'sked', 'board']
  ];
  const cards = [...root.querySelectorAll('.ld-detail__sector-grid > article')];
  const labels = [];
  cards.forEach(card => {
    const index = Number(card.querySelector('.ld-detail__area-number')?.textContent.trim()) - 1;
    const keys = sites[index] || [];
    if (!keys.length) return;
    const header = card.querySelector('.ld-detail__area-header');
    const list = document.createElement('ul');
    list.className = 'ld-sector-rescue';
    list.setAttribute('aria-label', '救援器材');
    keys.forEach(key => {
      const entry = equipment[key];
      const item = document.createElement('li');
      item.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + entry.icon + '</svg>';
      const name = document.createElement('span');
      name.textContent = entry.zh;
      item.append(name);
      list.append(item);
      labels.push({name, entry});
    });
    card.classList.add('ld-has-rescue-equipment');
    header.insertBefore(list, header.querySelector('.ld-detail__area-number'));
  });
  const updateLanguage = () => {
    const en = root.dataset.language === 'en';
    labels.forEach(({name, entry}) => { name.textContent = en ? entry.en : entry.zh; });
    root.querySelectorAll('.ld-sector-rescue').forEach(list => list.setAttribute('aria-label', en ? 'Rescue equipment' : '救援器材'));
    root.querySelectorAll('[data-ld-rescue-site]').forEach(icon => {
      const index = Number(icon.getAttribute('data-ld-rescue-site'));
      const card = cards.find(card => Number(card.querySelector('.ld-detail__area-number')?.textContent.trim()) === index + 1);
      const sector = card?.querySelector(en ? '[data-area-en]' : '[data-area-cn]')?.textContent.trim() || '';
      const text = sector + (en ? ' EMS equipment location' : '急救器材位置');
      icon.setAttribute('aria-label', text);
      const title = icon.querySelector('title');
      if (title) title.textContent = text;
    });
  };
  document.addEventListener('ld-language-change', updateLanguage);
  updateLanguage();
})();
