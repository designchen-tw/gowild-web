/* Adobe PDF Embed API Lightbox. The link remains a direct-PDF fallback. */
(() => {
  const init = () => {
    const button = document.querySelector('[data-course-pdf]');
    const container = document.querySelector('[data-course-pdf-view]');
    if (!button || !container || button.dataset.pdfBound) return;
    button.dataset.pdfBound = 'true';
    const sdkUrl = 'https://acrobatservices.adobe.com/view-sdk/viewer.js';
    let ready = Boolean(window.AdobeDC?.View);
    let opening = false;
    document.addEventListener('adobe_dc_view_sdk.ready', () => {
      ready = Boolean(window.AdobeDC?.View);
    });
    if (!ready && !document.querySelector('script[src="' + sdkUrl + '"]')) {
      const script = document.createElement('script');
      script.src = sdkUrl;
      script.async = true;
      script.addEventListener('error', () => {
        console.warn('Adobe PDF viewer unavailable; the course PDF link remains available.');
      });
      document.head.appendChild(script);
    }
    button.addEventListener('click', event => {
      // Respect modified clicks and retain direct access while the SDK is still loading.
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0 || !ready) return;
      event.preventDefault();
      if (opening) return;
      opening = true;
      button.setAttribute('aria-busy', 'true');
      const finish = () => { opening = false; button.removeAttribute('aria-busy'); };
      const fallback = error => {
        finish();
        ready = false;
        console.warn('Adobe PDF viewer could not open the course outline:', error);
        window.location.assign(button.getAttribute('href'));
      };
      try {
        const viewer = new window.AdobeDC.View({
          clientId: container.dataset.pdfClientId,
          divId: container.id
        });
        const preview = viewer.previewFile({
          content: { location: { url: button.getAttribute('href') } },
          metaData: { fileName: button.dataset.pdfFileName }
        }, {
          embedMode: 'LIGHT_BOX',
          exitPDFViewerType: 'CLOSE'
        });
        Promise.resolve(preview).then(finish, fallback);
      } catch (error) {
        fallback(error);
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
