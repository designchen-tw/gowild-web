/* Shared map zoom/pan controls. Responsive CSS defines each map's base size. */
(() => {
  window.GoWildMapZoom = ({ mount, viewport, svg, initialView = null, minimumView = null }) => {
    viewport.classList.add('gw-map-viewport');
    const controls = document.createElement('div');
    controls.className = 'gw-map-zoom';
    controls.setAttribute('role', 'group');
    controls.setAttribute('data-map-zoom-controls', '');
    controls.innerHTML = `<button type="button" data-map-zoom-in><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg></button><button type="button" data-map-zoom-out><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button>`;
    viewport.parentElement.appendChild(controls);
    const zoomIn = mount.querySelector('[data-map-zoom-in]');
    const zoomOut = mount.querySelector('[data-map-zoom-out]');
    let minZoom = 1;
    const maxZoom = 3, zoomStep = .25;
    let zoom = 1;
    let gesture = null;
    let suppressClickUntil = 0;
    const pointers = new Map();
    let previousSize = null;
    let hasInteracted = false;

    // Opening scale and minimum fit are independent. Long maps may keep vertical scrolling.
    const refreshZoomLimit = () => {
      const bounds = svg.getBoundingClientRect();
      if (!viewport.clientWidth || !viewport.clientHeight || !bounds.width || !bounds.height) return;
      const baseWidth = bounds.width / zoom, baseHeight = bounds.height / zoom;
      const widthOnly = minimumView?.fit === 'width' &&
        (!minimumView.media || matchMedia(minimumView.media).matches);
      minZoom = Math.min(1, viewport.clientWidth / baseWidth,
        widthOnly ? Infinity : viewport.clientHeight / baseHeight);
    };
    const syncZoomControls = () => {
      refreshZoomLimit();
      zoomIn.disabled = zoom >= maxZoom - .001;
      zoomOut.disabled = zoom <= minZoom + .001;
      mount.dataset.zoom = String(zoom);
      mount.dataset.mapAtMinimum = String(zoom <= minZoom + .001);
    };
    const center = () => ({ x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 });
    // Clamp against the SVG itself, excluding any browser overscroll or extra scroll area.
    const boundedPosition = (left, top) => {
      const bounds = svg.getBoundingClientRect();
      const clamp = (value, maximum) => Math.min(Math.max(0, maximum), Math.max(0, Number.isFinite(value) ? value : 0));
      return { left: clamp(left, bounds.width - viewport.clientWidth),
        top: clamp(top, bounds.height - viewport.clientHeight) };
    };
    const scrollToPosition = (left, top) => {
      const position = boundedPosition(left, top);
      viewport.scrollTo({ ...position, behavior: 'instant' });
    };
    // Store the point in map coordinates so its screen position survives a resize.
    const mapPointAt = point => {
      const bounds = svg.getBoundingClientRect();
      const position = boundedPosition(viewport.scrollLeft, viewport.scrollTop);
      return { x: (position.left + point.x) / bounds.width,
        y: (position.top + point.y) / bounds.height };
    };
    const setZoom = (next, point = center(), anchor = mapPointAt(point)) => {
      refreshZoomLimit();
      zoom = Math.min(maxZoom, Math.max(minZoom, next));
      svg.style.setProperty('--gw-map-zoom', String(zoom));
      const bounds = svg.getBoundingClientRect();
      scrollToPosition(anchor.x * bounds.width - point.x, anchor.y * bounds.height - point.y);
      syncZoomControls();
      previousSize = size();
    };
    zoomIn.addEventListener('click', () => { hasInteracted = true; setZoom(zoom + zoomStep); });
    zoomOut.addEventListener('click', () => { hasInteracted = true; setZoom(zoom - zoomStep); });
    viewport.addEventListener('keydown', event => {
      hasInteracted = true;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === '+' || event.key === '=' || event.key === '-') {
        event.preventDefault();
        setZoom(zoom + (event.key === '-' ? -zoomStep : zoomStep));
      }
    });
    // Trackpad pinch is exposed as a control-wheel event by Chromium browsers.
    viewport.addEventListener('wheel', event => {
      hasInteracted = true;
      if (!event.ctrlKey) return;
      event.preventDefault();
      const bounds = viewport.getBoundingClientRect();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
      setZoom(zoom * Math.exp(-event.deltaY * unit * .01),
        { x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    }, { passive: false });

    const pointerPoint = event => {
      const bounds = viewport.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    const pair = () => {
      const [a, b] = [...pointers.values()];
      return { point: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        distance: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)) };
    };
    const beginGesture = () => {
      if (pointers.size >= 2) {
        const { point, distance } = pair();
        gesture = { type: 'pinch', zoom, distance, anchor: mapPointAt(point) };
        suppressClickUntil = performance.now() + 400;
      } else if (pointers.size === 1) {
        gesture = { type: 'pan', point: [...pointers.values()][0],
          ...boundedPosition(viewport.scrollLeft, viewport.scrollTop), moved: false };
      } else {
        gesture = null;
        viewport.classList.remove('is-dragging');
      }
    };
    viewport.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      hasInteracted = true;
      pointers.set(event.pointerId, pointerPoint(event));
      // Capture on the original target so a stationary tap still selects a marker.
      if (event.target.setPointerCapture) event.target.setPointerCapture(event.pointerId);
      scrollToPosition(viewport.scrollLeft, viewport.scrollTop);
      beginGesture();
    });
    viewport.addEventListener('pointermove', event => {
      if (!pointers.has(event.pointerId) || !gesture) return;
      const point = pointerPoint(event);
      pointers.set(event.pointerId, point);
      if (gesture.type === 'pinch') {
        const current = pair();
        setZoom(gesture.zoom * current.distance / gesture.distance, current.point, gesture.anchor);
      } else {
        const dx = point.x - gesture.point.x, dy = point.y - gesture.point.y;
        if (!gesture.moved && Math.hypot(dx, dy) < 6) return;
        gesture.moved = true;
        scrollToPosition(gesture.left - dx, gesture.top - dy);
      }
      event.preventDefault();
      viewport.classList.add('is-dragging');
      suppressClickUntil = performance.now() + 400;
    });
    const endPointer = event => {
      if (!pointers.has(event.pointerId)) return;
      if (gesture?.type === 'pinch' || gesture?.moved) suppressClickUntil = performance.now() + 400;
      pointers.delete(event.pointerId);
      beginGesture();
    };
    viewport.addEventListener('pointerup', endPointer);
    viewport.addEventListener('pointercancel', endPointer);
    viewport.addEventListener('lostpointercapture', endPointer);
    viewport.addEventListener('click', event => {
      if (event.detail && performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    // Preserve the map center across the different responsive base sizes.
    const size = () => {
      const bounds = svg.getBoundingClientRect();
      return { width: viewport.clientWidth, height: viewport.clientHeight,
        mapWidth: bounds.width, mapHeight: bounds.height };
    };
    const applyInitialView = () => {
      if (!initialView || hasInteracted || (initialView.media && !matchMedia(initialView.media).matches)) return false;
      const bounds = svg.getBoundingClientRect(), view = svg.viewBox.baseVal;
      if (!viewport.clientWidth || !viewport.clientHeight || !bounds.width || !bounds.height) return false;
      const left = initialView.alignRight ? bounds.width - viewport.clientWidth :
        (initialView.left - view.x) / view.width * bounds.width;
      const top = (initialView.top - view.y) / view.height * bounds.height;
      scrollToPosition(left, top);
      previousSize = size();
      syncZoomControls();
      return true;
    };
    previousSize = size();
    const resizeObserver = new ResizeObserver(() => {
      if (applyInitialView()) return;
      refreshZoomLimit();
      const current = size(), previous = previousSize;
      if (!current.width || !previous.mapWidth ||
        (current.width === previous.width && current.height === previous.height &&
         current.mapWidth === previous.mapWidth && current.mapHeight === previous.mapHeight)) return;
      const left = Math.max(0, Math.min(viewport.scrollLeft, previous.mapWidth - previous.width));
      const top = Math.max(0, Math.min(viewport.scrollTop, previous.mapHeight - previous.height));
      const anchor = { x: (left + previous.width / 2) / previous.mapWidth,
        y: (top + previous.height / 2) / previous.mapHeight };
      setZoom(zoom, center(), anchor);
      if (pointers.size) beginGesture();
    });
    resizeObserver.observe(viewport);
    resizeObserver.observe(svg);
    if (!applyInitialView()) scrollToPosition(viewport.scrollLeft, viewport.scrollTop);
    document.fonts?.ready.then(applyInitialView);
    syncZoomControls();
    const setLanguage = language => {
      const english = language === 'en';
      controls.setAttribute('aria-label', english ? 'Map zoom' : '地圖縮放');
      [[zoomIn, english ? 'Zoom in' : '放大地圖'],
        [zoomOut, english ? 'Zoom out' : '縮小地圖']].forEach(([button, text]) => {
        button.setAttribute('aria-label', text);
        button.title = text;
      });
    };
    setLanguage('zh');
    return { setLanguage, applyInitialView, cancelInitialView: () => { hasInteracted = true; } };
  };
})();
