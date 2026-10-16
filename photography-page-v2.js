/* Photography language/navigation and fixed Instagram previews on every viewport. */
(() => {
  const root = document.querySelector('[data-ld-photo]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const sections = [...root.querySelectorAll('[data-photo-section]')];
  const links = [...root.querySelectorAll('[data-photo-link]')];
  const languageButtons = [...root.querySelectorAll('[data-photo-language]')];
  const frames = [...root.querySelectorAll('[data-photo-instagram]')];
  const previews = [...root.querySelectorAll('[data-photo-preview-link]')];
  const mobile = matchMedia('(max-width:600px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const setLanguage = language => {
    const english = language === 'en';
    root.dataset.language = english ? 'en' : 'zh';
    root.setAttribute('lang', english ? 'en' : 'zh-Hant');
    root.querySelectorAll('[data-photo-zh][data-photo-en]').forEach(element => {
      element.textContent = element.dataset[english ? 'photoEn' : 'photoZh'];
    });
    root.querySelectorAll('[data-photo-aria-zh][data-photo-aria-en]').forEach(element => {
      element.setAttribute('aria-label', element.dataset[english ? 'photoAriaEn' : 'photoAriaZh']);
    });
    frames.forEach(frame => {
      frame.title = frame.dataset[english ? 'photoTitleEn' : 'photoTitleZh'];
    });
    languageButtons.forEach(button => {
      const active = button.dataset.photoLanguage === root.dataset.language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.photoLanguage)));
  setLanguage(root.dataset.language);

  const setActive = id => links.forEach(link => {
    const active = link.dataset.photoLink === id;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  root.querySelectorAll('[data-photo-link],[data-photo-jump]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      const target = sections.find(section => '#' + section.id === href);
      if (!target) return;
      event.preventDefault();
      setActive(target.dataset.photoSection);
      target.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    });
  });
  let pending = false;
  const syncNavigation = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      let current = sections[0];
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= innerHeight * .38) current = section;
      });
      if (current) setActive(current.dataset.photoSection);
      pending = false;
    });
  };

  const sizePreviews = () => {
    if (!mobile.matches) return;
    frames.forEach(frame => {
      const wrap = frame.parentElement;
      const width = wrap.clientWidth;
      if (!width) return;
      // Instagram's profile embed expects at least 326px; fit narrow phones without a horizontal scroller.
      const scale = Math.min(1, width / 326);
      wrap.style.setProperty('--photo-preview-scale', String(scale));
      wrap.style.setProperty('--photo-preview-width', Math.max(326, width) + 'px');
      wrap.style.setProperty('--photo-preview-height', (400 * scale + 2) + 'px');
    });
  };
  const syncFrames = () => {
    frames.forEach(frame => {
      frame.setAttribute('scrolling', 'no');
      frame.setAttribute('tabindex', '-1');
      frame.setAttribute('aria-hidden', 'true');
    });
    previews.forEach(link => {
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-hidden', 'false');
    });
    sizePreviews();
  };
  mobile.addEventListener('change', syncFrames);
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(sizePreviews);
    frames.forEach(frame => observer.observe(frame.parentElement));
  }
  addEventListener('resize', () => { sizePreviews(); syncNavigation(); });
  addEventListener('scroll', syncNavigation, { passive: true });
  syncFrames();
  syncNavigation();
})();
