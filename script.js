document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Copyright Year
  const yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  // 2. Navbar Scroll Style
  const nav = document.getElementById('navbar');
  const onScrollNav = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 36);
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // 3. Hamburger & Mobile Menu
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobile-menu');
  const mobLinks = mob ? mob.querySelectorAll('a') : [];

  const toggleMenu = (forceClose) => {
    if (!ham || !mob) return;
    const isOpen = ham.classList.contains('open');
    const shouldClose = forceClose === true || isOpen;

    ham.classList.toggle('open', !shouldClose);
    mob.classList.toggle('open', !shouldClose);
    ham.setAttribute('aria-expanded', String(!shouldClose));
    document.body.style.overflow = shouldClose ? '' : 'hidden';
  };

  if (ham) ham.addEventListener('click', () => toggleMenu());
  mobLinks.forEach(l => l.addEventListener('click', () => toggleMenu(true)));
  document.addEventListener('click', e => {
    if (ham && mob && !ham.contains(e.target) && !mob.contains(e.target)) {
      toggleMenu(true);
    }
  });

  // 4. Reveal on Scroll
  const revEls = document.querySelectorAll('.reveal');
  const revObs = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  revEls.forEach(el => revObs.observe(el));

  // 5. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        window.scrollTo({
          top: targetEl.getBoundingClientRect().top + window.scrollY - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // 6. Active Nav Link Scroll Highlight
  const secs = document.querySelectorAll('section[id]');
  const nls = document.querySelectorAll('.nav-links a');
  const setActive = () => {
    const pos = window.scrollY + 140;
    secs.forEach(s => {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        nls.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + s.id));
      }
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // 7. Colecciones Carousel Module (3 Cards per View with Arrow & Dot Navigation)
  const track = document.getElementById('coll-track');
  const trackContainer = document.getElementById('coll-track-container');
  const prevBtn = document.getElementById('coll-prev');
  const nextBtn = document.getElementById('coll-next');
  const dotsContainer = document.getElementById('coll-dots');
  const cards = track ? track.querySelectorAll('.coll-card') : [];

  if (track && cards.length > 0) {
    let currentIndex = 0;

    const getItemsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 640) return 1;
      if (width <= 1024) return 2;
      return 3;
    };

    const getMaxIndex = () => {
      const itemsPerPage = getItemsPerPage();
      return Math.max(0, cards.length - itemsPerPage);
    };

    const updateCarousel = () => {
      const itemsPerPage = getItemsPerPage();
      const maxIndex = getMaxIndex();

      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      const translateX = (cardWidth + gap) * currentIndex;

      track.style.transform = `translateX(-${translateX}px)`;

      // Update Prev / Next Arrow States
      if (prevBtn) prevBtn.disabled = (currentIndex === 0);
      if (nextBtn) nextBtn.disabled = (currentIndex >= maxIndex);

      // Render & Update Dots
      const totalPages = maxIndex + 1;
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        if (totalPages > 1) {
          for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Ir al grupo de colecciones ${i + 1}`);
            dot.addEventListener('click', () => {
              currentIndex = i;
              updateCarousel();
            });
            dotsContainer.appendChild(dot);
          }
        }
      }
    };

    // Arrow Click Listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
          currentIndex++;
          updateCarousel();
        }
      });
    }

    // Touch Swipe Navigation for Mobile Devices
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    if (trackContainer) {
      trackContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
      }, { passive: true });

      trackContainer.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        currentX = e.touches[0].clientX;
      }, { passive: true });

      trackContainer.addEventListener('touchend', () => {
        if (!isSwiping) return;
        const diffX = startX - currentX;
        if (Math.abs(diffX) > 40) {
          if (diffX > 0 && currentIndex < getMaxIndex()) {
            currentIndex++;
          } else if (diffX < 0 && currentIndex > 0) {
            currentIndex--;
          }
          updateCarousel();
        }
        isSwiping = false;
      });
    }

    // Initial setup & resize update
    updateCarousel();
    window.addEventListener('resize', () => {
      updateCarousel();
    }, { passive: true });
  }

  // 8. Floating Back-to-Top Button
  const bttBtn = document.getElementById('back-to-top');
  if (bttBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        bttBtn.classList.add('show');
      } else {
        bttBtn.classList.remove('show');
      }
    }, { passive: true });

    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 9. Global Escape Key Handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ham && ham.classList.contains('open')) {
      toggleMenu(true);
    }
  });

  // 10. Resize Cleanup for Mobile Menu
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && ham && ham.classList.contains('open')) {
      toggleMenu(true);
    }
  }, { passive: true });
});