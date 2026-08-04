(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');

  const closeMenu = () => {
    body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  toggle?.addEventListener('click', () => {
    const open = !body.classList.contains('menu-open');
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  syncHeader();
  addEventListener('scroll', syncHeader, { passive: true });

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const reveal = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    reveal.forEach(el => observer.observe(el));
  } else reveal.forEach(el => el.classList.add('is-visible'));

  // Homepage: the five pillar buttons become visual doors that change the hero scene.
  const hero = document.querySelector('.gateway-hero');
  const scene = document.getElementById('gateway-scene');
  const sceneTitle = document.getElementById('scene-title');
  const sceneTagline = document.getElementById('scene-tagline');
  const portals = document.querySelectorAll('[data-scene]');
  let swapTimer;
  const swapScene = (src, title, tagline) => {
    if (!scene || scene.getAttribute('src') === src) return;
    hero?.classList.add('is-changing');
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => {
      scene.src = src;
      sceneTitle.textContent = title;
      sceneTagline.textContent = tagline;
      scene.onload = () => hero?.classList.remove('is-changing');
    }, 170);
  };
  portals.forEach(portal => {
    const activate = () => swapScene(portal.dataset.scene, portal.dataset.title, portal.dataset.tagline);
    portal.addEventListener('pointerenter', activate);
    portal.addEventListener('focus', activate);
  });
  document.querySelector('.hero-copy')?.addEventListener('pointerenter', () => {
    if(scene) swapScene(scene.dataset.default, 'Designed By Lu', 'Celebrating the life God intended.');
  });

  // Contact query-string preselection. Accept either slug or earlier display labels.
  const interest = document.getElementById('interest');
  if (interest) {
    const raw = new URLSearchParams(location.search).get('interest');
    if (raw) {
      const normalized = raw.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const map = {
        'celebrate-always':'celebrate-always','if-the-ring-could-talk':'if-the-ring-could-talk',
        'reimagined-and-restored':'reimagined-restored','reimagined-restored':'reimagined-restored',
        'let-s-face-it':'lets-face-it','lets-face-it':'lets-face-it','off-we-go':'off-we-go'
      };
      interest.value = map[normalized] || raw;
      if (!interest.value) interest.value = 'general';
    }
  }
})();