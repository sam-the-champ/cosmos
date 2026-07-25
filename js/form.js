// /**
//  * form.js — the conversion point. Validates, emails via EmailJS (no backend),
//  * fires Purchase/Lead events, then redirects to thank-you.html.
//  */
(function () {
  "use strict";

  const section = document.querySelector("#purchase-form");
 const form = document.querySelector("#purchase-form-el");
  if (!form) return;

  /* ---------------- EmailJS init (safe no-op if library absent/misconfigured) ---------------- */
  function loadEmailJS(cb) {
    if (window.emailjs) return cb();
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.onload = () => {
      try {
        window.emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
      } catch (e) {}
      cb();
    };
    script.onerror = () => cb();
    document.head.appendChild(script);
  }
  loadEmailJS(() => {});

  /* ---------------- Package picker ----------------
   * Renders one pill per entry in PRODUCT_CONFIG.PACKAGES, keeps the hidden
   * `quantity` / `package` fields in sync, and updates the sticky order
   * summary. window.selectPackage(id) is exposed so the pricing cards
   * higher up the page can pre-select a package before scrolling here.
   */
  const packagePicker = document.getElementById("package-picker");
  const quantityField = document.getElementById("selected-quantity");
  const packageLabelField = document.getElementById("selected-package-label");
  const summaryPrice = document.getElementById("summary-price");
  const summaryPackageLabel = document.getElementById("summary-package-label");

  let selectedPackage = null;

  function findPackage(id) {
    return (PRODUCT_CONFIG.PACKAGES || []).find((p) => p.id === id);
    console.log("findPackage", id, PRODUCT_CONFIG.PACKAGES);
  }
  

  function applyPackage(pkg) {
    if (!pkg) return;
    selectedPackage = pkg;
    quantityField.value = pkg.qty;
    packageLabelField.value = pkg.label;
    if (summaryPrice && window.formatPrice) summaryPrice.textContent = window.formatPrice(pkg.price);
    if (summaryPackageLabel) summaryPackageLabel.textContent = `BAVIN PC1155 · ${pkg.label}`;
    packagePicker.querySelectorAll(".radio-pill").forEach((pill) => {
      const isMatch = pill.dataset.packageId === pkg.id;
      pill.classList.toggle("checked", isMatch);
      const input = pill.querySelector("input");
      if (input) input.checked = isMatch;
    });
  }

  if (packagePicker && Array.isArray(PRODUCT_CONFIG.PACKAGES)) {
    PRODUCT_CONFIG.PACKAGES.forEach((pkg) => {
      const pill = document.createElement("label");
      pill.className = "radio-pill";
      pill.dataset.packageId = pkg.id;
      pill.innerHTML = `<input type="radio" name="packageChoice" value="${pkg.id}" />${pkg.label} — ${window.formatPrice ? window.formatPrice(pkg.price) : pkg.price}`;
      packagePicker.appendChild(pill);
    });

    packagePicker.addEventListener("click", (e) => {
      const pill = e.target.closest(".radio-pill");
      if (!pill) return;
      applyPackage(findPackage(pill.dataset.packageId));
    });

    applyPackage(findPackage(PRODUCT_CONFIG.DEFAULT_PACKAGE_ID) || PRODUCT_CONFIG.PACKAGES[0]);
  }

  window.selectPackage = function (id) {
    const pkg = findPackage(id);
    if (pkg) applyPackage(pkg);
  };

  /* ---------------- Validation ---------------- */
  const rules = {
    fullName: (v) => v.trim().length >= 3 || "Enter your full name.",
    phone: (v) => /^[0-9+\s()-]{7,20}$/.test(v.trim()) || "Enter a valid phone number.",
    whatsapp: (v) => /^[0-9+\s()-]{7,20}$/.test(v.trim()) || "Enter a valid WhatsApp number.",
    email: (v) => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email or leave it blank.",
    address: (v) => v.trim().length >= 6 || "Enter your delivery address.",
    city: (v) => v.trim().length >= 2 || "Enter your city.",
    state: (v) => v.trim().length >= 2 || "Select your state.",
  };

  function validateField(field) {
    const rule = rules[field.name];
    const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
    if (!rule) return true;
    const result = rule(field.value);
    if (result === true) {
      field.classList.remove("error");
      if (errorEl) errorEl.textContent = "";
      return true;
    }
    field.classList.add("error");
    if (errorEl) errorEl.textContent = result;
    return false;
  }

  Object.keys(rules).forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    field && field.addEventListener("blur", () => validateField(field));
    field && field.addEventListener("input", () => { if (field.classList.contains("error")) validateField(field); });
  });

  /* ---------------- Submit ---------------- */
  const submitBtn = form.querySelector('button[type="submit"]');
  const successBanner = form.querySelector(".form-success-banner");
  const errorBanner = form.querySelector(".form-error-banner");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    successBanner?.classList.remove("show");
    errorBanner?.classList.remove("show");

    let valid = true;
    Object.keys(rules).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (field && !validateField(field)) valid = false;
    });
    if (!valid) {
      form.querySelector(".error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    function afterSuccess() {
      window.trackEvent && window.trackEvent("Purchase", {
        content_name: PRODUCT_CONFIG.NAME,
        value: selectedPackage ? selectedPackage.price : 0,
        currency: PRODUCT_CONFIG.CURRENCY,
        num_items: data.quantity,
        package: data.package,
      });
      try {
        sessionStorage.setItem("bavin_order", JSON.stringify({
          name: data.fullName,
          quantity: data.quantity,
          package: data.package,
          whatsapp: data.whatsapp,
        }));
      } catch (e) {}
      window.location.href = "thank-you.html";
    }

    function afterFailure() {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
      if (errorBanner) {
        errorBanner.textContent = "Something went wrong sending your order. Please try again, or message us directly on WhatsApp.";
        errorBanner.classList.add("show");
      }
    }

    if (window.emailjs && EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.SERVICE_ID !== "YOUR_EMAILJS_SERVICE_ID") {
      window.emailjs
        .send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {
          to_email: EMAILJS_CONFIG.NOTIFY_EMAIL,
          full_name: data.fullName,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email || "Not provided",
          address: data.address,
          city: data.city,
          state: data.state,
          quantity: data.quantity,
          package: data.package,
          price: selectedPackage ? window.formatPrice(selectedPackage.price) : "",
          instructions: data.instructions || "None",
          product: PRODUCT_CONFIG.NAME,
        })
        .then(afterSuccess)
        .catch(afterFailure);
    } else {
      // EmailJS not configured yet — don't block the demo/testing flow.
      console.warn("EmailJS is not configured. Add your keys in js/config.js to send real emails.");
      setTimeout(afterSuccess, 900);
    }
  });
})();
