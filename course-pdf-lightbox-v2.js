/* Adobe Lightbox without download/print controls or direct-file navigation. */
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
    let opening = false;
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
      if (opening) return;
      opening = true;
      if (status) status.hidden = true;
      button.setAttribute('aria-busy', 'true');
      const finish = () => { opening = false; button.removeAttribute('aria-busy'); };
      const failed = error => {
        finish();
        showStatus(true);
        console.warn('Adobe course PDF preview unavailable:', error);
      };
      try {
        const viewer = new window.AdobeDC.View({
          clientId: container.dataset.pdfClientId,
          divId: container.id
        });
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
