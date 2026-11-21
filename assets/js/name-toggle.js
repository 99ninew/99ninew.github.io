(() => {
  const name = document.getElementById('profile-name');
  const toggle = document.querySelector('.name-toggle');
  if (!name || !toggle) return;

  const names = { en: name.dataset.nameEn, zh: name.dataset.nameZh };
  if (!names.en || !names.zh) return;
  const buttons = [...toggle.querySelectorAll('.name-language')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let language = 'en';
  let cleanupTimer;

  function textSpan(lang, motionClass = '') {
    const span = document.createElement('span');
    span.className = `name-text ${motionClass}`.trim();
    span.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    span.textContent = names[lang];
    return span;
  }

  function finishSwap() {
    clearTimeout(cleanupTimer);
    name.classList.remove('is-swapping');
    name.replaceChildren(textSpan(language));
    name.removeAttribute('aria-busy');
  }

  // Transitions.dev Text swap soft, with a fixed centered heading width.
  // Per-span language keeps both fonts correct while the names overlap.
  function selectLanguage(next) {
    if (next === language || !names[next]) return;
    const previous = language;
    language = next;
    clearTimeout(cleanupTimer);
    name.lang = next === 'zh' ? 'zh-Hans' : 'en';
    toggle.dataset.language = next;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === next)));

    if (reducedMotion.matches) {
      finishSwap();
      return;
    }

    const outgoing = textSpan(previous, 't-text-soft-old');
    outgoing.setAttribute('aria-hidden', 'true');
    const incoming = textSpan(next, 't-text-soft-new');
    name.setAttribute('aria-busy', 'true');
    name.classList.remove('is-swapping');
    name.replaceChildren(outgoing, incoming);
    void name.offsetWidth;
    name.classList.add('is-swapping');
    const duration = parseFloat(getComputedStyle(name).getPropertyValue('--text-soft-dur')) || 200;
    cleanupTimer = setTimeout(finishSwap, duration + 40);
  }

  buttons.forEach(button => button.addEventListener('click', () => selectLanguage(button.dataset.language)));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) finishSwap();
  });
  // Load the small local Chinese subset before the first interaction.
  document.fonts.load('500 28px "Jiani Name Serif"', names.zh).catch(() => {});
  toggle.hidden = false;
})();
