(() => {
  'use strict';
  const config = window.GX404_SITE;
  const iconPaths = {
    camera: ['M4 7h4l2-3h4l2 3h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z', 'M15.5 13.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'],
    crown: ['m3 7 5 4 4-7 4 7 5-4-2 11H5L3 7Z', 'M6 21h12'],
    activity: ['M3 12h4l3-8 4 16 3-8h4'],
    transfer: ['M4 7h16m-4-4 4 4-4 4', 'M20 17H4m4-4-4 4 4 4'],
    link: ['M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2', 'M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2'],
  };
  function makeIcon(paths, className) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', className);
    svg.setAttribute('aria-hidden', 'true');
    paths.forEach(d => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      svg.append(path);
    });
    return svg;
  }
  if (config && Array.isArray(config.links)) {
    document.getElementById('site-title').textContent = config.name;
    document.getElementById('footer-name').textContent = config.name;
    document.getElementById('tagline').textContent = config.tagline;
    document.getElementById('intro').textContent = config.intro;
    const fragment = document.createDocumentFragment();
    config.links.forEach(item => {
      let url;
      try { url = new URL(item.url); } catch { return; }
      if (!['http:', 'https:'].includes(url.protocol)) return;
      const anchor = document.createElement('a');
      anchor.className = 'site-link';
      anchor.href = url.href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.dataset.domain = url.hostname;
      anchor.title = `${item.name} · ${url.hostname}（新标签页）`;
      if (/^#[\da-f]{6}$/i.test(item.color)) anchor.style.setProperty('--link-color', item.color);
      const name = document.createElement('span');
      name.textContent = item.name;
      const hint = document.createElement('span');
      hint.className = 'sr-only';
      hint.textContent = '（在新标签页打开）';
      anchor.append(makeIcon(iconPaths[item.icon] || iconPaths.link, 'site-icon'), name, makeIcon(['M7 17 17 7M7 7h10v10'], 'link-arrow'), hint);
      fragment.append(anchor);
    });
    document.getElementById('sites').replaceChildren(fragment);
  }
  document.getElementById('year').textContent = String(new Date().getFullYear());

  const canvas = document.getElementById('fluid-background');
  const button = document.getElementById('motion-toggle');
  const hint = document.getElementById('interaction-hint');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let explicitlyPaused = false;
  let engine;
  let unavailable = false;
  try { explicitlyPaused = localStorage.getItem('gx404-motion-paused') === 'true'; } catch { /* Persistence is optional. */ }
  const paused = () => explicitlyPaused || motionQuery.matches;

  function initialise() {
    if (engine || unavailable || motionQuery.matches) return;
    try {
      engine = window.createGX404Fluid(canvas);
      canvas.dataset.renderer = 'webgl';
    } catch {
      unavailable = true;
      canvas.dataset.renderer = 'unavailable';
      canvas.hidden = true;
    }
  }

  function updateMotion() {
    if (!paused()) initialise();
    engine?.setPaused(paused() || document.hidden);
    document.body.classList.toggle('motion-paused', paused() || document.hidden);
    button.hidden = motionQuery.matches || unavailable;
    hint.hidden = paused() || unavailable;
    button.setAttribute('aria-pressed', String(explicitlyPaused));
    const label = explicitlyPaused ? '开启背景动效' : '暂停背景动效';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.replaceChildren(makeIcon(explicitlyPaused ? ['m8 5 10 7-10 7V5Z'] : ['M8 5v14M16 5v14'], 'motion-icon'));
  }

  button.addEventListener('click', () => {
    explicitlyPaused = !explicitlyPaused;
    try { localStorage.setItem('gx404-motion-paused', String(explicitlyPaused)); } catch { /* The control works without storage. */ }
    updateMotion();
  });
  const activePointers = new Set();
  window.addEventListener('pointerdown', event => {
    if (paused() || unavailable || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (event.target instanceof Element && event.target.closest('a, button, input, textarea, select, [role="button"]')) return;
    activePointers.add(event.pointerId);
    engine?.start(event.pointerId, event.clientX, event.clientY);
    document.body.classList.add('has-interacted');
    if (event.target instanceof Element && event.target.closest('.hero')) {
      try { canvas.setPointerCapture(event.pointerId); } catch { /* Window listeners also cover uncaptured pointers. */ }
    }
  }, { passive: true });
  window.addEventListener('pointermove', event => {
    if (activePointers.has(event.pointerId)) engine?.move(event.pointerId, event.clientX, event.clientY);
  }, { passive: true });
  function endPointer(event) {
    activePointers.delete(event.pointerId);
    engine?.end(event.pointerId);
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }
  window.addEventListener('pointerup', endPointer, { passive: true });
  window.addEventListener('pointercancel', endPointer, { passive: true });
  window.addEventListener('blur', () => {
    activePointers.forEach(id => engine?.end(id));
    activePointers.clear();
  });
  window.addEventListener('resize', () => engine?.resize(), { passive: true });
  document.addEventListener('visibilitychange', () => {
    activePointers.clear();
    updateMotion();
  });
  motionQuery.addEventListener('change', updateMotion);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    engine?.setPaused(true);
    engine = undefined;
    unavailable = true;
    canvas.hidden = true;
    button.hidden = true;
    hint.hidden = true;
    activePointers.clear();
  });
  canvas.addEventListener('webglcontextrestored', () => {
    unavailable = false;
    canvas.hidden = false;
    updateMotion();
  });
  updateMotion();
})();

