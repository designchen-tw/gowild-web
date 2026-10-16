/* Shared course navigation, translation and adoption of the existing Webflow form. */
(() => {
  const init = () => {
    const root = document.querySelector('[data-gw-course]');
    if (!root || root.dataset.ready) return;
    root.dataset.ready = 'true';
    const embed = root.closest('.w-embed');
    if (embed) embed.setAttribute('data-gw-course-embed', '');
    const sections = [...root.querySelectorAll('[data-course-section]')];
    const links = [...root.querySelectorAll('[data-course-link]')];
    const languageButtons = [...root.querySelectorAll('[data-course-language]')];
    const reduced = matchMedia('(prefers-reduced-motion:reduce)');
    let language = 'zh';
    let nativeWrapper = null;
    let submitObserver = null;
    const rememberText = (node, zh, en) => {
      node.setAttribute('data-course-zh', zh);
      node.setAttribute('data-course-en', en);
    };
    const translateSubmit = () => {
      const submit = nativeWrapper?.querySelector('[type="submit"]');
      if (!submit) return;
      const current = submit.value;
      const waiting = /稍|wait/i.test(current);
      const wait = language === 'en' ? 'Please wait…' : '請稍候…';
      const next = waiting ? wait : language === 'en' ? 'Send' : '送出';
      submit.setAttribute('data-wait', wait);
      if (current !== next) submit.value = next;
    };
    const setLanguage = next => {
      language = next === 'en' ? 'en' : 'zh';
      root.dataset.language = language;
      root.setAttribute('lang', language === 'en' ? 'en' : 'zh-Hant');
      root.querySelectorAll('[data-course-zh][data-course-en]').forEach(node => {
        node.textContent = node.getAttribute('data-course-' + language);
      });
      root.querySelectorAll('[data-course-aria-zh][data-course-aria-en]').forEach(node => {
        node.setAttribute('aria-label', node.getAttribute('data-course-aria-' + language));
      });
      languageButtons.forEach(button => {
        const active = button.dataset.courseLanguage === language;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      if (nativeWrapper) {
        nativeWrapper.setAttribute('lang', language === 'en' ? 'en' : 'zh-Hant');
        nativeWrapper.querySelectorAll('[data-course-placeholder-zh]').forEach(field => {
          field.setAttribute('placeholder', field.getAttribute('data-course-placeholder-' + language));
        });
      }
      translateSubmit();
    };
    const mountNativeForm = () => {
      if (nativeWrapper) return;
      const form = document.getElementById('wf-form-Course-Inquires');
      const wrapper = form?.closest('.w-form');
      const mount = root.querySelector('[data-course-form-mount]');
      if (!wrapper || !mount) return;
      const sourceSection = wrapper.closest('section');
      nativeWrapper = wrapper;
      // Move the SAME nodes: preserve Webflow identifiers, entered values, handlers and Turnstile.
      mount.appendChild(wrapper);
      wrapper.classList.add('gw-course__native-form');
      root.querySelector('[data-course-form-fallback]').hidden = true;
      if (sourceSection && !root.contains(sourceSection) && !sourceSection.contains(root)) {
        sourceSection.setAttribute('data-gw-course-form-source', '');
        sourceSection.hidden = true;
      }
      const labels = [
        ['名字*', '名字 *', 'Name *'],
        ['Email地址*', '電子郵件 *', 'Email address *'],
        ['詢問主題*', '詢問主題 *', 'Subject *'],
        ['已具備技術', '已具備技術', 'Existing skills'],
        ['先鋒確保', '先鋒確保', 'Lead belaying'],
        ['先鋒攀登', '先鋒攀登', 'Lead climbing'],
        ['固定點架設', '固定點架設', 'Anchor building'],
        ['系統轉換-雙繩垂降', '系統轉換－雙繩垂降', 'Transitions to double-rope rappelling'],
        ['上方確保', '上方確保', 'Belaying from above'],
        ['目前運動攀登先鋒能力', '目前運動攀登先鋒能力', 'Current sport lead-climbing ability'],
        ['目前傳統攀登先鋒能力', '目前傳統攀登先鋒能力', 'Current trad lead-climbing ability'],
        ['訊息內容*', '訊息內容 *', 'Message *']
      ];
      wrapper.querySelectorAll('label,.w-form-label').forEach(node => {
        if (node.querySelector('input,select,textarea')) return;
        const key = node.textContent.replace(/\s+/g, '');
        const copy = labels.find(([original]) => original === key);
        if (!copy) return;
        rememberText(node, copy[1], copy[2]);
        if (key === '名字*') node.setAttribute('for', 'Nick-alt-Name');
        if (key === '已具備技術') node.removeAttribute('for');
      });
      const placeholders = [
        ['Nick-alt-Name', '如何稱呼你', 'Your name'],
        ['Email-3', 'name@email.com', 'name@email.com'],
        ['Inquiring-About', '想詢問的課程或主題', 'Course or topic you would like to ask about'],
        ['field', '請留下你的問題與需求，我們會盡快回覆。', 'Tell us your questions and requirements. We will reply as soon as possible.']
      ];
      placeholders.forEach(([id, zh, en]) => {
        const field = wrapper.querySelector('[id="' + id + '"]');
        if (!field) return;
        field.setAttribute('data-course-placeholder-zh', zh);
        field.setAttribute('data-course-placeholder-en', en);
      });
      wrapper.querySelectorAll('option').forEach(option => {
        if (option.getAttribute('value') === '尚未學習 Not started') rememberText(option, '尚未學習', 'Not started');
      });
      [
        ['.w-form-done', '謝謝你，訊息已送出，我們會盡快回覆！', 'Thank you! Your message has been sent. We will reply as soon as possible.', 'polite'],
        ['.w-form-fail', '訊息未能送出，請再試一次。若問題持續，請寄信至 gowild.tw@gmail.com。', 'Your message could not be sent. Please try again, or email gowild.tw@gmail.com if the problem continues.', 'assertive']
      ].forEach(([selector, zh, en, live]) => {
        const panel = wrapper.querySelector(selector);
        if (!panel) return;
        rememberText(panel.firstElementChild || panel, zh, en);
        panel.setAttribute('aria-live', live);
      });
      setLanguage(language);
      const submit = wrapper.querySelector('[type="submit"]');
      if (submit && typeof MutationObserver !== 'undefined') {
        submitObserver = new MutationObserver(translateSubmit);
        submitObserver.observe(submit, { attributes: true, attributeFilter: ['value', 'disabled'], childList: true });
        [form, wrapper.querySelector('.w-form-done'), wrapper.querySelector('.w-form-fail')].filter(Boolean).forEach(node => {
          submitObserver.observe(node, { attributes: true, attributeFilter: ['style', 'hidden'] });
        });
      }
    };
    languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.courseLanguage)));
    setLanguage('zh');
    mountNativeForm();
    window.Webflow = window.Webflow || [];
    window.Webflow.push(mountNativeForm);

    const setActive = id => links.forEach(link => {
      const active = link.dataset.courseLink === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    links.forEach(link => link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      const section = sections.find(node => '#' + node.id === href);
      if (!section) return;
      event.preventDefault();
      setActive(section.dataset.courseSection);
      section.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'auto' : 'smooth' });
      history.replaceState(null, '', href);
    }));
    let pending = false;
    const sync = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        let current = sections[0];
        sections.forEach(section => { if (section.getBoundingClientRect().top <= innerHeight * .38) current = section; });
        if (current) setActive(current.dataset.courseSection);
        pending = false;
      });
    };
    addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    // bfcache restores must retain the existing form node and all user-entered values.
    addEventListener('pageshow', event => { if (event.persisted) { mountNativeForm(); translateSubmit(); sync(); } });
    sync();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
