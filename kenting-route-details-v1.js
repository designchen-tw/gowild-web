(() => {
  const root = document.querySelector('[data-kd-route-details]');
  const dialog = document.querySelector('#kd-route-detail');
  if (!root || !dialog?.showModal) return;
  root.setAttribute('data-kd-route-details-ready', '');


  // First ascents and lengths from the Kenting Climbing Guide.
  const kentingRouteFacts = {
    "kd-guide-01-01": ["Ray", 14, "前段微外傾，靠大手點做長動作。接到大裂隙後，後段較容易。", "Long moves on large holds lead through a slightly overhanging start. The climbing eases after the main crack."],
    "kd-guide-01-02": ["Sam", 13, "適合暖身。起步有一段需要讀動作的難關，之後以大手點為主。", "A warm-up with a tricky opening sequence followed by mostly large holds."],
    "kd-guide-01-03": ["Ray", 16],
    "kd-guide-01-04": ["Sam", 16, "單一動作難度較平均，整段攀登連續，重點在耐力。", "The difficulty stays fairly consistent, with sustained moves that test endurance."],
    "kd-guide-01-05": ["Sam", 17],
    "kd-guide-01-06": ["Sam", 18],
    "kd-guide-01-07": ["Sam", 20],
    "kd-guide-01-08": ["Sam", 19],
    "kd-guide-02-02": ["蔡導", 10],
    "kd-guide-02-03": ["林寯", 12],
    "kd-guide-02-04": ["Ron", 10, "舊牆早期路線之一，原始開發者不詳。路書記載 Ron 於 1998 年攀爬，並於 2000 年重新設置固定點。", "An early Old Wall route with an unknown original developer. The guide records Ron climbing it in 1998 and rebolting it in 2000."],
    "kd-guide-02-05": ["Ray", 10, "前段容易，接著遇到短外傾，收尾需要一些岩面技巧。", "An easy lower section gives way to a short overhang and a technical finish."],
    "kd-guide-02-06": ["阿傑", 10],
    "kd-guide-03-01": ["Danny", 7],
    "kd-guide-03-02": ["Mila", 7],
    "kd-guide-03-03": ["小祁哥", 8],
    "kd-guide-03-04": ["Danny", 9],
    "kd-guide-03-05": ["Sam", 8],
    "kd-guide-03-06": ["Sam", 11, "動作變化多，主要難關有數種解法。", "A varied route with several ways to climb the main crux."],
    "kd-guide-03-07": ["Sam", 12],
    "kd-guide-03-08": ["Sam", 12],
    "kd-guide-03-09": ["Andrew", 12],
    "kd-guide-03-10": ["Xav", 13],
    "kd-guide-03-11": ["尚青", 14],
    "kd-guide-03-12": ["Sam", 13],
    "kd-guide-03-13": ["Sam", 14],
    "kd-guide-03-14": ["00", null],
    "kd-guide-03-15": ["Sam", 14],
    "kd-guide-03-16": ["Sam", 16],
    "kd-guide-03-17": ["中信", 17],
    "kd-guide-03-18": ["Sam", 17],
    "kd-guide-03-19": ["Sam", 16],
    "kd-guide-03-20": ["James", 16],
    "kd-guide-03-21": ["Sam", 16],
    "kd-guide-03-22": ["Sam", 18],
    "kd-guide-03-23": ["Sam", 20],
    "kd-guide-03-24": ["Danny", 20],
    "kd-guide-03-25": ["Danny", 20, "起攀動作多變，接一段抱石型難關，後段大手點仍考驗耐力。", "A varied start leads to a bouldery crux, then sustained climbing on large holds."],
    "kd-guide-03-26": ["Xav", 20],
    "kd-guide-03-27": ["Sam", 21],
    "kd-guide-03-28": ["Danny", 20],
    "kd-guide-03-29": ["仲維", 18],
    "kd-guide-03-30": ["Sam", 21],
    "kd-guide-03-31": ["James", 21, "依路書標線，路線經過外傾，接續較低角度的技巧難關。", "The guide’s marked line links an overhang with a technical slab crux."],
    "kd-guide-03-32": ["Sam", 21],
    "kd-guide-03-33": ["俊忠", 21],
    "kd-guide-03-34": ["Mila", 20],
    "kd-guide-03-35": ["Mila", 20],
    "kd-guide-03-36": ["國勝", 8],
    "kd-guide-03-37": ["Mila", 7],
    "kd-guide-03-38": ["姚教練", 7],
    "kd-guide-04-01": ["Andrew", 9, "下段以口袋點和岩面技巧為主，上段轉為外傾大手點。", "Technical pockets low down give way to steeper climbing on larger holds."],
    "kd-guide-04-04": ["Sam", 12],
    "kd-guide-04-05": ["Sam", 11],
    "kd-guide-04-06": ["Sam", 12],
    "kd-guide-04-07": ["Sam", 12],
    "kd-guide-04-08": ["Sam", 12],
    "kd-guide-04-09": ["Sam", 12],
    "kd-guide-04-10": ["Sam", 12],
    "kd-guide-04-11": ["Sam", 12],
    "kd-guide-04-12": ["Sam", 8],
    "kd-guide-04-15": ["俊忠", 10],
    "kd-guide-04-16": ["Sam", 10],
    "kd-guide-04-17": ["Sam", 10],
    "kd-guide-04-18": ["Sam", 10],
    "kd-guide-04-19": ["Sam", 10],
    "kd-guide-04-20": ["Sam", 10],
    "kd-guide-04-21": ["魏教練", 10],
    "kd-guide-04-22": ["益帆", 12],
    "kd-guide-04-23": ["Yuji Hirayama", 8],
    "kd-guide-04-24": ["Jimiras", 8],
    "kd-guide-04-27": ["佳臻", 7],
    "kd-guide-05-02": ["James", null],
    "kd-guide-05-03": ["James", 10],
    "kd-guide-05-04": ["魏教練", 10],
    "kd-guide-05-05": ["Andrew", 11],
    "kd-guide-05-06": ["Sam", 12],
    "kd-guide-05-07": ["Sam", 12],
    "kd-guide-05-08": ["Sam", 12],
    "kd-guide-05-09": ["Sam", 13],
    "kd-guide-05-10": ["Sam", 13],
    "kd-guide-05-11": ["Sam", 14],
    "kd-guide-05-13": ["寬神", 14],
    "kd-guide-06-01": ["Andrew", 8],
    "kd-guide-06-02": ["Sam", 8],
    "kd-guide-07-01": ["溫董", 15],
    "kd-guide-07-02": ["礎豪", 15],
    "kd-guide-07-03": ["Andrew", 17],
    "kd-guide-07-04": ["Ray", 16, "白牆上一條以大手點和大動作為特色的路線。", "A White Wall line built around large holds and long moves."],
    "kd-guide-07-05": ["Ray", 16],
    "kd-guide-07-06": ["陳韓", 16],
    "kd-guide-07-07": ["俊忠", 16],
    "kd-guide-07-08": ["育人", 13],
    "kd-guide-07-09": ["信鋐", 16],
    "kd-guide-07-10": ["Andrew", 16],
    "kd-guide-07-11": ["James", null],
    "kd-guide-07-12": ["Adeline", null],
    "kd-guide-08-02": ["Winnie", 9, "短路線，部分手點較銳利。", "A short climb with some sharp holds."],
    "kd-guide-08-04": ["Alice", 11],
    "kd-guide-08-05": ["Sam", 11, "路書另記載，上段偏右的爬法會提高難度。", "The guide describes a harder variation that finishes farther right."],
    "kd-guide-08-06": ["Ray", 12],
    "kd-guide-08-07": ["Mila", 12],
  };

  const closeButton = dialog.querySelector('.kd-route-dialog__close');
  const content = dialog.querySelector('.kd-route-dialog__content');
  const facts = dialog.querySelector('dl');
  const description = dialog.querySelector('.kd-route-dialog__description');
  const labels = {
    zh: { close: '關閉', grade: '難度', type: '類型', sport: '運動攀登', ascent: '首攀者',
      length: '長度', protection: '固定點', missing: '路書未標示', summary: '路線介紹' },
    en: { close: 'Close', grade: 'Grade', type: 'Style', sport: 'Sport climbing', ascent: 'First ascent',
      length: 'Length', protection: 'Protection', missing: 'Not listed in the guide', summary: 'Route overview' }
  };
  let activeRoute;
  let opener;
  let outsidePointer = false;

  function render() {
    const en = root.dataset.language === 'en';
    const copy = labels[en ? 'en' : 'zh'];
    const [firstAscent, length, zhSummary, enSummary] = kentingRouteFacts[activeRoute.source] || [];
    const name = (en ? activeRoute.en : activeRoute.zh) || activeRoute.zh || activeRoute.en;
    const alternate = en ? activeRoute.zh : activeRoute.en;
    const area = root.querySelector('.gw-sector-card--active');
    const areaName = area?.querySelector(en ? '[data-area-en]' : '[data-area-cn]');
    const protection = (en ? activeRoute.captionEn : activeRoute.captionZh).split(' · ').find(part => part.includes('bolt'));

    dialog.lang = en ? 'en' : 'zh-Hant';
    closeButton.setAttribute('aria-label', copy.close);
    dialog.querySelector('h2').textContent = name;
    dialog.querySelector('[data-route-area]').textContent = areaName?.textContent.trim() || '';
    const subtitle = dialog.querySelector('[data-route-alternate]');
    subtitle.hidden = !alternate || alternate === name;
    subtitle.textContent = alternate || '';
    facts.replaceChildren();
    for (const [label, value] of [
      [copy.grade, activeRoute.grade], [copy.type, copy.sport],
      [copy.ascent, firstAscent], [copy.length, length ? length + ' m' : null],
      [copy.protection, protection]
    ]) {
      const item = document.createElement('div');
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = value || copy.missing;
      item.append(term, detail);
      facts.append(item);
    }
    const summary = en ? enSummary : zhSummary;
    description.hidden = !summary;
    description.querySelector('h3').textContent = copy.summary;
    description.querySelector('p').textContent = summary || '';
  }

  root.addEventListener('kd-route-detail-open', event => {
    if (dialog.open) return;
    ({route: activeRoute, trigger: opener} = event.detail);
    render();
    dialog.showModal();
    content.scrollTop = 0;
  });
  document.addEventListener('kd-language-change', () => {
    if (dialog.open) render();
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('pointerdown', event => { outsidePointer = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (outsidePointer && event.target === dialog) dialog.close();
    outsidePointer = false;
  });
  dialog.addEventListener('close', () => {
    const target = opener?.isConnected ? opener : Array.from(root.querySelectorAll('.kd-route-detail-trigger'))
      .find(button => button.dataset.routeSource === activeRoute?.source);
    target?.focus({preventScroll: true});
  });
})();
