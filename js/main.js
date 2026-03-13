/* ============================================================
   ENTROPY — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. STICKY HEADER SCROLL ───────────────────────────── */
  const header = document.querySelector('.header');
  const topbarHeight = document.querySelector('.topbar')?.offsetHeight || 0;

  const handleScroll = () => {
    if (window.scrollY > topbarHeight + 10) {
      header?.classList.add('header--scrolled');
    } else {
      header?.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // inicial

  /* ── 2. HAMBURGER MENU ─────────────────────────────────── */
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('is-active');
    mobileMenu?.classList.toggle('is-open');
    document.body.style.overflow = mobileMenu?.classList.contains('is-open') ? 'hidden' : '';
  });

  // Cerrar al hacer clic en un link
  document.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('is-active');
      mobileMenu?.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  /* ── 3. ACTIVE NAV LINK ────────────────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  /* ── 4. INTERSECTION OBSERVER (fade-up) ────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* ── 5. FORMULARIO CONTACTO ────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    const submitBtn = form.querySelector('.form__btn');
    const successMsg = document.querySelector('.form__success');

    const validateEmail = email =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateField = (input) => {
      const val = input.value.trim();
      const errorEl = document.getElementById(`error-${input.name}`);
      let isValid = true;

      if (input.required && !val) {
        isValid = false;
      } else if (input.type === 'email' && val && !validateEmail(val)) {
        isValid = false;
      }

      if (!isValid) {
        input.classList.add('is-error');
        if (errorEl) errorEl.classList.add('is-visible');
      } else {
        input.classList.remove('is-error');
        if (errorEl) errorEl.classList.remove('is-visible');
      }
      return isValid;
    };

    // Validación en blur
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-error')) validateField(input);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
      let allValid = true;
      fields.forEach(f => { if (!validateField(f)) allValid = false; });
      if (!allValid) return;

      // Estado loading
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.style.display = 'none';
          if (successMsg) successMsg.classList.add('is-visible');
        } else {
          throw new Error('Error en envío');
        }
      } catch (err) {
        // Fallback: simular éxito para demo
        setTimeout(() => {
          form.style.display = 'none';
          if (successMsg) successMsg.classList.add('is-visible');
        }, 1200);
      } finally {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    });
  }

  /* ── 6. SMOOTH SCROLL ANCHORS ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (header?.offsetHeight || 0) + 16;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

});
