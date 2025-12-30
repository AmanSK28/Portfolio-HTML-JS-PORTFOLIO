// Hamburger Menu Toggle //

// Toggle the hamburger menu
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && icon) {
        menu.classList.toggle("open");
        icon.classList.toggle("open");
    } else {
        console.error("Menu or icon elements not found.");
    }
}

// Typewriter Effect for Dynamic Phrases //

const phrases = [
    "A software engineer",
    "A motivated athlete",
    "A retail professional"
];

const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) {
    // Set initial font size for the typewriter element
    typewriterElement.style.fontSize = "1.5rem";

    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[currentPhraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex--);
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex++);
        }

        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            // Pause at the end of the phrase, then start deleting
            isDeleting = true;
            setTimeout(type, 1000);
        } else if (isDeleting && currentCharIndex === 0) {
            // Once deletion is complete, move to the next phrase
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        } else {
            // Continue typing or deleting at different speeds
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();
} else {
    console.error("Typewriter element not found.");
}

// ===== Scroll reveal + Parallax (repeatable) =====
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Elements we want to reveal (no HTML changes needed)
  const revealSets = [
    // Section headings + intros
    ...document.querySelectorAll(".title, .section__text__p1"),

    // About
    ...document.querySelectorAll("#about .details-container"),
    ...document.querySelectorAll("#about .text-container"),

    // Experience timeline
    document.querySelector(".time-line"),
    ...document.querySelectorAll("#experience .time-line .container"),

    // Projects
    ...document.querySelectorAll("#projects .card"),
  ].filter(Boolean);

  // Apply reveal classes + variants
  revealSets.forEach((el) => el.classList.add("reveal"));

  // About “spring”
  document.querySelectorAll("#about .details-container, #about .text-container").forEach((el, i) => {
    el.classList.add("spring");
    el.style.setProperty("--stagger", `${i * 90}ms`);
  });

  // Experience: left/right + stagger
  document.querySelectorAll("#experience .time-line .container").forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? "from-left" : "from-right");
    el.style.setProperty("--stagger", `${i * 90}ms`);
  });

  // Projects: pop/zoom + stagger
  document.querySelectorAll("#projects .card").forEach((el, i) => {
    el.classList.add("zoom");
    el.style.setProperty("--stagger", `${i * 90}ms`);
  });

  // Reveal observer (repeatable: adds AND removes is-visible)
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
    // Reduced motion: just show everything
    revealSets.forEach((el) => el.classList.add("is-visible"));
  }

  // Parallax (profile -> about vibe)
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
        // center-based offset gives a smoother feel than raw scrollY
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
});


// Intersection Observer for Experience Section Animation // 

document.addEventListener("DOMContentLoaded", () => {
    const experienceSection = document.querySelector("#experience");
    const containers = document.querySelectorAll(".time-line .container");

    if (experienceSection && containers.length > 0) {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        experienceSection.classList.remove("animate-start");
                        containers.forEach(container => container.classList.remove("animate-start"));
                        observer.unobserve(entry.target); // Stop observing this element after it appears
                    }
                });
            },
            { threshold: 0.4 } // Trigger when 40% of the section is visible
        );

        observer.observe(experienceSection);
    } else {
        console.error("Experience section or containers not found.");
    }
});

// Switch mode functionality //

let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

const enableDarkmode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
}

const disableDarkmode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', 'inactive'); // Store a valid string instead of null
}

// Check dark mode on page load
if (darkmode === "active") {
    enableDarkmode(); // Added missing parentheses
}

// Add event listener for theme switch button
themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode'); // Update state
    darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});



