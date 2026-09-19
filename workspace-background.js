(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = matchMedia('(max-width: 600px)');
  let frame = 0;

  function updateAtmosphere() {
    const y = window.scrollY;
    document.documentElement.style.setProperty('--workspace-base-y', Math.max(y * -.012, -36) + 'px');
    document.documentElement.style.setProperty('--workspace-grid-y', Math.min(y * .018, 42) + 'px');
    document.documentElement.style.setProperty('--workspace-cyan-y', Math.min(y * .028, 90) + 'px');
    document.documentElement.style.setProperty('--workspace-warm-y', Math.min(y * -.014, 0) + 'px');
    frame = 0;
  }

  if (!reducedMotion.matches && !smallScreen.matches) {
    addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(updateAtmosphere);
    }, { passive: true });
    updateAtmosphere();
  }

  const lightingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('workspace-lit', entry.isIntersecting));
  }, { rootMargin: '-15% 0px -20%', threshold: .08 });

  document.querySelectorAll('main section, body > section').forEach(section => {
    if (section.id !== 'hero') lightingObserver.observe(section);
  });
})();
