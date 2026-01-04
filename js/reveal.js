/**
 * Progressive reveal animations using IntersectionObserver. Respects prefers-reduced-motion.
 * Stagger delays create sequential appearance effect.
 */
function initReveal() {
  document.documentElement.classList.add("js");
  
  if (typeof IntersectionObserver === "undefined") {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
    return;
  }
  
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealSets = [
    ...document.querySelectorAll(".title, .section__text__p1"),
    ...document.querySelectorAll("#about .details-container"),
    ...document.querySelectorAll("#about .text-container"),
    document.querySelector(".time-line"),
    ...document.querySelectorAll("#experience .time-line .container"),
    ...document.querySelectorAll("#projects .card"),
  ].filter(Boolean);

  revealSets.forEach((el) => el.classList.add("reveal"));

  document.querySelectorAll("#about .details-container, #about .text-container").forEach((el, i) => {
    el.classList.add("spring");
    el.style.setProperty("--stagger", `${i * 90}ms`);
  });

  document.querySelectorAll("#experience .time-line .container").forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? "from-left" : "from-right");
    el.style.setProperty("--stagger", `${i * 90}ms`);
  });

  document.querySelectorAll("#projects .card").forEach((el, i) => {
    el.classList.add("zoom");
    el.style.setProperty("--stagger", `${i * 90}ms`);
  });

  if (!reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    revealSets.forEach((el) => io.observe(el));
  } else {
    revealSets.forEach((el) => el.classList.add("is-visible"));
  }
}

