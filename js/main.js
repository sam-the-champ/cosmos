/**
 * main.js — global UI behavior shared across the page.
 */
(function () {
  "use strict";

  /* ---------------- Loading screen ---------------- */
  window.addEventListener("load", () => {
    const loader = document.querySelector(".loading-screen");
    if (loader) {
      setTimeout(() => loader.classList.add("hide"), 350);
    }
  });

  /* ---------------- Nav scroll state + progress bar ---------------- */
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".scroll-progress");
  const backToTop = document.querySelector(".back-to-top");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("is-scrolled", y > 12);
    if (backToTop) backToTop.classList.toggle("show", y > 700);
    if (progress) {
      const max = document.body.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? `${(y / max) * 100}%` : "0%";
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop && backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  navToggle && navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("mobile-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", () => navLinks && navLinks.classList.remove("mobile-open"));
  });

  /* ---------------- Smooth-scroll for every in-page anchor ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------------- Buy Now → scroll to purchase form + Lead event ---------------- */
  document.querySelectorAll("[data-buy-now]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.trackEvent && window.trackEvent("InitiateCheckout", { content_name: PRODUCT_CONFIG.NAME });
      const form = document.querySelector("#purchase-form");
      if (form) form.querySelector('input[name="fullName"]')?.focus({ preventScroll: true });
    });
  });

   /* ---------------- Standalone video showcase play button ---------------- */
  const videoShowcase = document.getElementById("product-video");
  if (videoShowcase) {
    const video = videoShowcase.querySelector("video");
    const playBtn = videoShowcase.querySelector(".vs-play");
    playBtn && video && playBtn.addEventListener("click", () => {
      video.setAttribute("controls", "true");
      video.play().catch(() => {});
      videoShowcase.classList.add("is-playing");
      window.trackEvent && window.trackEvent("ViewContent", { content_name: PRODUCT_CONFIG.NAME, content_type: "video" });
    });
    video && video.addEventListener("pause", () => videoShowcase.classList.remove("is-playing"));
    video && video.addEventListener("ended", () => videoShowcase.classList.remove("is-playing"));
  }

  /* ---------------- Button ripple ---------------- */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.setProperty("--i", i % 6);
      io.observe(el);
    });

    document.querySelectorAll(".divider-charge").forEach((el) => io.observe(el));
    io && document.querySelectorAll(".divider-charge").forEach((el) => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view"));
      }, { threshold: 0.4 });
      obs.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------- Count-up statistics ---------------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.countTo);
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll("[data-count-to]");
  if ("IntersectionObserver" in window && counters.length) {
    const ioCount = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          ioCount.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => ioCount.observe(el));
  }

  /* ---------------- Hero charge bar fill ---------------- */
  const chargeFill = document.querySelector(".charge-bar-fill");
  const chargeValue = document.querySelector("[data-charge-value]");
  if (chargeFill) {
    requestAnimationFrame(() => {
      setTimeout(() => { chargeFill.style.width = "100%"; }, 400);
    });
  }
  if (chargeValue) countUp(chargeValue);

  /* ---------------- Mouse glow ---------------- */
  const glow = document.querySelector(".mouse-glow");
  if (glow && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  } else if (glow) {
    glow.style.display = "none";
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll(".faq-question").forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : null;
    });
  });

  /* ---------------- Theme toggle (persists for the session only) ---------------- */
  const themeToggle = document.querySelector(".theme-toggle");
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  }
  let currentTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(currentTheme);
  themeToggle && themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
  });

  /* ---------------- Pricing formatter (shared) ---------------- */
  function formatPrice(n) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: PRODUCT_CONFIG.CURRENCY,
      maximumFractionDigits: 0,
    }).format(n);
  }
  window.formatPrice = formatPrice;

  /* ---------------- Hero starting price ---------------- */
  const heroPriceEl = document.getElementById("hero-price");
  if (heroPriceEl && Array.isArray(PRODUCT_CONFIG.PACKAGES) && PRODUCT_CONFIG.PACKAGES.length) {
    const lowest = PRODUCT_CONFIG.PACKAGES.reduce((a, b) => (a.price < b.price ? a : b));
    heroPriceEl.textContent = `From ${formatPrice(lowest.price)}`;
  }

  /* ---------------- Packages / pricing grid ---------------- */
  const packagesGrid = document.getElementById("packages-grid");
  if (packagesGrid && Array.isArray(PRODUCT_CONFIG.PACKAGES)) {
    PRODUCT_CONFIG.PACKAGES.forEach((pkg, i) => {
      const isFeatured = pkg.id === PRODUCT_CONFIG.DEFAULT_PACKAGE_ID;
      const card = document.createElement("div");
      card.className = "card package-card reveal" + (isFeatured ? " featured" : "");
      card.style.setProperty("--i", i);
      card.innerHTML = `
        ${pkg.tag ? `<span class="package-tag">${pkg.tag}</span>` : ""}
        <h3>${pkg.label}</h3>
        <div>
          <div class="package-price">${formatPrice(pkg.price)}</div>
          <div class="package-unit">${formatPrice(Math.round(pkg.price / pkg.qty))} per unit</div>
        </div>
        <ul>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>${pkg.qty} × BAVIN PC1155, 30000mAh</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>Built-in Type-C & Lightning cables</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>Fast nationwide shipping</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>12-month warranty</li>
        </ul>
        <button type="button" class="btn ${isFeatured ? "btn-primary" : "btn-secondary"} btn-block" data-package-buy="${pkg.id}">Buy Now</button>
      `;
      packagesGrid.appendChild(card);
    });

    packagesGrid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-package-buy]");
      if (!btn) return;
      const id = btn.dataset.packageBuy;
      window.trackEvent && window.trackEvent("InitiateCheckout", { content_name: PRODUCT_CONFIG.NAME, package: id });
      if (typeof window.selectPackage === "function") window.selectPackage(id);
      document.querySelector("#purchase-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------------- WhatsApp links (built from config) ---------------- */
  document.querySelectorAll("[data-whatsapp-link]").forEach((a) => {
    const msg = encodeURIComponent(WHATSAPP_CONFIG.DEFAULT_MESSAGE);
    a.href = `https://wa.me/${WHATSAPP_CONFIG.NUMBER}?text=${msg}`;
    a.addEventListener("click", () => window.trackEvent && window.trackEvent("Contact", { method: "whatsapp" }));
  });

  /* ---------------- Media placeholder fallback ----------------
   * Any <img data-ph="Label"> or <video data-ph="Label"> whose real asset
   * fails to load (because you haven't dropped the file in yet) renders a
   * clearly-labeled placeholder instead of a broken-image icon, so the
   * layout still looks intentional. Once you add the real file at the
   * exact `src`/`data-src` path, it replaces the placeholder automatically.
   */
  function showPlaceholder(el) {
    const label = el.dataset.ph || "Media placeholder";
    const wrap = document.createElement("div");
    wrap.className = "media-placeholder";
    wrap.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5-11 11"/></svg>
      <span class="ph-label">${label}</span>`;
    el.replaceWith(wrap);
  }
  document.querySelectorAll("img[data-ph], video[data-ph]").forEach((el) => {
    if (el.tagName === "IMG") {
      el.addEventListener("error", () => showPlaceholder(el), { once: true });
      if (el.complete && el.naturalWidth === 0 && el.getAttribute("src")) showPlaceholder(el);
    } else {
      el.addEventListener("error", () => showPlaceholder(el), { once: true });
    }
  });
})();
