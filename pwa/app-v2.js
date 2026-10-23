/* GO WILD PWA v2. Webflow owns navigation animations, slides and form submission. */
(function () {
  'use strict';
  if (window.GWApp) return;
  var root = document.documentElement;
  var display = window.matchMedia('(display-mode: standalone)');
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var simulated = local && root.hasAttribute('data-gw-app-test');
  var installed = false, promptEvent = null, dialog = null, entry = null, languageRoot = null;
  var icons = 'https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/pwa/icons/';
  var previousFocus = null;

  function standalone() { return display.matches || navigator.standalone === true; }
  function english() { return !!(languageRoot && (languageRoot.dataset.language === 'en' || languageRoot.lang === 'en')); }
  function copy(zh, en) { return english() ? en : zh; }
  function viewport() {
    // Older page Embeds can contain a second viewport meta. Keep one authoritative value.
    var nodes = Array.from(document.querySelectorAll('meta[name="viewport"]'));
    var node = nodes.shift();
    if (!node) { node = document.createElement('meta'); node.name = 'viewport'; document.head.appendChild(node); }
    node.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    nodes.forEach(function (duplicate) { duplicate.remove(); });
  }
  function appearance() {
    root.setAttribute('data-gw-app-display', standalone() || simulated ? 'standalone' : 'browser');
    if (entry) entry.hidden = installed || standalone();
  }
  function chromeColor() {
    var light = root.getAttribute('data-gw-theme') === 'light';
    var color = root.hasAttribute('data-gw-menu-open') ? (light ? '#edf0eb' : '#0b0d0e') : (light ? '#f6f7f3' : '#0b0d0e');
    var node = document.querySelector('meta[data-gw-app-theme-color]');
    if (node) node.content = color;
  }
  function translate() {
    if (window.GWAppTheme) window.GWAppTheme.sync();
    if (entry) {
      entry.querySelector('span').textContent = copy('加入主畫面', 'Add to Home Screen');
      entry.setAttribute('aria-label', copy('將 GO WILD 加入主畫面', 'Add GO WILD to your Home Screen'));
    }
    if (dialog && dialog.open) renderDialog();
  }
  function closeDialog() {
    if (dialog) dialog.close();
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
  }
  function renderDialog() {
    var ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (simulated) ios = true;
    var steps, note;
    if (promptEvent) {
      steps = copy('<li>點選下方「安裝 GO WILD」。</li><li>在瀏覽器提示中確認安裝。</li><li>之後從主畫面的 GO WILD 圖示開啟。</li>', '<li>Choose Install GO WILD below.</li><li>Confirm installation in your browser.</li><li>Open GO WILD from its app icon.</li>');
      note = copy('首次使用與天氣、地圖等資料仍需網路連線。', 'An internet connection is required for the site, weather and maps.');
    } else if (ios) {
      steps = copy('<li>在 Safari 的選單中點選「分享」。</li><li>選擇「加入主畫面」。</li><li>保留「以網頁 App 開啟」，再點「加入」。</li>', '<li>Choose Share from Safari’s page menu.</li><li>Select Add to Home Screen.</li><li>Keep Open as Web App enabled, then tap Add.</li>');
      note = copy('若目前使用其他 App 內建瀏覽器，請先在 Safari 開啟本頁。使用時仍需網路連線。', 'If you are browsing inside another app, open this page in Safari first. An internet connection is required.');
    } else {
      steps = copy('<li>開啟瀏覽器的選單。</li><li>選擇「安裝應用程式」或「加入主畫面」；Mac Safari 可選擇「加入 Dock」。</li><li>確認後，從 GO WILD 圖示開啟。</li>', '<li>Open your browser’s menu.</li><li>Choose Install app or Add to Home Screen. In Safari on Mac, choose Add to Dock.</li><li>Confirm, then open GO WILD from its icon.</li>');
      note = copy('各瀏覽器的選項名稱可能不同。若沒有安裝選項，仍可直接使用網站。使用時需網路連線。', 'Menu names vary by browser. You can continue using the website if installation is unavailable. An internet connection is required.');
    }
    dialog.innerHTML = '<button type="button" class="gw-app-install-close" aria-label="' + copy('關閉', 'Close') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>' +
      '<img class="gw-app-install-mark" src="' + icons + 'icon-192-v1.png" alt="" width="48" height="48">' +
      '<h2 id="gw-app-install-title">' + copy('將 GO WILD 加入主畫面', 'Add GO WILD to your Home Screen') + '</h2>' +
      '<p id="gw-app-install-description">' + copy('從主畫面直接開啟，查看岩場地圖、推薦路線與最新資訊。', 'Open directly from your Home Screen to explore crag maps, selected routes and current information.') + '</p>' +
      '<ol>' + steps + '</ol><p class="gw-app-install-note">' + note + '</p>' +
      '<button type="button" class="gw-app-install-action">' + (promptEvent ? copy('安裝 GO WILD', 'Install GO WILD') : copy('知道了', 'Got it')) + '</button>';
    dialog.querySelector('.gw-app-install-close').addEventListener('click', closeDialog);
    dialog.querySelector('.gw-app-install-action').addEventListener('click', async function (event) {
      if (!promptEvent) { closeDialog(); return; }
      var deferred = promptEvent;
      promptEvent = null;
      event.currentTarget.disabled = true;
      try {
        await deferred.prompt();
        var choice = await deferred.userChoice;
        if (choice.outcome === 'accepted') installed = true;
        appearance();
        closeDialog();
      } catch (error) {
        renderDialog();
        dialog.querySelector('.gw-app-install-action').focus({ preventScroll: true });
      }
    });
  }
  function showInstall() {
    if (standalone() || installed) return;
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'gw-app-install-dialog';
      dialog.setAttribute('aria-labelledby', 'gw-app-install-title');
      dialog.setAttribute('aria-describedby', 'gw-app-install-description');
      dialog.addEventListener('cancel', function (event) { event.preventDefault(); closeDialog(); });
      document.body.appendChild(dialog);
    }
    if (typeof dialog.showModal !== 'function') return;
    previousFocus = document.activeElement;
    renderDialog();
    if (!dialog.open) dialog.showModal();
  }
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    promptEvent = event;
    if (dialog && dialog.open) renderDialog();
  });
  window.addEventListener('appinstalled', function () {
    installed = true;
    promptEvent = null;
    appearance();
    if (dialog && dialog.open) closeDialog();
  });
  if (display.addEventListener) display.addEventListener('change', appearance);
  else if (display.addListener) display.addListener(appearance);
  window.addEventListener('pageshow', function () { appearance(); chromeColor(); });
  window.GWApp = { showInstall: showInstall, refresh: function () { appearance(); chromeColor(); } };
  appearance();
  function init() {
    viewport();
    var header = document.querySelector('.navigation.gw');
    var trigger = document.querySelector('.navi-buttom-block.gw');
    if (header) {
      header.setAttribute('data-gw-app-header', '');
      if (standalone() || simulated) {
        var brand = header.querySelector('.link4.gw');
        if (brand) brand.textContent = 'GO WILD | 夠野戶外';
        // A transformed sticky header would trap a fixed descendant. Keep the
        // actual Webflow trigger at body level, preserving its nodes and IDs.
        if (trigger && header.contains(trigger)) document.body.appendChild(trigger);
      }
      function measure() { root.style.setProperty('--gw-app-header-height', Math.ceil(header.getBoundingClientRect().height) + 'px'); }
      measure();
      if (window.ResizeObserver) new ResizeObserver(measure).observe(header);
    }
    var panel = document.querySelector('.gw-menu-panel');
    if (panel) {
      var switcher = panel.querySelector('[data-gw-color-switch]');
      if ((standalone() || simulated) && switcher && window.GWAppTheme) {
        switcher.classList.add('gw-app-color-switch');
        switcher.replaceChildren();
        ['system', 'dark', 'light'].forEach(function (mode) {
          var button = document.createElement('button');
          button.type = 'button';
          button.setAttribute('data-gw-app-color-choice', mode);
          var marks = {
            system: '<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M10 18.5h4"/>',
            dark: '<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>',
            light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>'
          };
          button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + marks[mode] + '</svg>';
          switcher.appendChild(button);
        });
      }
      entry = document.createElement('button');
      entry.type = 'button';
      entry.className = 'gw-app-install-entry';
      entry.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 15v5h14v-5"/></svg><span></span>';
      entry.addEventListener('click', showInstall);
      panel.appendChild(entry);
    }
    languageRoot = document.querySelector('main[data-language],main[lang],[data-gw-home]');
    if (languageRoot) new MutationObserver(translate).observe(languageRoot, { attributes: true, attributeFilter: ['data-language', 'lang'] });
    new MutationObserver(chromeColor).observe(root, { attributes: true, attributeFilter: ['data-gw-theme', 'data-gw-menu-open'] });
    appearance(); translate(); chromeColor();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
