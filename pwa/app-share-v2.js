/* Share the current page from the installed mobile app menu. */
(() => {
  const root = document.documentElement;
  const tools = document.querySelector('.gw-menu-panel .gw-menu-tools');
  if (!tools || tools.querySelector('.gw-app-share')) return;
  const mobile = matchMedia('(pointer: coarse)');
  const standalone = matchMedia('(display-mode: standalone)');
  const isApp = () => mobile.matches && (standalone.matches || navigator.standalone === true ||
    root.dataset.gwAppDisplay === 'standalone');

  const row = document.createElement('div');
  row.className = 'gw-app-share';
  row.hidden = true;
  row.innerHTML = `<button type="button" class="gw-menu-statement-entry">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V3m-4 4 4-4 4 4m1 3h3v11H4V10h3"/></svg><span></span>
  </button><p role="status" hidden></p><input type="url" readonly hidden>`;
  const button = row.querySelector('button');
  const label = row.querySelector('button span');
  const status = row.querySelector('p');
  const address = row.querySelector('input');
  const english = () => (root.dataset.gwAppLanguage || root.lang) === 'en';
  const t = (zh, en) => english() ? en : zh;
  let result = '';
  let busy = false;
  const sync = () => {
    row.hidden = !isApp();
    label.textContent = t('分享此頁面', 'Share this page');
    status.hidden = !result;
    status.textContent = result === 'copied' ? t('已複製連結', 'Link copied') :
      result === 'manual' ? t('請複製下方連結', 'Copy the link below') : '';
    address.hidden = result !== 'manual';
    address.setAttribute('aria-label', t('頁面連結', 'Page link'));
  };

  button.addEventListener('click', async () => {
    if (!isApp() || busy) return;
    result = '';
    sync();
    busy = true;
    const url = new URL(location.href);
    url.searchParams.delete('offline-save');
    try {
      if (navigator.share) {
        try {
          await navigator.share({title: document.title, url: url.href});
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(url.href);
        result = 'copied';
      } catch {
        address.value = url.href;
        result = 'manual';
      }
      sync();
      if (result === 'manual') {
        address.focus({preventScroll:true});
        address.select();
      }
    } finally {
      busy = false;
    }
  });

  const style = document.createElement('style');
  style.textContent = `
    .gw-app-share[hidden], .gw-app-share [hidden] { display:none!important; }
    .gw-app-share { text-align:center; }
    .gw-menu-tools:has(>.gw-app-share:not([hidden])){display:flex;flex-direction:column;align-items:center;gap:8px}
    html[data-gw-theme] .gw-menu-shell .gw-menu-tools:has(>.gw-app-share:not([hidden]))>*{margin-block:0!important}
    html[data-gw-theme] .gw-menu-shell :is(.gw-app-share,.gw-menu-tools:has(>.gw-app-share:not([hidden]))+.gw-menu-statement-row) .gw-menu-statement-entry{min-height:40px;padding-block:8px;line-height:1.5}
    .gw-menu-shell .gw-app-share button svg {
      fill:none; stroke:currentColor; stroke-width:1.5;
      stroke-linecap:round; stroke-linejoin:round;
    }
    .gw-app-share p, .gw-app-share input {
      margin:0 auto; font:inherit; font-size:12px; color:var(--gw-menu-idle,#adadad);
    }
    .gw-app-share input { width:min(240px,90%); background:transparent; border:1px solid currentColor; }
  `;
  document.head.append(style);
  tools.append(row);
  new MutationObserver(sync).observe(root, {
    attributes:true, attributeFilter:['data-gw-app-display','data-gw-app-language','lang']
  });
  mobile.addEventListener('change', sync);
  standalone.addEventListener('change', sync);
  sync();
})();