// ===== Skills: binary background (fade in → hold → fade out → refresh) =====
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("skills-canvas");
    const skillsSection = document.getElementById("skills");
    if (!canvas || !skillsSection) return;
  
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
  
    const ctx = canvas.getContext("2d");
  
    // --- LOOK ---
    const FONT_SIZE = 18;
    const CELL_PAD = 2;
    const DENSITY = 0.92;
  
    // Subtle motion (set to 0 if you want no movement)
    const DRIFT_PX_PER_SEC = 10;
  
    // Minimal sparkle during hold
    const SPARKLE_CHANCE = 0.03; // lower = calmer
    const DIM_ALPHA = 0.62;
    const BRIGHT_ALPHA = 0.95;
  
    // --- CYCLE TIMING (THIS is what you asked for) ---
    const FADE_IN_MS = 1400;      // fade in duration
    const HOLD_MS = 100200;        // how long it stays before fading out
    const FADE_OUT_MS = 900;     // fade out duration
    // Total cycle = ~4 seconds. Increase HOLD_MS to “last longer”.
  
    const getMatrixColor = () => {
      const css = getComputedStyle(document.documentElement);
      return css.getPropertyValue("--skills-matrix").trim() || "rgba(184, 137, 255, 0.95)";
    };
  
    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
    let grid = [];
    let running = false;
    let rafId = null;
  
    let lastTs = 0;
    let driftOffset = 0;
  
    let cycleStart = 0; // timestamp for fade cycle
  
    function makeGrid() {
      grid = new Array(rows);
      for (let r = 0; r < rows; r++) {
        grid[r] = new Array(cols);
        for (let c = 0; c < cols; c++) {
          grid[r][c] = Math.random() < DENSITY ? (Math.random() > 0.5 ? "1" : "0") : "";
        }
      }
    }
  
    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
  
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
      cols = Math.ceil(w / (FONT_SIZE + CELL_PAD));
      rows = Math.ceil(h / (FONT_SIZE + CELL_PAD));
  
      makeGrid();
      ctx.clearRect(0, 0, w, h);
      driftOffset = 0;
    }
  
    function cycleAlpha(elapsedMs) {
      const total = FADE_IN_MS + HOLD_MS + FADE_OUT_MS;
  
      if (elapsedMs < FADE_IN_MS) {
        // fade in 0 -> 1
        return elapsedMs / FADE_IN_MS;
      }
  
      if (elapsedMs < FADE_IN_MS + HOLD_MS) {
        // hold at 1
        return 1;
      }
  
      if (elapsedMs < total) {
        // fade out 1 -> 0
        const t = (elapsedMs - (FADE_IN_MS + HOLD_MS)) / FADE_OUT_MS;
        return 1 - t;
      }
  
      // cycle complete
      return 0;
    }
  
    function forceAlpha(color, a) {
      // Handles rgb(...) or rgba(...)
      if (color.startsWith("rgb(")) {
        return color.replace("rgb(", "rgba(").replace(")", `, ${a})`);
      }
      if (color.startsWith("rgba(")) {
        return color.replace(/rgba\(([^)]+)\)/, (m, inner) => {
          const parts = inner.split(",").slice(0, 3).join(",");
          return `rgba(${parts}, ${a})`;
        });
      }
      return `rgba(184, 137, 255, ${a})`;
    }
  
    function draw(ts) {
      if (!running) return;
  
      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
  
      if (!cycleStart) cycleStart = ts;
  
      const elapsed = ts - cycleStart;
      const total = FADE_IN_MS + HOLD_MS + FADE_OUT_MS;
      const a = cycleAlpha(elapsed);
  
      // When the cycle ends, refresh to a new grid
      if (elapsed >= total) {
        makeGrid();
        cycleStart = ts;
      }
  
      driftOffset += DRIFT_PX_PER_SEC * dt;
      const cellH = FONT_SIZE + CELL_PAD;
      if (driftOffset > cellH) driftOffset -= cellH;
  
      // Clear each frame (keeps digits crisp and avoids “smear”)
      ctx.clearRect(0, 0, w, h);
  
      ctx.font = `600 ${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
      ctx.textBaseline = "top";
  
      const baseColor = getMatrixColor();
  
      for (let r = 0; r < rows; r++) {
        const y = r * cellH + driftOffset - cellH;
  
        if (y > h) continue;
  
        for (let c = 0; c < cols; c++) {
          const ch = grid[r][c];
          if (!ch) continue;
  
          // Small “sparkle” only during the HOLD phase (looks premium)
          const isHolding = elapsed >= FADE_IN_MS && elapsed < FADE_IN_MS + HOLD_MS;
          const bright = isHolding && Math.random() < SPARKLE_CHANCE;
  
          const alpha = a * (bright ? BRIGHT_ALPHA : DIM_ALPHA);
          ctx.fillStyle = forceAlpha(baseColor, alpha);
  
          ctx.fillText(ch, c * (FONT_SIZE + CELL_PAD), y);
        }
      }
  
      rafId = requestAnimationFrame(draw);
    }
  
    function start() {
      if (running) return;
      running = true;
      lastTs = 0;
      cycleStart = 0;
      resize();
      rafId = requestAnimationFrame(draw);
    }
  
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }
  
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
      { threshold: 0.12 }
    );
  
    io.observe(skillsSection);
    window.addEventListener("resize", resize);
  });
  