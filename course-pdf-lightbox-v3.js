/* Adobe Lightbox: native close stays above site/App chrome; no download or print. */
(() => {
  const init = () => {
    const button = document.querySelector('[data-course-pdf]');
    const container = document.querySelector('[data-course-pdf-view]');
    const status = document.querySelector('[data-course-pdf-status]');
    if (!button || !container || button.dataset.pdfBound) return;
    button.dataset.pdfBound = 'true';
    const sdkUrl = 'https://acrobatservices.adobe.com/view-sdk/viewer.js';
    let ready = Boolean(window.AdobeDC?.View);
    let sdkFailed = false;
    let opening = false, viewerOpen = false, session = 0;
    const root = document.documentElement;
    if (!document.getElementById('gw-course-pdf-chrome-style')) {
      const style = document.createElement('style');
      style.id = 'gw-course-pdf-chrome-style';
      // Visibility preserves the page's layout/scroll position. Match the brand
      // injected by App Head, not just Webflow's original navigation wrapper.
      style.textContent = 'html[data-gw-course-pdf-open] body :is(.navigation.gw,.gw-app-brand,.navi-buttom-block.gw,.gw-app-reload,.gw-course__nav){visibility:hidden!important;pointer-events:none!important}';
      document.head.appendChild(style);
    }
    const coverChrome = () => root.setAttribute('data-gw-course-pdf-open', '');
    const restoreChrome = () => {
      viewerOpen = false;
      root.removeAttribute('data-gw-course-pdf-open');
    };
    const showStatus = failed => {
      if (!status) return;
      const zh = failed ? 'PDF 預覽暫時無法載入，請稍後重試。' : 'PDF 預覽仍在載入，請稍候再試。';
      const en = failed ? 'The PDF preview is currently unavailable. Please try again later.' : 'The PDF preview is still loading. Please try again shortly.';
      status.setAttribute('data-course-zh', zh);
      status.setAttribute('data-course-en', en);
      status.textContent = document.querySelector('[data-gw-course]')?.dataset.language === 'en' ? en : zh;
      status.hidden = false;
    };
    document.addEventListener('adobe_dc_view_sdk.ready', () => {
      ready = Boolean(window.AdobeDC?.View);
      sdkFailed = false;
      if (ready && status) status.hidden = true;
    });
    if (!ready) {
      let script = document.querySelector('script[src="' + sdkUrl + '"]');
      const existing = Boolean(script);
      if (!script) {
        script = document.createElement('script');
        script.src = sdkUrl;
        script.async = true;
      }
      script.addEventListener('error', () => { sdkFailed = true; showStatus(true); });
      if (!existing) document.head.appendChild(script);
    }
    button.addEventListener('click', event => {
      event.preventDefault();
      if (!ready) { showStatus(sdkFailed); return; }
      if (opening || viewerOpen) return;
      opening = true;
      const currentSession = ++session;
      if (status) status.hidden = true;
      button.setAttribute('aria-busy', 'true');
      const finish = () => { if (currentSession !== session) return; opening = false; button.removeAttribute('aria-busy'); };
      const close = () => {
        if (currentSession !== session) return;
        finish(); restoreChrome();
        if (button.isConnected) button.focus({ preventScroll: true });
      };
      const failed = error => {
        if (currentSession !== session) return;
        finish();
        // A visible Adobe error screen still needs its native close button.
        if (!viewerOpen) restoreChrome();
        showStatus(true);
        console.warn('Adobe course PDF preview unavailable:', error);
      };
      try {
        const viewer = new window.AdobeDC.View({
          clientId: container.dataset.pdfClientId,
          divId: container.id
        });
        viewer.registerCallback(window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER, event => {
          if (currentSession !== session) return;
          if (event.type === 'PDF_VIEWER_OPEN' || event.type === 'APP_RENDERING_START') {
            viewerOpen = true; coverChrome();
          } else if (event.type === 'PDF_VIEWER_CLOSE') {
            close();
          } else if (event.type === 'APP_RENDERING_FAILED') {
            failed(new Error('PDF_RENDERING_FAILED'));
          }
        }, {
          enableFilePreviewEvents: true,
          listenOn: ['PDF_VIEWER_OPEN', 'PDF_VIEWER_CLOSE', 'APP_RENDERING_START', 'APP_RENDERING_FAILED']
        });
        // Hide the site chrome before Adobe creates its lightbox, avoiding an
        // initial frame where the native X is covered by the fixed App menu.
        coverChrome();
        const preview = viewer.previewFile({
          content: { location: { url: button.dataset.pdfUrl } },
          metaData: { fileName: button.dataset.pdfFileName }
        }, {
          embedMode: 'LIGHT_BOX',
          exitPDFViewerType: 'CLOSE',
          showDownloadPDF: false,
          showPrintPDF: false
        });
        Promise.resolve(preview).then(finish, failed);
      } catch (error) {
        failed(error);
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
