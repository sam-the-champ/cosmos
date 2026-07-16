/**
 * gallery.js — thumbnail-driven gallery with lightbox + swipe support.
 */
(function () {
  "use strict";

  const stage = document.querySelector(".gallery-stage");
  if (!stage) return;

  const slides = Array.from(stage.querySelectorAll(".gallery-slide"));
  const thumbs = Array.from(document.querySelectorAll(".gallery-thumb"));
  const prevBtn = document.querySelector(".gallery-nav-btn.prev");
  const nextBtn = document.querySelector(".gallery-nav-btn.next");
  const zoomBtn = document.querySelector(".gallery-zoom-btn");
  const lightbox = document.querySelector(".lightbox");
  const lightboxContent = lightbox?.querySelector(".lightbox-content");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");

  let activeIndex = 0;

  function pauseAllVideos() {
    slides.forEach((s) => {
      const v = s.querySelector("video");
      if (v) v.pause();
    });
  }

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    activeIndex = index;
    pauseAllVideos();
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    thumbs.forEach((t, i) => t.classList.toggle("active", i === index));
    thumbs[index]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }

  thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => goTo(i)));
  prevBtn && prevBtn.addEventListener("click", () => goTo(activeIndex - 1));
  nextBtn && nextBtn.addEventListener("click", () => goTo(activeIndex + 1));

  /* Lightbox */
  function openLightbox() {
    if (!lightbox || !lightboxContent) return;
    const current = slides[activeIndex];
    const media = current.querySelector("img, video");
    lightboxContent.innerHTML = "";
    if (media) {
      const clone = media.cloneNode(true);
      if (clone.tagName === "VIDEO") clone.setAttribute("controls", "true");
      lightboxContent.appendChild(clone);
    }
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxContent.innerHTML = "";
  }
  zoomBtn && zoomBtn.addEventListener("click", openLightbox);
  lightboxClose && lightboxClose.addEventListener("click", closeLightbox);
  lightbox && lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") { goTo(activeIndex + 1); openLightbox(); }
    if (e.key === "ArrowLeft") { goTo(activeIndex - 1); openLightbox(); }
  });

  /* Swipe support on mobile */
  let touchStartX = 0;
  stage.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(activeIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  goTo(0);
})();
