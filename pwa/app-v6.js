/* GO WILD PWA v6. Webflow owns navigation animations, slides and form submission. */
(function () {
  'use strict';
  if (window.GWApp) return;
  var root = document.documentElement;
  var display = window.matchMedia('(display-mode: standalone)');
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var simulated = local && root.hasAttribute('data-gw-app-test');
  var installed = false, promptEvent = null, dialog = null, entry = null, languageRoot = null;
  var icons = 'https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/pwa/icons/';
  var appLanguage = 'zh', menuLanguage = null, dialogLanguage = null;
  var previousFocus = null, reloadButton = null, refreshDialog = null, refreshing = false, hiddenAt = null;

  function standalone() { return display.matches || navigator.standalone === true; }
  function english() { return standalone() || simulated ? appLanguage === 'en' : !!(languageRoot && (languageRoot.dataset.language === 'en' || languageRoot.lang === 'en')); }
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
    syncLanguageChoices();
    if (window.GWAppTheme) window.GWAppTheme.sync();
    if (reloadButton) { reloadButton.setAttribute('aria-label', copy('重新整理此頁', 'Reload this page')); reloadButton.title = copy('重新整理此頁', 'Reload this page'); }
    if (entry) {
      entry.querySelector('span').textContent = copy('加入主畫面App', 'Add to Home Screen');
      entry.setAttribute('aria-label', copy('將 GO WILD 加入主畫面App', 'Add GO WILD to your Home Screen'));
    }
    if (dialog && dialog.open) renderDialog();
  }
  function closeDialog() {
    if (dialog) dialog.close();
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
  }
  function installSteps(platform, language) {
    var copy = function (zh, en) { return language === 'en' ? en : zh; };
    var frame = '<rect x="10" y="2" width="60" height="82" rx="10"/><path d="M34 7h12M33 79h14"/>';
    var share = frame + '<path d="M28 54h24v16H28zM40 62V28m-8 8 8-8 8 8"/>';
    var add = frame + '<rect x="16" y="28" width="48" height="32" rx="5"/><path d="M34 44h12m-6-6v12"/>';
    var home = frame + '<rect x="23" y="25" width="34" height="34" rx="7" class="gw-app-diagram-selected"/><path d="m31 42 6 6 13-14"/>';
    var menu = frame + '<circle cx="30" cy="44" r="1"/><circle cx="40" cy="44" r="1"/><circle cx="50" cy="44" r="1"/>';
    function item(drawing, title, detail) { return '<li><svg viewBox="0 0 80 88" aria-hidden="true">' + drawing + '</svg><strong>' + title + '</strong><span>' + detail + '</span></li>'; }
    if (platform === 'ios') return item(share, copy('分享', 'Share'), copy('開啟 Safari 分享選單', 'Open Safari’s Share menu')) + item(add, copy('加入主畫面', 'Add to Home Screen'), copy('點選 ＋ 加入主畫面', 'Choose Add to Home Screen')) + item(home, copy('加入', 'Add'), copy('開啟「以網頁 App 開啟」後確認', 'Keep Open as Web App enabled'));
    if (platform === 'prompt') return item(add, copy('安裝', 'Install'), copy('點選下方安裝按鈕', 'Use the install button below')) + item(add, copy('確認', 'Confirm'), copy('確認瀏覽器提示', 'Confirm in your browser')) + item(home, 'GO WILD', copy('從 App 圖示開啟', 'Open from the app icon'));
    return item(menu, copy('選單', 'Menu'), copy('開啟瀏覽器選單', 'Open the browser menu')) + item(add, copy('安裝', 'Install'), copy('選安裝／加入主畫面或 Dock', 'Choose Install, Home Screen or Dock')) + item(home, 'GO WILD', copy('從 App 圖示開啟', 'Open from the app icon'));
  }
  function initMenuHistory() {
    if (window.GWMenuHistory) return;
    var overlays = Array.from(document.querySelectorAll('.mobile-overlay.gw'));
    var trigger = document.querySelector('.navi-buttom-block.gw');
    var snapshot = null, closing = false, intent = '';
    var properties = ['overflow', 'position', 'top', 'left', 'paddingRight'];
    function visible(node) { var style = getComputedStyle(node); return style.display !== 'none' && style.visibility !== 'hidden'; }
    function remember() {
      snapshot = { body: {}, html: {}, x: window.scrollX, y: window.scrollY };
      properties.forEach(function (key) { snapshot.body[key] = document.body.style[key]; snapshot.html[key] = root.style[key]; });
    }
    function releaseLock() {
      if (snapshot) {
        var fixed = document.body.style.position === 'fixed';
        properties.forEach(function (key) { document.body.style[key] = snapshot.body[key]; root.style[key] = snapshot.html[key]; });
        if (fixed && snapshot.body.position !== 'fixed') window.scrollTo(snapshot.x, snapshot.y);
      } else if (document.body.style.overflow === 'hidden') document.body.style.overflow = '';
    }
    function close() {
      if (closing) return;
      var open = overlays.some(visible);
      if (!open && !root.hasAttribute('data-gw-menu-reset')) return;
      closing = true;
      // Close through the real trigger so Webflow's alternating click state also resets.
      if (open && intent !== 'closed' && trigger) trigger.click();
      root.setAttribute('data-gw-menu-reset', '');
      overlays.forEach(function (node) { node.style.display = 'none'; node.setAttribute('aria-hidden', 'true'); });
      intent = 'closed';
      if (document.activeElement && overlays.some(function (node) { return node.contains(document.activeElement); })) document.activeElement.blur();
      releaseLock();
      root.removeAttribute('data-gw-menu-open');
      if (window.GWMenuViewport) window.GWMenuViewport.refresh();
      closing = false;
    }
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target.closest) return;
      if (trigger && (target === trigger || trigger.contains(target))) {
        var open = overlays.some(visible);
        if (!closing && !open) remember();
        intent = open ? 'closed' : 'open';
        if (!closing) {
          root.removeAttribute('data-gw-menu-reset');
          overlays.forEach(function (node) { node.removeAttribute('aria-hidden'); });
        }
        return;
      }
      var link = target.closest('.mobile-overlay.gw a[href]');
      if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) close();
    }, true);
    window.addEventListener('pagehide', close);
    window.addEventListener('pageshow', function (event) { if (event.persisted) close(); });
    window.GWMenuHistory = { close: close };
  }
  function hasUnsavedForm() {
    return Array.from(document.querySelectorAll('form input,form textarea,form select')).some(function (input) {
      if (input.disabled || /^(hidden|submit|button|reset)$/i.test(input.type)) return false;
      if (/^(checkbox|radio)$/i.test(input.type)) return input.checked !== input.defaultChecked;
      if (input.tagName === 'SELECT') {
        var option = Array.from(input.options).find(function (row) { return row.defaultSelected; }) || input.options[0];
        return !!option && input.value !== option.value;
      }
      return input.value !== input.defaultValue;
    });
  }
  function protectedView() {
    if (document.querySelector('dialog[open]') || document.fullscreenElement) return true;
    return Array.from(document.querySelectorAll('iframe')).some(function (frame) {
      return /adobe|acrobat|documentcloud/i.test(frame.src + ' ' + frame.id) && frame.getClientRects().length > 0;
    });
  }
  function performReload() {
    if (refreshing) return;
    refreshing = true;
    if (reloadButton) { reloadButton.disabled = true; reloadButton.setAttribute('aria-busy', 'true'); }
    if (window.GWMenuHistory) window.GWMenuHistory.close();
    location.reload();
  }
  function requestRefresh() {
    if (!hasUnsavedForm()) { performReload(); return; }
    if (!refreshDialog) { refreshDialog = document.createElement('dialog'); refreshDialog.className = 'gw-app-install-dialog gw-app-refresh-dialog'; document.body.appendChild(refreshDialog); }
    refreshDialog.setAttribute('aria-labelledby', 'gw-app-refresh-title');
    refreshDialog.innerHTML = '<h2 id="gw-app-refresh-title">' + copy('重新整理此頁？', 'Reload this page?') + '</h2><p>' + copy('尚未送出的表單內容會被清除。', 'Your unsent form entries will be cleared.') + '</p><button type="button" class="gw-app-install-action" data-confirm-reload>' + copy('重新整理', 'Reload') + '</button><button type="button" class="gw-app-refresh-cancel">' + copy('保留內容', 'Keep my entries') + '</button>';
    refreshDialog.querySelector('[data-confirm-reload]').addEventListener('click', performReload);
    refreshDialog.querySelector('.gw-app-refresh-cancel').addEventListener('click', function () { refreshDialog.close(); });
    refreshDialog.showModal();
  }
  function initReload() {
    if (!(standalone() || simulated)) return;
    reloadButton = document.createElement('button'); reloadButton.type = 'button'; reloadButton.className = 'gw-app-reload';
    reloadButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 5v6h-6M20 11a8 8 0 1 0-1.5 6"/></svg>';
    reloadButton.addEventListener('click', requestRefresh); document.body.appendChild(reloadButton);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') { hiddenAt = Date.now(); return; }
      if (hiddenAt === null) return;
      var elapsed = Date.now() - hiddenAt; hiddenAt = null;
      if (elapsed < 15 * 60 * 1000) return;
      if (hasUnsavedForm() || protectedView()) { reloadButton.setAttribute('data-update-available', ''); return; }
      performReload();
    });
  }

  function pageLanguageRoot() {
    return document.querySelector('[data-gw-home],[data-gw-course],[data-ld-detail],[data-df-detail],[data-kd-detail],[data-gz-detail],[data-ld-photo],[data-gw-resole],#outside-of-rock,main[data-language],main[lang]');
  }
  function languageButtons(language) {
    return '[data-home-language="'+language+'"],[data-lang-choice="'+language+'"],[data-course-language="'+language+'"],[data-photo-language="'+language+'"],[data-sr-language="'+language+'"],button[data-language="'+language+'"]';
  }
  function syncLanguageChoices() {
    document.querySelectorAll('[data-gw-app-language]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.getAttribute('data-gw-app-language') === appLanguage)); });
    if (menuLanguage) menuLanguage.setAttribute('aria-label', copy('語言', 'Language'));
  }
  function applyAppLanguage() {
    if (!(standalone() || simulated)) return;
    var page = pageLanguageRoot();
    if (page) {
      languageRoot = page;
      var button = page.querySelector(languageButtons(appLanguage));
      // Use each page's real translator; keep form values, map state and widget listeners.
      if (button && page.dataset.language !== appLanguage) button.click();
      document.documentElement.lang = appLanguage === 'en' ? 'en' : 'zh-Hant';
    }
    root.setAttribute('data-gw-app-language', appLanguage);
    syncLanguageChoices();
  }
  function setAppLanguage(language) {
    if (language !== 'zh' && language !== 'en') return;
    appLanguage = language;
    try { localStorage.setItem('gw-app-language-v1', language); } catch (error) {}
    applyAppLanguage(); translate();
  }
  function initLanguage(panel) {
    if (!(standalone() || simulated)) return;
    try { appLanguage = localStorage.getItem('gw-app-language-v1') === 'en' ? 'en' : 'zh'; } catch (error) {}
    if (panel) {
      menuLanguage = document.createElement('div'); menuLanguage.className = 'gw-app-language-switch'; menuLanguage.setAttribute('role', 'group');
      menuLanguage.innerHTML = '<button type="button" data-gw-app-language="zh">中文</button><button type="button" data-gw-app-language="en">EN</button>';
      var setting = panel.querySelector('.gw-color-setting');
      if (setting) setting.insertAdjacentElement('afterend', menuLanguage); else panel.appendChild(menuLanguage);
      menuLanguage.addEventListener('click', function (event) { var button = event.target.closest('[data-gw-app-language]'); if (button) setAppLanguage(button.getAttribute('data-gw-app-language')); });
    }
    // Dynamic page scripts finish after the shared footer on some Webflow pages.
    // Their initial data-language change is the readiness signal, without polling.
    var page = pageLanguageRoot();
    if (page) new MutationObserver(function () { applyAppLanguage(); translate(); }).observe(page, { attributes: true, attributeFilter: ['data-language', 'lang'] });
    window.addEventListener('load', applyAppLanguage, { once: true });
    window.addEventListener('pageshow', function () {
      try { appLanguage = localStorage.getItem('gw-app-language-v1') === 'en' ? 'en' : 'zh'; } catch (error) {}
      applyAppLanguage(); translate();
    });
    window.addEventListener('storage', function (event) {
      if (event.key === 'gw-app-language-v1') { appLanguage = event.newValue === 'en' ? 'en' : 'zh'; applyAppLanguage(); translate(); }
    });
    window.GWAppLanguage = { set: setAppLanguage, get: function () { return appLanguage; } };
    applyAppLanguage();
  }

  function renderDialog() {
    var language = dialogLanguage || (english() ? 'en' : 'zh');
    var copy = function (zh, en) { return language === 'en' ? en : zh; };
    dialog.lang = language === 'en' ? 'en' : 'zh-Hant';
    var ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (simulated) ios = true;
    var steps, note;
    if (promptEvent) {
      steps = installSteps('prompt', language);
      note = copy('首次使用與天氣、地圖等資料仍需網路連線。', 'An internet connection is required for the site, weather and maps.');
    } else if (ios) {
      steps = installSteps('ios', language);
      note = copy('若目前使用其他 App 內建瀏覽器，請先在 Safari 開啟本頁。使用時仍需網路連線。', 'If you are browsing inside another app, open this page in Safari first. An internet connection is required.');
    } else {
      steps = installSteps('menu', language);
      note = copy('各瀏覽器的選項名稱可能不同。若沒有安裝選項，仍可直接使用網站。使用時需網路連線。', 'Menu names vary by browser. You can continue using the website if installation is unavailable. An internet connection is required.');
    }
    dialog.innerHTML = '<button type="button" class="gw-app-install-close" aria-label="' + copy('關閉', 'Close') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>' +
      '<img class="gw-app-install-mark" src="' + icons + 'icon-192-v1.png" alt="" width="48" height="48">' +
      '<h2 id="gw-app-install-title" tabindex="-1">' + copy('將 GO WILD 加入主畫面App', 'Add GO WILD to your Home Screen') + '</h2>' +
      '<div class="gw-app-language-switch gw-app-install-language" role="group" aria-label="Language"><button type="button" data-install-language="zh" aria-pressed="' + String(language === 'zh') + '">中文</button><button type="button" data-install-language="en" aria-pressed="' + String(language === 'en') + '">EN</button></div><p id="gw-app-install-description">' + copy('從App直接開啟，查看岩場地圖、推薦路線與最新資訊。', 'Open the app directly to explore crag maps, selected routes and current information.') + '</p>' +
      '<ol class="gw-app-install-diagrams">' + steps + '</ol><p class="gw-app-install-note">' + note + '</p>' +
      '<button type="button" class="gw-app-install-action">' + (promptEvent ? copy('安裝 GO WILD', 'Install GO WILD') : copy('知道了', 'Got it')) + '</button>';
    dialog.querySelectorAll('[data-install-language]').forEach(function (button) { button.addEventListener('click', function () { dialogLanguage = button.getAttribute('data-install-language'); renderDialog(); dialog.querySelector('[data-install-language="' + dialogLanguage + '"]').focus({ preventScroll: true }); }); });
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
    dialog.querySelector('#gw-app-install-title').focus({ preventScroll: true });
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
  window.addEventListener('pageshow', function () { appearance(); chromeColor(); if (window.GWAppFinishBoot) window.GWAppFinishBoot(); });
  window.GWApp = { showInstall: showInstall, reload: requestRefresh, refresh: function () { appearance(); chromeColor(); } };
  appearance();
  function init() {
    viewport();
    initMenuHistory();
    initReload();
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
    initLanguage(panel);
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
    if (window.GWAppFinishBoot) window.GWAppFinishBoot();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
