/* Progressive reading tools. Motion recipes: https://transitions.dev/ */
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('.section-nav');
  const pill = nav?.querySelector('.t-tabs-pill');
  const links = [...(nav?.querySelectorAll('a[href^="#"]') || [])];
  const personal = document.querySelector('details.beyond-research');
  if (personal && window.location.hash === '#misc') personal.open = true;
  const sections = links.map(link => document.querySelector(link.hash));
  if (!pill || sections.some(section => !section)) return;

  root.classList.add('has-reading-tools');
  pill.hidden = false;
  let activeLink;
  let scrollQueued = false;
  let navigationTarget;
  let settleTimer;

  function moveIndicator(link, animate = true) {
    if (!animate) pill.style.transition = 'none';
    pill.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.height = `${link.offsetHeight}px`;
    if (!animate) {
      void pill.offsetWidth;
      pill.style.removeProperty('transition');
    }
  }

  function setCurrent(next, animate = true) {
    if (next !== activeLink) {
      links.forEach(link => link.removeAttribute('aria-current'));
      next.setAttribute('aria-current', 'location');
      activeLink = next;
      moveIndicator(next, animate);
    } else if (!animate) {
      moveIndicator(next, false);
    }
  }

  function releaseAfterScroll() {
    clearTimeout(settleTimer);
    // Inactivity fallback for browsers without the scrollend event.
    settleTimer = setTimeout(() => { navigationTarget = null; }, 120);
  }

  function selectDestination(link) {
    navigationTarget = link;
    setCurrent(link);
    releaseAfterScroll();
  }

  links.forEach(link => link.addEventListener('click', event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    selectDestination(link);
  }));
  window.addEventListener('hashchange', () => {
    const destination = links.find(link => link.hash === window.location.hash);
    if (window.location.hash === '#misc' && personal) {
      personal.open = true;
      selectDestination(links.find(link => link.hash === '#projects'));
    } else if (destination) selectDestination(destination);
    else if (['#schema', '#spa'].includes(window.location.hash)) selectDestination(links.find(link => link.hash === '#publications'));
  });
  window.addEventListener('wheel', () => { navigationTarget = null; }, { passive: true });
  window.addEventListener('touchstart', () => { navigationTarget = null; }, { passive: true });

  function updateNavigation(animate = true) {
    if (navigationTarget) {
      setCurrent(navigationTarget, animate);
      return;
    }
    const readingLine = Math.min(180, window.innerHeight * 0.25);
    let index = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= readingLine) index = i;
    });
    // The last heading cannot always reach the reading line on a tall display.
    if (window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight - 2) {
      index = links.length - 1;
    }
    setCurrent(links[index], animate);
  }

  window.addEventListener('scroll', () => {
    if (navigationTarget) releaseAfterScroll();
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      updateNavigation();
      scrollQueued = false;
    });
  }, { passive: true });
  window.addEventListener('resize', () => {
    navigationTarget = null;
    updateNavigation(false);
  });
  personal?.addEventListener('toggle', () => updateNavigation(false));
  window.addEventListener('pageshow', () => updateNavigation(false));
  document.fonts.ready.then(() => updateNavigation(false));
  updateNavigation(false);

  const dialog = document.querySelector('.figure-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const title = dialog.querySelector('#figure-title');
  const image = dialog.querySelector('.figure-image');
  const summary = dialog.querySelector('#figure-summary');
  const actions = dialog.querySelector('.figure-links');
  const original = dialog.querySelector('.figure-original');
  const closeButton = dialog.querySelector('.figure-close');
  let opener;
  let closeTimer;
  let openingFrame;
  let backdropPointer = false;

  function openFigure(preview) {
    const paper = preview.closest('.pub-row');
    const thumbnail = preview.querySelector('img');
    title.textContent = paper.querySelector('.title').textContent;
    summary.replaceChildren(...[...paper.querySelector('.paper-summary').childNodes].map(node => node.cloneNode(true)));
    const details = paper.querySelector('template.figure-details');
    if (details) summary.append(document.createElement('br'), details.content.cloneNode(true));
    image.src = preview.href;
    image.alt = thumbnail.alt;
    image.width = Number(thumbnail.getAttribute('width'));
    image.height = Number(thumbnail.getAttribute('height'));
    original.href = preview.href;
    actions.replaceChildren(...[...paper.querySelectorAll('.links a')].map(link => {
      const copy = link.cloneNode(true);
      copy.removeAttribute('class');
      return copy;
    }));
    clearTimeout(closeTimer);
    cancelAnimationFrame(openingFrame);
    opener = preview;
    dialog.classList.remove('is-closing', 'is-open');
    root.classList.add('has-open-figure');
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
    // Commit the recipe's starting scale before transitioning to the open state.
    void dialog.offsetWidth;
    openingFrame = requestAnimationFrame(() => dialog.classList.add('is-open'));
  }

  function closeFigure() {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    cancelAnimationFrame(openingFrame);
    dialog.classList.remove('is-open');
    dialog.classList.add('is-closing');
    const duration = reducedMotion.matches ? 0 :
      parseFloat(getComputedStyle(root).getPropertyValue('--modal-close-dur')) || 150;
    closeTimer = setTimeout(() => dialog.close(), duration);
  }

  document.querySelectorAll('.publication-preview').forEach(preview => {
    preview.setAttribute('aria-haspopup', 'dialog');
    preview.addEventListener('click', event => {
      if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openFigure(preview);
    });
  });
  closeButton.addEventListener('click', closeFigure);
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const lastLink = original;
    if (event.shiftKey && document.activeElement === closeButton) {
      event.preventDefault();
      lastLink.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      closeButton.focus();
    }
  });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeFigure();
  });
  // Only a click that starts and ends on the backdrop dismisses the dialog.
  const outside = event => {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropPointer = outside(event); });
  dialog.addEventListener('click', event => {
    if (event.target === dialog && backdropPointer && outside(event)) closeFigure();
    backdropPointer = false;
  });
  dialog.addEventListener('close', () => {
    clearTimeout(closeTimer);
    cancelAnimationFrame(openingFrame);
    dialog.classList.remove('is-open', 'is-closing');
    root.classList.remove('has-open-figure');
    opener?.focus({ preventScroll: true });
  });
})();
