/**
 * Parallax effect using CSS custom properties. Throttled via RAF to maintain 60fps.
 * Different speeds per element create depth illusion.
 */
function initParallax() {
  if (typeof window.requestAnimationFrame === "undefined") {
    return;
  }
  
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    const parallaxTargets = [
      { el: document.querySelector("#profile .section__pic-container"), speed: 0.18 },
      { el: document.querySelector("#profile .section__text"), speed: 0.10 },
      { el: document.querySelector("#profile .profile-timeline-container"), speed: 0.22 },
    ].filter((x) => x.el);

    parallaxTargets.forEach((t) => t.el.classList.add("parallax"));

    let ticking = false;

    const updateParallax = () => {
      ticking = false;
      const vh = window.innerHeight;

      parallaxTargets.forEach(({ el, speed }) => {
        const r = el.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.setProperty("--parallaxY", `${offset}px`);
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }
}

