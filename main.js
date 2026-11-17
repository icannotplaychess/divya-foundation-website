/* =========================================================
   Divya Foundation — site interactions
   ========================================================= */

/*
 * FORM DELIVERY
 * This is a static site (GitHub Pages), so there is no server to receive
 * form submissions. Two options:
 *   1. Leave FORM_ENDPOINT empty: submissions open the visitor's email app
 *      with the details pre-filled, addressed to ORG_EMAIL.
 *   2. Paste an endpoint from a free form service (e.g. Formspree, Web3Forms,
 *      Getform) into FORM_ENDPOINT: submissions are POSTed there as JSON and
 *      the team receives them by email without the visitor leaving the page.
 */
const FORM_ENDPOINT = "";
const ORG_EMAIL = "divyafoundation.nsk@gmail.com";

document.documentElement.classList.remove("no-js");

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const body = document.body;

  /* ---------- Light / dark theme ---------- */
  const root = document.documentElement;
  const syncToggle = () => {
    const dark = root.getAttribute("data-theme") === "dark";
    $$("[data-theme-toggle]").forEach((b) => { b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode"); b.setAttribute("aria-pressed", String(dark)); });
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#00050d" : "#26300b");
  };
  $$("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("df-theme", next); } catch (e) {}
    syncToggle();
  }));
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", (e) => {
    let saved = null; try { saved = localStorage.getItem("df-theme"); } catch (err) {}
    if (!saved) { root.setAttribute("data-theme", e.matches ? "dark" : "light"); syncToggle(); }
  });
  syncToggle();

  /* ---------- Header: solid on scroll ---------- */
  const header = $(".site-header");
  const toTop = $(".to-top");
  const mobileDonate = $(".mobile-donate");
  const onScroll = () => {
    const y = window.scrollY;
    if (header && !header.classList.contains("site-header--solid")) header.classList.toggle("is-solid", y > 40);
    toTop?.classList.toggle("is-visible", y > 700);
    mobileDonate?.classList.toggle("is-visible", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile menu (full-screen panel #mobile-nav) ---------- */
  const toggle = $(".menu-toggle");
  const mnav = $("#mobile-nav");
  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mnav?.setAttribute("aria-hidden", String(!open));
    if (mnav) mnav.inert = !open;
    if (open) setTimeout(() => $("a", mnav)?.focus({ preventScroll: true }), 50);
  };
  if (mnav) mnav.inert = true;
  toggle?.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  mnav?.addEventListener("click", (e) => { if (e.target.closest("a, button")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && body.classList.contains("menu-open")) { setMenu(false); toggle?.focus(); } });
  window.addEventListener("resize", () => { if (window.innerWidth > 1080 && body.classList.contains("menu-open")) setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("is-in"));

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const dur = 1600; const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }

  /* ---------- Modal (Support Us / Donate) ---------- */
  const modal = $("#support-modal");
  let lastFocus = null;
  const focusables = (el) => $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', el).filter((n) => n.offsetParent !== null);
  const openModal = () => {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    setTimeout(() => $("input[name='name']", modal)?.focus(), 60);
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    lastFocus?.focus();
  };
  $$("[data-open-donate]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openModal(); }));
  $$("[data-close-modal]").forEach((b) => b.addEventListener("click", closeModal));
  modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (!modal?.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") {
      const f = focusables(modal); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  if (location.hash === "#donate") openModal();

  /* ---------- Forms: validation + delivery ---------- */
  const validators = {
    name: (v) => v.trim().length >= 2 || "Please enter your full name.",
    phone: (v) => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "").replace(/^(\+?91)/, "")) || "Please enter a valid 10-digit mobile number.",
    email: (v) => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email address.",
    "email-required": (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email address.",
    message: (v) => v.trim().length >= 5 || "Please write a short message.",
  };
  const validateField = (input) => {
    const rule = validators[input.dataset.validate];
    if (!rule) return true;
    const res = rule(input.value);
    const field = input.closest(".field");
    const err = field?.querySelector(".field__error");
    if (res === true) { field?.classList.remove("has-error"); input.removeAttribute("aria-invalid"); return true; }
    field?.classList.add("has-error"); input.setAttribute("aria-invalid", "true");
    if (err) err.textContent = res;
    return false;
  };

  $$("form[data-form]").forEach((form) => {
    const inputs = $$("[data-validate]", form);
    inputs.forEach((i) => i.addEventListener("blur", () => validateField(i)));
    inputs.forEach((i) => i.addEventListener("input", () => { if (i.closest(".has-error")) validateField(i); }));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = inputs.map(validateField).every(Boolean);
      if (!ok) { form.querySelector("[aria-invalid='true']")?.focus(); return; }

      const data = Object.fromEntries(new FormData(form).entries());
      const subject = form.dataset.subject || "Website enquiry";
      const btn = form.querySelector("[type='submit']");
      const label = btn.innerHTML;
      btn.disabled = true; btn.textContent = "Sending…";

      let sent = false;
      if (FORM_ENDPOINT) {
        try {
          const r = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ _subject: subject, form: form.dataset.form, ...data }),
          });
          sent = r.ok;
        } catch { sent = false; }
      }
      if (!sent) {
        const lines = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`);
        const href = `mailto:${ORG_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
        window.location.href = href;
      }
      btn.disabled = false; btn.innerHTML = label;
      const success = form.parentElement.querySelector(".form-success");
      if (success) { form.hidden = true; success.classList.add("is-visible"); success.focus?.(); }
      form.reset();
    });
  });
  $$("[data-reset-form]").forEach((b) => b.addEventListener("click", () => {
    const wrap = b.closest(".form-wrap");
    wrap.querySelector("form").hidden = false;
    wrap.querySelector(".form-success").classList.remove("is-visible");
  }));
  // Reset donate form whenever modal closes
  modal?.addEventListener("transitionend", () => {});

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  if (lb) {
    const items = $$("[data-lightbox]");
    const img = $("img", lb); const cap = $(".lightbox__caption", lb);
    let idx = 0; let opener = null;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const it = items[idx];
      img.src = it.dataset.full; img.alt = it.querySelector("img")?.alt || "";
      cap.textContent = `${it.dataset.caption || ""}  ·  ${idx + 1} / ${items.length}`;
    };
    const open = (i) => { opener = document.activeElement; show(i); lb.classList.add("is-open"); body.classList.add("modal-open"); $(".lightbox__close", lb).focus(); };
    const close = () => { lb.classList.remove("is-open"); body.classList.remove("modal-open"); opener?.focus(); };
    items.forEach((it, i) => it.addEventListener("click", () => open(i)));
    $(".lightbox__close", lb).addEventListener("click", close);
    $(".lightbox__prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lightbox__next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let sx = 0;
    lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); });
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
