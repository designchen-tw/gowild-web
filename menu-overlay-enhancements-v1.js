/* Keep the visible menu and the document fallback surface in the same theme.
   This does not directly control Safari's browser UI or replace Webflow's menu. */
(function () {
  'use strict';
  if (window.GWMenuViewport) return;
  var root = document.documentElement;
  var overlays = [];
  var observers = [];
  var frame = 0;
  var destroyed = false;
  var edgeSurfaces = [];

  function removeEdgeSurfaces() {
    edgeSurfaces.forEach(function (edge) { edge.remove(); });
    edgeSurfaces = [];
  }

  function updateEdgeSurfaces(color) {
    if (!edgeSurfaces.length) {
      ['top', 'bottom'].forEach(function (side) {
        var edge = document.createElement('div');
        edge.className = 'gw-menu-chrome-edge gw-menu-chrome-edge--' + side;
        edge.setAttribute('aria-hidden', 'true');
        edge.setAttribute('data-gw-menu-chrome-edge', side);
        document.body.appendChild(edge);
        edgeSurfaces.push(edge);
      });
    }
    edgeSurfaces.forEach(function (edge) {
      if (edge.style.backgroundColor !== color) edge.style.backgroundColor = color;
    });
  }

  function sync() {
    if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    if (destroyed) return;
    var color;
    var open = overlays.find(function (overlay) {
      var style = getComputedStyle(overlay);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      color = style.backgroundColor;
      return true;
    });
    if (!open) {
      root.removeAttribute('data-gw-menu-open');
      root.style.removeProperty('--gw-menu-active-surface');
      removeEdgeSurfaces();
      return;
    }
    if (root.style.getPropertyValue('--gw-menu-active-surface') !== color) {
      root.style.setProperty('--gw-menu-active-surface', color);
    }
    // Full-viewport fixed layers can retain the previous extension color in
    // WebKit. Thin opaque edge surfaces provide separate sampling candidates.
    // They exist only while the menu is visible and never handle input.
    updateEdgeSurfaces(color);
    if (!root.hasAttribute('data-gw-menu-open')) {
      root.setAttribute('data-gw-menu-open', '');
    }
  }

  function schedule() {
    if (!destroyed && !frame) frame = requestAnimationFrame(sync);
  }

  function init() {
    if (destroyed) return;
    overlays = Array.from(document.querySelectorAll('.mobile-overlay.gw')).filter(function (overlay) {
      return !!overlay.querySelector('[data-gw-full-menu]');
    });
    overlays.forEach(function (overlay) {
      // Webflow changes the outer display at the start/end of its animation.
      // Sync before paint so closing does not expose a hidden homepage frame.
      var observer = new MutationObserver(sync);
      observer.observe(overlay, { attributes: true, attributeFilter: ['style', 'class', 'aria-hidden'] });
      observers.push(observer);
    });
    // Run in the same update as the theme attribute, before the next paint.
    var themeObserver = new MutationObserver(sync);
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-gw-theme'] });
    observers.push(themeObserver);
    window.addEventListener('pageshow', schedule);
    sync();
  }

  function destroy() {
    destroyed = true;
    if (frame) cancelAnimationFrame(frame);
    document.removeEventListener('DOMContentLoaded', init);
    window.removeEventListener('pageshow', schedule);
    observers.forEach(function (observer) { observer.disconnect(); });
    root.removeAttribute('data-gw-menu-open');
    root.style.removeProperty('--gw-menu-active-surface');
    removeEdgeSurfaces();
    delete window.GWMenuViewport;
  }

  window.GWMenuViewport = { refresh: schedule, destroy: destroy };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* Touch accordion: lay out once, then animate visual position changes.
   Existing group state, links, aria-expanded and inert remain authoritative. */
(function () {
  'use strict';
  if (window.GWMenuAccordion) return;
  var touch = window.matchMedia('(hover: none) and (pointer: coarse)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var running = new WeakMap();

  function stop(shell) {
    var animations = running.get(shell);
    if (!animations) return;
    animations.forEach(function (animation) { animation.cancel(); });
    running.delete(shell);
  }

  function change(shell, update) {
    if (!touch.matches || reduced.matches) {
      stop(shell);
      update();
      return;
    }
    var panel = shell.querySelector('.gw-menu-panel');
    var nodes = panel && Array.from(panel.querySelectorAll(
      '.gw-menu-brand,.gw-menu-line,.gw-menu-group,.gw-color-setting,.gw-site-language-switch,.gw-home-compact-setting,.gw-menu-social'
    ));
    if (!nodes || !nodes.length || typeof nodes[0].animate !== 'function') {
      update();
      return;
    }

    // Capture current visible positions before canceling a previous animation,
    // so rapid changes continue from what the user is actually seeing.
    var before = nodes.map(function (node) { return node.getBoundingClientRect(); });
    stop(shell);
    update();
    // Batch all layout reads before creating any new animation effects.
    var after = nodes.map(function (node) { return node.getBoundingClientRect(); });
    var active = new Set();
    running.set(shell, active);
    nodes.forEach(function (node, index) {
      var x = before[index].left - after[index].left;
      var y = before[index].top - after[index].top;
      if (Math.abs(x) < 0.25 && Math.abs(y) < 0.25) return;
      var animation = node.animate([
        { transform: 'translate(' + x + 'px,' + y + 'px)' },
        { transform: 'translate(0px,0px)' }
      ], { duration: 180, easing: 'cubic-bezier(.2,.7,.3,1)' });
      active.add(animation);
      function release() {
        active.delete(animation);
        if (!active.size && running.get(shell) === active) running.delete(shell);
      }
      animation.onfinish = release;
      animation.oncancel = release;
    });
    if (!active.size) running.delete(shell);
  }

  window.GWMenuAccordion = { change: change, cancel: stop };
})();
