/* The app tools are inserted by independent scripts after the menu has rendered. */
(() => {
  const html = document.documentElement;
  const panel = document.querySelector('[data-gw-full-menu] .gw-menu-panel');
  if (!panel) return;
  const labels = [
    ['.gw-app-share button span', '分享此頁面', 'Share this page'],
    ['.gw-offline-entry span', '離線資料', 'Offline library'],
    ['.gw-app-update-entry span', '檢查 App 更新', 'Check App updates']
  ];
  function sync() {
    const language = html.dataset.gwAppDisplay === 'standalone' && html.dataset.gwAppLanguage
      ? html.dataset.gwAppLanguage
      : window.GWSiteLanguage?.get() || html.lang;
    const english = /^en(?:-|$)/i.test(language);
    for (const [selector, zh, en] of labels) {
      const node = panel.querySelector(selector);
      const label = english ? en : zh;
      if (!node || node.textContent === label) continue;
      if (node.firstChild?.nodeType === Node.TEXT_NODE && node.childNodes.length === 1) {
        node.firstChild.data = label;
      } else {
        node.textContent = label;
      }
    }
  }
  new MutationObserver(sync).observe(html, {
    attributes:true, attributeFilter:['lang','data-gw-app-language','data-gw-app-display']
  });
  new MutationObserver(sync).observe(panel, {childList:true,characterData:true,subtree:true});
  window.addEventListener('pageshow', sync);
  sync();
})();
