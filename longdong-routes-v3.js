/* Sub-sector text dialogs are separate from the cards' map controls. */
(() => {
  const root = document.querySelector('[data-ld-detail]');
  if (!root || root.dataset.routesReady) return;
  const groups = [...root.querySelectorAll('[data-route-group]')];
  const triggers = [...root.querySelectorAll('[data-subsector-trigger]')];
  if (!groups.length || triggers.length !== 9) return;
  root.dataset.routesReady = 'true';
  const template = document.createElement('div');
  template.innerHTML = "<dialog id=\"ld-subsector-dialog\" class=\"ld-subsector-dialog\" data-subsector-dialog aria-modal=\"true\"><div class=\"ld-subsector-dialog__body\"><button type=\"button\" class=\"ld-subsector-close\" data-subsector-close aria-label=\"關閉細分區\" autofocus><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg></button><section data-subsector-panel=\"0\" hidden><header><span class=\"ld-subsector-number\">01</span><h3 id=\"ld-subsector-title-0\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>校門口</span><span data-area-en>School Gate</span></span></h3></header><p class=\"ld-subsector-label\" data-lang-en=\"Sub-sectors\">細分區</p><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>人面岩</span><span data-area-en>Disco Buttress</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>校門口</span><span data-area-en>School Gate Crag</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>門簷</span><span data-area-en>Apprentice Rock</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>騙人的牆</span><span data-area-en>Illusion Wall</span></span></span></li></ul></section><section data-subsector-panel=\"1\" hidden><header><span class=\"ld-subsector-number\">02</span><h3 id=\"ld-subsector-title-1\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>鐘塔</span><span data-area-en>Clock Tower</span></span></h3></header><p class=\"ld-subsector-label\" data-lang-en=\"Sub-sectors\">細分區</p><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>訓導處</span><span data-area-en>Discipline Area</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>水池畔</span><span data-area-en>Pondside Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>左鐘塔</span><span data-area-en>Left Tower</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>鐘塔</span><span data-area-en>Clocktower</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>總統頭像山</span><span data-area-en>Four Presidents</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>短巷</span><span data-area-en>Short Lane</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>臨海面</span><span data-area-en>Sea Wall</span></span></span></li></ul></section><section data-subsector-panel=\"2\" hidden><header><span class=\"ld-subsector-number\">03</span><h3 id=\"ld-subsector-title-2\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>長巷</span><span data-area-en>Long Lane</span></span></h3></header><p class=\"ld-subsector-label\" data-lang-en=\"Sub-sectors\">細分區</p><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>佈告欄</span><span data-area-en>Bulletin Board</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>長巷</span><span data-area-en>Long Lane</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>獨木橋畔</span><span data-area-en>Wooden Bridge</span></span></span></li></ul></section><section data-subsector-panel=\"3\" hidden><header><span class=\"ld-subsector-number\">04</span><h3 id=\"ld-subsector-title-3\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>音樂廳</span><span data-area-en>Music Hall</span></span></h3></header><p class=\"ld-subsector-label\" data-lang-en=\"Sub-sectors\">細分區</p><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>破碎面</span><span data-area-en>Broken Faces</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>左面</span><span data-area-en>Left Face</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>正面</span><span data-area-en>Main Face</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>北面</span><span data-area-en>North Face</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>演奏台</span><span data-area-en>Recital Hall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>包廂</span><span data-area-en>Balcony</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>鯨魚頭</span><span data-area-en>Whale’s Head</span></span></span></li></ul></section><section data-subsector-panel=\"4\" hidden><header><span class=\"ld-subsector-number\">05</span><h3 id=\"ld-subsector-title-4\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>大禮堂</span><span data-area-en>Grand Auditorium</span></span></h3></header><p class=\"ld-subsector-label\" data-lang-en=\"Sub-sectors\">細分區</p><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>上龍脊</span><span data-area-en>Upper Dragon Ridge</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>南側</span><span data-area-en>South Side</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>大斜板</span><span data-area-en>Great Slab</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>西面</span><span data-area-en>West Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>凡登峽谷</span><span data-area-en>Verdon Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>龍柱</span><span data-area-en>Dragon Point Buttress</span></span></span></li></ul></section><section data-subsector-panel=\"5\" hidden><header><span class=\"ld-subsector-number\">06</span><h3 id=\"ld-subsector-title-5\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第一洞</span><span data-area-en>First Cave</span></span></h3></header><p class=\"ld-subsector-label\" data-lang-en=\"Sub-sectors\">細分區</p><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>洞外左側</span><span data-area-en>Exterior Left</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>洞之上</span><span data-area-en>Headwall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第一洞內 南面</span><span data-area-en>Interior South End</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第一洞內 西面</span><span data-area-en>Interior West Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第一洞內 東北面</span><span data-area-en>Interior Northeast Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>外牆</span><span data-area-en>Outer Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>龍脊背面下半部</span><span data-area-en>Lower Dragon Ridge</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>龍脊背面上半部</span><span data-area-en>Yellow Wall</span></span></span></li></ul></section><section data-subsector-panel=\"6\" hidden><header><span class=\"ld-subsector-number\">07</span><h3 id=\"ld-subsector-title-6\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>第二洞</span><span data-area-en>Second Cave</span></span></h3></header><p class=\"ld-subsector-label\" data-lang-en=\"Sub-sectors\">細分區</p><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>後院</span><span data-area-en>Back Porch</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>陽光面</span><span data-area-en>Sunshine Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>入口裂隙</span><span data-area-en>Entrance Cracks</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>雨牆</span><span data-area-en>Rain Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>洞外岩壁</span><span data-area-en>Cave Rock</span></span></span></li></ul></section><section data-subsector-panel=\"7\" hidden><header><span class=\"ld-subsector-number\">08</span><h3 id=\"ld-subsector-title-7\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>黃金谷</span><span data-area-en>Golden Valley</span></span></h3></header><p class=\"ld-subsector-label\" data-lang-en=\"Sub-sectors\">細分區</p><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>貓屋</span><span data-area-en>The Cathouse</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>伸展台</span><span data-area-en>Catwalk</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>浪之外</span><span data-area-en>Euro Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>黃金岩</span><span data-area-en>Gold Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>黑岩</span><span data-area-en>Black Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>傳奇岩</span><span data-area-en>Legend Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>比基尼洞穴</span><span data-area-en>Bikini Cave</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>塔岩</span><span data-area-en>Tower Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>龍船岩</span><span data-area-en>Dragon Boat Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>失落的龍塔</span><span data-area-en>Lost Dragon Spire</span></span></span></li></ul></section><section data-subsector-panel=\"8\" hidden><header><span class=\"ld-subsector-number\">09</span><h3 id=\"ld-subsector-title-8\" data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>後門</span><span data-area-en>Back Door</span></span></h3></header><p class=\"ld-subsector-label\" data-lang-en=\"Sub-sectors\">細分區</p><ul class=\"ld-subsector-list\"><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>地下一樓</span><span data-area-en>B1</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>地下室台階</span><span data-area-en>Basement Steps</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>地下二樓</span><span data-area-en>Basement</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>老人牆</span><span data-area-en>Old Man Wall</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>鱷魚岬</span><span data-area-en>Crocodile Cape</span></span></span></li><li><span data-area-title><span class=\"ld-detail__area-pair\"><span data-area-cn>美好的懸岩</span><span data-area-en>P.O. Wall</span></span></span></li></ul></section></div></dialog>";
  const dialog = template.querySelector('[data-subsector-dialog]');
  root.append(dialog);
  const panels = [...dialog.querySelectorAll('[data-subsector-panel]')];
  const localized = [...dialog.querySelectorAll('[data-lang-en]')].map(node => [node, node.textContent]);
  const closeButton = dialog.querySelector('[data-subsector-close]');
  const cards = [...root.querySelectorAll('.ld-detail__sector-grid > article')];
  let trigger;
  let previousOverflow;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const states = groups.map(group => {
    const rows = [...group.querySelectorAll('[data-ld-route]')];
    // Draw once without replacement, preserving the source order of visible picks.
    const shuffled = rows.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return { group, rows, picks: new Set(shuffled.slice(0, 5)), expanded: false,
      button: group.querySelector('[data-routes-toggle]') };
  });
  const language = () => root.dataset.language === 'en' ? 'en' : 'zh';
  const renderRoutes = state => {
    const en = language() === 'en';
    state.rows.forEach(row => { row.hidden = !state.expanded && !state.picks.has(row); });
    if (state.button) {
      state.button.setAttribute('aria-expanded', String(state.expanded));
      state.button.querySelector('[data-route-toggle-label]').textContent = state.expanded
        ? (en ? 'Show five picks' : '收合至 5 條')
        : (en ? `Show all ${state.rows.length} routes` : `展開全部 ${state.rows.length} 條`);
    }
  };
  states.forEach(state => {
    state.button?.addEventListener('click', () => {
      state.expanded = !state.expanded;
      renderRoutes(state);
      if (!state.expanded) state.group.scrollIntoView({block:'start', behavior:reduced.matches?'auto':'smooth'});
    });
    renderRoutes(state);
  });
  const updateLanguage = () => {
    states.forEach(renderRoutes);
    localized.forEach(([node, zh]) => { node.textContent = language() === 'en' ? node.dataset.langEn : zh; });
    closeButton.setAttribute('aria-label', language() === 'en' ? 'Close sub-sectors' : '關閉細分區');
    triggers.forEach((button, index) => {
      const name = cards[index].querySelector(language() === 'en' ? '[data-area-en]' : '[data-area-cn]').textContent.trim();
      button.setAttribute('aria-label', language() === 'en' ? `Show ${name} sub-sectors` : `展開${name}細分區`);
    });
  };
  triggers.forEach((button, index) => button.addEventListener('click', event => {
    event.stopPropagation();
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    dialog.setAttribute('aria-labelledby', `ld-subsector-title-${index}`);
    trigger = button;
    triggers.forEach(item => item.setAttribute('aria-expanded', String(item === button)));
    if (!dialog.open) {
      previousOverflow = document.documentElement.style.overflow;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
  }));
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow || '';
    triggers.forEach(button => button.setAttribute('aria-expanded', 'false'));
    trigger?.focus({preventScroll:true});
  });
  document.addEventListener('ld-language-change', updateLanguage);
  updateLanguage();
})();
