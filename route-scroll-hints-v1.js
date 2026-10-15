/* Recommended-route scroll hints shared by all four crag pages. */
(() => {
  const root = document.querySelector('[data-ld-detail], [data-gw-sector-browser]');
  if (!root) return;
  const attached = new WeakSet();
  const instances = new Set();
  const selector = '.ld-sector-expanded__route-scroll, .gw-sector-panel__scroll';
  const tolerance = 2;

  function attach(scroll) {
    if (attached.has(scroll)) return;
    attached.add(scroll);
    const frame = document.createElement('div');
    frame.className = 'gw-route-scroll-hints';
    const rail = document.createElement('div');
    rail.className = 'gw-route-scroll-hints__rail';
    rail.setAttribute('role', 'group');
    rail.hidden = true;
    const makeButton = direction => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gw-route-scroll-hints__button gw-route-scroll-hints__button--' + direction;
      button.hidden = true;
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
        (direction === 'up' ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6') + '"/></svg>';
      button.addEventListener('click', event => {
        event.stopPropagation();
        scroll.scrollBy({
          top: (direction === 'up' ? -1 : 1) * Math.max(80, scroll.clientHeight * .75),
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
        });
      });
      return button;
    };
    const up = makeButton('up');
    const down = makeButton('down');
    rail.append(up, down);
    scroll.parentNode.insertBefore(frame, scroll);
    frame.append(scroll, rail);

    function updateEdges() {
      const visible = scroll.clientHeight > 0 && scroll.clientWidth > 0;
      const max = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
      const overflow = visible && max > tolerance;
      const top = Math.max(0, scroll.scrollTop);
      up.hidden = !overflow || top <= tolerance;
      down.hidden = !overflow || max - top <= tolerance;
      if ((document.activeElement === up && up.hidden) || (document.activeElement === down && down.hidden)) {
        scroll.focus({preventScroll: true});
      }
    }

    function measure() {
      const top = scroll.scrollTop;
      // The control column stays reserved for both short and overflowing lists.
      const overflow = scroll.clientHeight > 0 && scroll.clientWidth > 0 &&
        scroll.scrollHeight - scroll.clientHeight > tolerance;
      frame.classList.toggle('is-overflowing', overflow);
      rail.hidden = !overflow;
      scroll.scrollTop = Math.min(Math.max(0, top), Math.max(0, scroll.scrollHeight - scroll.clientHeight));
      const en = root.dataset.language === 'en';
      rail.setAttribute('aria-label', en ? 'Scroll recommended routes' : '推薦路線捲動');
      up.setAttribute('aria-label', en ? 'Scroll routes up' : '向上捲動推薦路線');
      down.setAttribute('aria-label', en ? 'Scroll routes down' : '向下捲動推薦路線');
      updateEdges();
    }
    let pending = false;
    const requestMeasure = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; measure(); });
    };
    scroll.addEventListener('scroll', updateEdges, {passive: true});
    new MutationObserver(requestMeasure).observe(scroll, {childList: true, subtree: true, characterData: true});
    const resize = new ResizeObserver(requestMeasure);
    resize.observe(scroll);
    const list = scroll.querySelector('ol');
    if (list) resize.observe(list);
    instances.add({requestMeasure});
    requestMeasure();
  }

  const discover = () => {
    root.querySelectorAll(selector).forEach(attach);
    instances.forEach(instance => instance.requestMeasure());
  };
  new MutationObserver(discover).observe(root, {childList: true, subtree: true});
  ['ld', 'df', 'kd', 'gz'].forEach(prefix => document.addEventListener(prefix + '-language-change', discover));
  addEventListener('resize', discover, {passive: true});
  document.fonts?.ready.then(discover);
  discover();
})();
