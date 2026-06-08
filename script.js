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

  if (form) {
    form.addEventListener("submit", function (e) {
      // Basic native validation
      if (!form.checkValidity()) {
        e.preventDefault();
        setStatus("Please fill in all fields so we can help you properly.", "error");
        form.reportValidity();
        return;
      }

      var action = form.getAttribute("action") || "";
      var configured = action && action.indexOf("your-form-id") === -1;

      // If a real endpoint is configured, submit via fetch for a smooth UX.
      if (configured) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var original = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
        setStatus("", "");

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
              setStatus("Something went wrong. Please call us or try again in a moment.", "error");
            }
          })
          .catch(function () {
            setStatus("Network error. Please call us or try again in a moment.", "error");
          })
          .finally(function () {
            if (btn) { btn.disabled = false; btn.textContent = original; }
          });
        return;
      }

      // No endpoint configured yet: fall back to a friendly mailto so the
      // form is never a dead end. (Replace the action URL to enable inbox delivery.)
      e.preventDefault();
      var name = encodeURIComponent((form.name.value || "").trim());
      var phone = encodeURIComponent((form.phone.value || "").trim());
      var email = encodeURIComponent((form.email.value || "").trim());
      var service = encodeURIComponent((form.service.value || "").trim());
      var message = encodeURIComponent((form.message.value || "").trim());
      var body =
        "Name: " + name + "%0D%0A" +
        "Phone: " + phone + "%0D%0A" +
        "Email: " + email + "%0D%0A" +
        "Service: " + service + "%0D%0A%0D%0A" +
        "Message:%0D%0A" + message;
      var subject = encodeURIComponent("Service Request — " + form.service.value);
      window.location.href =
        "mailto:info@northidahotechnologies.com?subject=" + subject + "&body=" + body;
      setStatus("Opening your email app to send the request…", "success");
    });
  }
})();
