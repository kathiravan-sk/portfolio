(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.nav-links');
  function closeNavigation() {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }
  toggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNavigation(); });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.cert-card,.achievement-banner,.hire-highlight').forEach(element => {
    element.classList.add('reveal');
    if (motion.matches) element.classList.add('visible');
    else revealObserver.observe(element);
  });
  document.querySelectorAll('.cert-card').forEach(card => {
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.setAttribute('aria-label', 'View ' + card.dataset.certTitle);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
  });

  document.querySelectorAll('.skill-card,.profile-card,.project-card,.timeline-card,.cert-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (motion.matches || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      card.classList.add('tilt-surface');
      card.style.setProperty('--tilt-x', ((.5 - (event.clientY - rect.top) / rect.height) * 5) + 'deg');
      card.style.setProperty('--tilt-y', (((event.clientX - rect.left) / rect.width - .5) * 5) + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });

  let pointerFrame = 0;
  document.addEventListener('pointermove', event => {
    if (motion.matches || !finePointer.matches) return;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      document.body.classList.add('pointer-active');
      document.body.style.setProperty('--mouse-x', event.clientX + 'px');
      document.body.style.setProperty('--mouse-y', event.clientY + 'px');
    });
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => document.body.classList.remove('pointer-active'));
  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (motion.matches) return;
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      document.body.style.setProperty('--landscape-y', Math.min(scrollY * .015, 30) + 'px');
      scrollFrame = 0;
    });
  }, { passive: true });

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));
})();
