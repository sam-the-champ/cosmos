/**
 * form.js — the conversion point. Validates, emails via EmailJS (no backend),
 * fires Purchase/Lead events, then redirects to thank-you.html.
 */
(function () {
  "use strict";

  const form = document.querySelector("#purchase-form");
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

  /* ---------------- Quantity stepper ---------------- */
  const qtyInput = form.querySelector('input[name="quantity"]');
  form.querySelectorAll(".qty-stepper button").forEach((btn) => {
    btn.addEventListener("click", () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      val += btn.dataset.step === "up" ? 1 : -1;
      qtyInput.value = Math.min(10, Math.max(1, val));
    });
  });

  /* ---------------- Payment preference pills ---------------- */
  form.querySelectorAll(".radio-pill").forEach((pill) => {
    const input = pill.querySelector("input");
    pill.addEventListener("click", () => {
      form.querySelectorAll(".radio-pill").forEach((p) => p.classList.remove("checked"));
      input.checked = true;
      pill.classList.add("checked");
    });
  });

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
        value: PRODUCT_CONFIG.PRICE * (parseInt(data.quantity, 10) || 1),
        currency: PRODUCT_CONFIG.CURRENCY,
        num_items: data.quantity,
      });
      try {
        sessionStorage.setItem("bavin_order", JSON.stringify({
          name: data.fullName,
          quantity: data.quantity,
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
          instructions: data.instructions || "None",
          payment_preference: data.payment || "Not specified",
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
