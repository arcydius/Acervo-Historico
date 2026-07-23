/**
 * ACERVO HISTÓRICO DEL ESTADO ZULIA - INTERACTIVIDAD Y LÓGICA DE INTERFAZ
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. MANEJO DE NAVEGACIÓN MÓVIL Y MENÚ HAMBURGUESA
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-menu__link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Bloqueo de ScrollSpy durante el desplazamiento por clic para evitar saltos
    let isNavClickScrolling = false;
    let navClickTimeout = null;

    // Activar enlace al hacer clic y cerrar menú
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu) {
          navMenu.classList.remove('active');
        }
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
        }

        // Fijar de inmediato la clase activa únicamente en el botón presionado
        navLinks.forEach(l => l.classList.remove('nav-menu__link--active'));
        link.classList.add('nav-menu__link--active');

        // Bloquear la actualización por scroll durante el desplazamiento automático
        isNavClickScrolling = true;
        if (navClickTimeout) clearTimeout(navClickTimeout);

        navClickTimeout = setTimeout(() => {
          isNavClickScrolling = false;
        }, 1000);
      });
    });

    // Desbloquear al finalizar el scroll
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', () => {
        isNavClickScrolling = false;
      });
    }
  }

  // 2. CAMBIO DE CLASE AL HACER SCROLL (HEADER STICKY) Y SCROLLSPY (SECCIÓN ACTIVA)
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    if (isNavClickScrolling) return; // Evitar saltos mientras se desplaza por un clic en el menú

    const scrollY = window.pageYOffset;
    const headerHeight = header ? header.offsetHeight : 80;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight - 80;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu__link[href*="#${sectionId}"]`);

      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('nav-menu__link--active'));
          navLink.classList.add('nav-menu__link--active');
        }
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Actualizar enlace activo en el menú según el scroll
    updateActiveNavLink();

    // Botón Volver Arriba
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. CAMBIO DE TEMA OSCURO / CLARO
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  
  // Cargar preferencia guardada
  const savedTheme = localStorage.getItem('acervoTheme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeUI(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('acervoTheme', newTheme);
      updateThemeUI(newTheme);
    });
  }

  function updateThemeUI(theme) {
    if (!themeIcon || !themeText) return;
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-sun';
      themeText.textContent = 'Modo Claro';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeText.textContent = 'Modo Oscuro';
    }
  }

  // 4. ACCESIBILIDAD: AUMENTAR / RESTAURAR TAMAÑO DE FUENTE
  const fontScaleBtn = document.getElementById('fontScaleBtn');
  let isFontScaled = false;

  if (fontScaleBtn) {
    fontScaleBtn.addEventListener('click', () => {
      isFontScaled = !isFontScaled;
      document.documentElement.style.setProperty('--font-scale', isFontScaled ? '1.15' : '1');
      fontScaleBtn.style.color = isFontScaled ? 'var(--primary-gold)' : 'var(--text-muted)';
    });
  }

  // 5. FILTRADO DE COLECCIONES POR CATEGORÍA
  const filterTabs = document.querySelectorAll('.filter-tab');
  const collectionCards = document.querySelectorAll('.collection-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');

      collectionCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. BÚSQUEDA EN TIEMPO REAL EN EL CATÁLOGO
  const collectionSearch = document.getElementById('collectionSearch');
  if (collectionSearch) {
    collectionSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();

      collectionCards.forEach(card => {
        const title = card.querySelector('.collection-card__title').textContent.toLowerCase();
        const excerpt = card.querySelector('.collection-card__excerpt').textContent.toLowerCase();

        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 7. MODAL DETALLE DE DOCUMENTO
  const detailModal = document.getElementById('detailModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const detailBtns = document.querySelectorAll('.card-detail-btn');

  const modalImg = document.getElementById('modalImg');
  const modalCat = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const cat = btn.getAttribute('data-cat');
      const desc = btn.getAttribute('data-desc');
      const img = btn.getAttribute('data-img');

      if (modalTitle) modalTitle.textContent = title;
      if (modalCat) modalCat.textContent = cat;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalImg) modalImg.src = img;

      openModal(detailModal);
    });
  });

  if (modalClose) modalClose.addEventListener('click', () => closeModal(detailModal));
  if (modalOverlay) modalOverlay.addEventListener('click', () => closeModal(detailModal));

  // 8. LIGHTBOX DE IMÁGENES
  const lightbox = document.getElementById('lightbox');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const imgSrc = trigger.getAttribute('data-img');
      const caption = trigger.getAttribute('data-title');

      if (lightboxImg) lightboxImg.src = imgSrc;
      if (lightboxCaption) lightboxCaption.textContent = caption;

      openModal(lightbox);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', () => closeModal(lightbox));
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', () => closeModal(lightbox));

  // Funciones Auxiliares de Modal
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Tecla Escape para cerrar modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(detailModal);
      closeModal(lightbox);
    }
  });

  // 9. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
  const animatedElements = document.querySelectorAll('.section-title, .collection-card, .service-card, .timeline-item');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
});
