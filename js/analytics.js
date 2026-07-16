/**
 * analytics.js
 * ---------------------------------------------------------------------------
 * Loads every tracking integration listed in config.js. Nothing here needs
 * editing — flip integrations on/off by filling in (or clearing) IDs in
 * config.js. All page code should fire events through the `trackEvent()`
 * helper below rather than calling fbq/gtag directly, so every destination
 * stays in sync.
 * ---------------------------------------------------------------------------
 */

(function () {
  "use strict";

  /* ---------------- Meta Pixel (multi-pixel) ---------------- */
  function initMetaPixels() {
    if (!Array.isArray(FACEBOOK_PIXELS) || FACEBOOK_PIXELS.length === 0) return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    FACEBOOK_PIXELS.forEach((id) => id && window.fbq && window.fbq("init", id));
    window.fbq && window.fbq("track", "PageView");
  }

  /* ---------------- GA4 ---------------- */
  function initGA4() {
    const id = ANALYTICS_CONFIG.GA4_MEASUREMENT_ID;
    if (!id) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id);
  }

  /* ---------------- GTM ---------------- */
  function initGTM() {
    const id = ANALYTICS_CONFIG.GTM_CONTAINER_ID;
    if (!id) return;
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l !== "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", id);
  }

  /* ---------------- TikTok Pixel ---------------- */
  function initTikTok() {
    const id = ANALYTICS_CONFIG.TIKTOK_PIXEL_ID;
    if (!id) return;
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      const ttq = (w[t] = w[t] || []);
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.load = function (e, n) {
        const i = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = i;
        ttq._t = ttq._t || {}; ttq._t[e] = +new Date();
        ttq._o = ttq._o || {}; ttq._o[e] = n || {};
        const scr = document.createElement("script");
        scr.type = "text/javascript"; scr.async = true; scr.src = i + "?sdkid=" + e + "&lib=" + t;
        const first = document.getElementsByTagName("script")[0];
        first.parentNode.insertBefore(scr, first);
      };
      ttq.load(id);
      ttq.page();
    })(window, document, "ttq");
  }

  /* ---------------- Snapchat Pixel ---------------- */
  function initSnapchat() {
    const id = ANALYTICS_CONFIG.SNAPCHAT_PIXEL_ID;
    if (!id) return;
    (function (e, t, n) {
      if (e.snaptr) return;
      let a = (e.snaptr = function () { a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments); });
      a.queue = []; const s = "script"; const r = t.createElement(s);
      r.async = true; r.src = n;
      const u = t.getElementsByTagName(s)[0];
      u.parentNode.insertBefore(r, u);
    })(window, document, "https://sc-static.net/scevent.min.js");
    window.snaptr("init", id);
    window.snaptr("track", "PAGE_VIEW");
  }

  /* ---------------- Microsoft Clarity ---------------- */
  function initClarity() {
    const id = ANALYTICS_CONFIG.MICROSOFT_CLARITY_ID;
    if (!id) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", id);
  }

  /* ---------------- Hotjar ---------------- */
  function initHotjar() {
    const id = ANALYTICS_CONFIG.HOTJAR_ID;
    if (!id) return;
    (function (h, o, t, j) {
      h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid: id, hjsv: 6 };
      const head = o.getElementsByTagName("head")[0];
      const script = o.createElement("script");
      script.async = 1;
      script.src = t + h._hjSettings.hjid + j;
      head.appendChild(script);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
  }

  /* ---------------- Unified event dispatcher ---------------- */
  window.trackEvent = function (eventName, payload) {
    payload = payload || {};
    try { window.fbq && window.fbq("track", eventName, payload); } catch (e) {}
    try { window.gtag && window.gtag("event", eventName, payload); } catch (e) {}
    try { window.ttq && window.ttq.track(eventName, payload); } catch (e) {}
    try { window.snaptr && window.snaptr("track", eventName.toUpperCase(), payload); } catch (e) {}
    try {
      window.dataLayer && window.dataLayer.push({ event: eventName, ...payload });
    } catch (e) {}
  };

  /* ---------------- Scroll depth + time on page ---------------- */
  function trackEngagement() {
    const milestones = [25, 50, 75, 90];
    const fired = new Set();
    window.addEventListener("scroll", () => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      milestones.forEach((m) => {
        if (scrolled >= m && !fired.has(m)) {
          fired.add(m);
          window.trackEvent("ScrollDepth", { percent: m });
        }
      });
    }, { passive: true });

    const start = Date.now();
    [30, 60, 120].forEach((sec) => {
      setTimeout(() => window.trackEvent("TimeOnPage", { seconds: sec }), sec * 1000);
    });
    window.addEventListener("beforeunload", () => {
      window.trackEvent("TimeOnPage", { seconds: Math.round((Date.now() - start) / 1000), final: true });
    });
  }

  function initAll() {
    initMetaPixels();
    initGA4();
    initGTM();
    initTikTok();
    initSnapchat();
    initClarity();
    initHotjar();
    trackEngagement();
    window.trackEvent("ViewContent", {
      content_name: PRODUCT_CONFIG.NAME,
      content_type: "product",
      value: PRODUCT_CONFIG.PRICE,
      currency: PRODUCT_CONFIG.CURRENCY,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
