/* ============================================================
   ENTROPY - main.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* 1. Sticky header scroll */
  const header = document.querySelector(".header");
  const topbarHeight = document.querySelector(".topbar")?.offsetHeight || 0;
  const toggle = document.querySelector(".nav__toggle");
  const mobileMenu = document.querySelector(".nav__mobile");
  const navLinks = document.querySelectorAll(".nav__link, .nav__mobile-link");

  const handleScroll = () => {
    header?.classList.toggle(
      "header--scrolled",
      window.scrollY > topbarHeight + 10,
    );
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* 2. Hamburger menu */
  const setMobileMenuState = (isOpen) => {
    toggle?.classList.toggle("is-active", isOpen);
    mobileMenu?.classList.toggle("is-open", isOpen);
    toggle?.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  toggle?.addEventListener("click", () => {
    setMobileMenuState(!mobileMenu?.classList.contains("is-open"));
  });

  document.querySelectorAll(".nav__mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      setMobileMenuState(false);
    });
  });

  /* 3. Active nav link */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const targetPath = href?.split("#")[0] || "";
    const isActive =
      targetPath === currentPath ||
      (currentPath === "" && targetPath === "index.html");
    link.classList.toggle("nav__link--active", isActive);
  });

  /* 4. Contact form */
  const form = document.getElementById("contact-request-form");
  if (form) {
    const submitBtn = form.querySelector(".contact-form__btn");
    const successMsg = document.querySelector(".contact-form__success");
    const toastStack = document.querySelector(".contact-toast-stack");
    const toast = toastStack?.querySelector(".contact-toast");
    const toastTitle = toast?.querySelector(".contact-toast__title");
    const toastText = toast?.querySelector(".contact-toast__text");
    const fields = form.querySelectorAll("input, select, textarea");
    const requiredFields = form.querySelectorAll(
      "input[required], select[required], textarea[required]",
    );

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    let hideToastTimeoutId = null;
    let clearToastTimeoutId = null;

    const showToast = (title, message) => {
      if (!toast || !toastTitle || !toastText) {
        return;
      }

      if (hideToastTimeoutId) {
        window.clearTimeout(hideToastTimeoutId);
      }
      if (clearToastTimeoutId) {
        window.clearTimeout(clearToastTimeoutId);
      }

      toastTitle.textContent = title;
      toastText.textContent = message;
      toast.hidden = false;
      toast.classList.remove("contact-toast--hiding");

      requestAnimationFrame(() => {
        toast.classList.add("contact-toast--visible");
      });

      hideToastTimeoutId = window.setTimeout(() => {
        toast.classList.remove("contact-toast--visible");
        toast.classList.add("contact-toast--hiding");

        clearToastTimeoutId = window.setTimeout(() => {
          toast.hidden = true;
          toast.classList.remove("contact-toast--hiding");
        }, 220);
      }, 3200);
    };

    const getFieldLabel = (input) => {
      const label = form.querySelector(`label[for="${input.id}"]`);
      const labelText = label?.textContent?.replace("*", "").trim();
      return labelText || "este campo";
    };

    const validateField = (input) => {
      const val = input.value.trim();
      const isValid = Boolean(
        (!input.required || val) &&
        (input.type !== "email" || !val || validateEmail(val)),
      );

      input.classList.toggle("is-error", !isValid);
      input.setAttribute("aria-invalid", String(!isValid));
      return isValid;
    };

    fields.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("is-error")) {
          validateField(input);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let allValid = true;
      requiredFields.forEach((field) => {
        if (!validateField(field)) {
          allValid = false;
        }
      });
      if (!allValid) {
        const firstInvalidField = Array.from(requiredFields).find(
          (field) => field.classList.contains("is-error"),
        );
        const fieldName = firstInvalidField
          ? getFieldLabel(firstInvalidField)
          : "los campos obligatorios";
        showToast(
          "Revisa el formulario",
          `Completa o corrige ${fieldName.toLowerCase()} para continuar.`,
        );
        firstInvalidField?.focus();
        return;
      }

      if (!form.action || form.action.includes("YOUR_FORM_ID")) {
        showToast(
          "Formulario no disponible",
          "Por ahora escribenos por WhatsApp, correo o telefono para atender tu solicitud.",
        );
        return;
      }

      submitBtn?.classList.add("is-loading");
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Submit failed");
        }

        form.style.display = "none";
        if (successMsg) {
          successMsg.classList.add("is-visible");
        }
      } catch (err) {
        showToast(
          "No se pudo enviar",
          "Intenta nuevamente o escribenos por WhatsApp, correo o telefono.",
        );
      } finally {
        submitBtn?.classList.remove("is-loading");
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    });
  }

  /* 5. Smooth scroll anchors */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = (header?.offsetHeight || 0) + 16;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: "smooth",
        });
      }
    });
  });
});
