/* ============================================================
   North Idaho Technologies — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Header shadow on scroll ---- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
  }
  function toggleNav() {
    if (!toggle || !mobileNav) return;
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    mobileNav.classList.toggle("open", !open);
    mobileNav.setAttribute("aria-hidden", String(open));
  }
  if (toggle) toggle.addEventListener("click", toggleNav);
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      // gentle stagger for grouped items
      el.style.transitionDelay = Math.min(i % 6, 4) * 60 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Current year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Contact form ---- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  function setStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form-status" + (type ? " " + type : "");
  }

  /* ---- Validators ---- */
  function isValidEmail(v) {
    // Standard, practical email check: something@something.tld
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
  }
  function isValidPhone(v) {
    // Accept US numbers: 10 digits, or 11 starting with 1.
    // Ignores spaces, dashes, dots, parentheses, leading +.
    var d = String(v).replace(/\D/g, "");
    return d.length === 10 || (d.length === 11 && d.charAt(0) === "1");
  }

  function showFieldError(input, errorEl, msg) {
    if (input) input.classList.add("invalid");
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.add("show"); }
  }
  function clearFieldError(input, errorEl) {
    if (input) input.classList.remove("invalid");
    if (errorEl) { errorEl.textContent = ""; errorEl.classList.remove("show"); }
  }

  if (form) {
    var emailInput = form.querySelector("#email");
    var phoneInput = form.querySelector("#phone");
    var emailErr = form.querySelector("#emailError");
    var phoneErr = form.querySelector("#phoneError");

    // Clear a field's error as soon as the visitor starts fixing it.
    [[emailInput, emailErr], [phoneInput, phoneErr]].forEach(function (pair) {
      if (!pair[0]) return;
      pair[0].addEventListener("input", function () { clearFieldError(pair[0], pair[1]); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus("", "");
      clearFieldError(emailInput, emailErr);
      clearFieldError(phoneInput, phoneErr);

      var firstInvalid = null;

      // Required text fields (name, service, message)
      ["name", "service", "message"].forEach(function (n) {
        var el = form.elements[n];
        if (!el) return;
        if (!String(el.value).trim()) {
          el.classList.add("invalid");
          if (!firstInvalid) firstInvalid = el;
        } else {
          el.classList.remove("invalid");
        }
      });

      // Phone format
      var phoneVal = phoneInput ? phoneInput.value.trim() : "";
      if (!phoneVal) {
        showFieldError(phoneInput, phoneErr, "Please enter your phone number.");
        if (!firstInvalid) firstInvalid = phoneInput;
      } else if (!isValidPhone(phoneVal)) {
        showFieldError(phoneInput, phoneErr, "Enter a valid 10-digit phone number, e.g. (208) 555-1234.");
        if (!firstInvalid) firstInvalid = phoneInput;
      }

      // Email format
      var emailVal = emailInput ? emailInput.value.trim() : "";
      if (!emailVal) {
        showFieldError(emailInput, emailErr, "Please enter your email address.");
        if (!firstInvalid) firstInvalid = emailInput;
      } else if (!isValidEmail(emailVal)) {
        showFieldError(emailInput, emailErr, "Enter a valid email address, e.g. you@example.com.");
        if (!firstInvalid) firstInvalid = emailInput;
      }

      if (firstInvalid) {
        setStatus("Please correct the highlighted fields.", "error");
        firstInvalid.focus();
        return;
      }

      // All valid — send to inbox via FormSubmit (AJAX).
      var action = form.getAttribute("action") || "";
      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setStatus("Thank you — your request has been sent. We'll be in touch shortly.", "success");
          } else {
            setStatus("Something went wrong. Please email northidahotechnologies@proton.me or try again in a moment.", "error");
          }
        })
        .catch(function () {
          setStatus("Network error. Please email northidahotechnologies@proton.me or try again in a moment.", "error");
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = original; }
        });
    });
  }
})();
