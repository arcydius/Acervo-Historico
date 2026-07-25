// Year
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Navbar scroll
  const nav = document.getElementById('navbar');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 36);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Hamburger
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobile-menu');
  const mobLinks = mob.querySelectorAll('a');
  const toggleMenu = (force) => {
    const open = ham.classList.contains('open');
    const shouldClose = force === true || open;
    ham.classList.toggle('open', !shouldClose);
    mob.classList.toggle('open', !shouldClose);
    ham.setAttribute('aria-expanded', String(!shouldClose));
    document.body.style.overflow = shouldClose ? '' : 'hidden';
  };
  ham.addEventListener('click', () => toggleMenu());
  mobLinks.forEach(l => l.addEventListener('click', () => toggleMenu(true)));
  document.addEventListener('click', e => {
    if (!ham.contains(e.target) && !mob.contains(e.target)) toggleMenu(true);
  });

  // Reveal on scroll (siempre se ejecutan al entrar a la pantalla)
  const revEls = document.querySelectorAll('.reveal');
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
      } else {
        e.target.classList.remove('in');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  revEls.forEach(el => revObs.observe(el));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth'}); }
    });
  });

  // Active nav link
  const secs = document.querySelectorAll('section[id]');
  const nls = document.querySelectorAll('.nav-links a');
  const setActive = () => {
    const pos = window.scrollY + 120;
    secs.forEach(s => {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        nls.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+s.id));
      }
    });
  };
  window.addEventListener('scroll', setActive, {passive:true});
  setActive();