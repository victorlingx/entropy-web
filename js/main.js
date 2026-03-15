/* ============================================================
   ENTROPY — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. STICKY HEADER SCROLL ───────────────────────────── */
  const header = document.querySelector('.header');
  const topbarHeight = document.querySelector('.topbar')?.offsetHeight || 0;
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');
  const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link');
  const fadeUpElements = document.querySelectorAll('.fade-up');

  const handleScroll = () => {
    header?.classList.toggle('header--scrolled', window.scrollY > topbarHeight + 10);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // inicial

  /* ── 2. HAMBURGER MENU ─────────────────────────────────── */
  const setMobileMenuState = (isOpen) => {
    toggle?.classList.toggle('is-active', isOpen);
    mobileMenu?.classList.toggle('is-open', isOpen);
    toggle?.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggle?.addEventListener('click', () => {
    setMobileMenuState(!mobileMenu?.classList.contains('is-open'));
  });

  // Cerrar al hacer clic en un link
  document.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      setMobileMenuState(false);
    });
  });

  /* ── 3. ACTIVE NAV LINK ────────────────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const targetPath = href?.split('#')[0] || '';
    const isActive = targetPath === currentPath || (currentPath === '' && targetPath === 'index.html');
    link.classList.toggle('nav__link--active', isActive);
  });

  /* ── 4. INTERSECTION OBSERVER (fade-up) ────────────────── */
  if (fadeUpElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeUpElements.forEach(element => observer.observe(element));
  }

  /* ── 5. FORMULARIO CONTACTO ────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    const submitBtn = form.querySelector('.form__btn');
    const successMsg = document.querySelector('.form__success');
    const fields = form.querySelectorAll('input, select, textarea');
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');

    const validateEmail = email =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateField = (input) => {
      const val = input.value.trim();
      const errorEl = document.getElementById(`error-${input.name}`);
      const isValid = Boolean(
        (!input.required || val) &&
        (input.type !== 'email' || !val || validateEmail(val))
      );

      input.classList.toggle('is-error', !isValid);
      errorEl?.classList.toggle('is-visible', !isValid);
      return isValid;
    };

    // Validación en blur
    fields.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-error')) validateField(input);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let allValid = true;
      requiredFields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });
      if (!allValid) return;

      // Estado loading
      submitBtn?.classList.add('is-loading');
      if (submitBtn) submitBtn.disabled = true;

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
        submitBtn?.classList.remove('is-loading');
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ── 6. SMOOTH SCROLL ANCHORS ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') {
        return;
      }

      const target = document.querySelector(href);
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
