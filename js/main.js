/* ============================================================
   ENTROPY - main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* 1. Sticky header scroll */
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
  handleScroll();

  /* 2. Hamburger menu */
  const setMobileMenuState = (isOpen) => {
    toggle?.classList.toggle('is-active', isOpen);
    mobileMenu?.classList.toggle('is-open', isOpen);
    toggle?.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggle?.addEventListener('click', () => {
    setMobileMenuState(!mobileMenu?.classList.contains('is-open'));
  });

  document.querySelectorAll('.nav__mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      setMobileMenuState(false);
    });
  });

  /* 3. Active nav link */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const targetPath = href?.split('#')[0] || '';
    const isActive =
      targetPath === currentPath || (currentPath === '' && targetPath === 'index.html');
    link.classList.toggle('nav__link--active', isActive);
  });

  /* 4. Fade-up observer */
  if (fadeUpElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    fadeUpElements.forEach((element) => observer.observe(element));
  }

  /* 5. Contact form */
  document.querySelectorAll('.project-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const targetId = thumb.dataset.target;
      const src = thumb.dataset.src;
      const mainImage = targetId ? document.getElementById(targetId) : null;

      if (!mainImage || !src) {
        return;
      }

      mainImage.src = src;
      thumb
        .closest('.project-images__thumbs')
        ?.querySelectorAll('.project-thumb')
        .forEach((item) => item.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });

  const form = document.getElementById('contact-form');
  if (form) {
    const submitBtn = form.querySelector('.form__btn');
    const successMsg = document.querySelector('.form__success');
    const fields = form.querySelectorAll('input, select, textarea');
    const requiredFields = form.querySelectorAll(
      'input[required], select[required], textarea[required]'
    );

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

    fields.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-error')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let allValid = true;
      requiredFields.forEach((field) => {
        if (!validateField(field)) {
          allValid = false;
        }
      });
      if (!allValid) {
        return;
      }

      if (!form.action || form.action.includes('YOUR_FORM_ID')) {
        alert(
          'El formulario web aun no esta configurado. Por favor escribenos por WhatsApp, correo o telefono.'
        );
        return;
      }

      submitBtn?.classList.add('is-loading');
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Submit failed');
        }

        form.style.display = 'none';
        if (successMsg) {
          successMsg.classList.add('is-visible');
        }
      } catch (err) {
        alert(
          'No se pudo enviar el mensaje desde el formulario. Por favor escribenos por WhatsApp, correo o telefono.'
        );
      } finally {
        submitBtn?.classList.remove('is-loading');
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    });
  }

  /* 6. Smooth scroll anchors */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
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
          behavior: 'smooth',
        });
      }
    });
  });
});
