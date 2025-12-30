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
  

  /* =========================================================
   Aman AI — Free, client-side Q&A (no paid APIs)
   - Builds a small knowledge base from:
     (a) embedded CV snippets (editable below)
     (b) content already on the page (#about, #experience, #projects, #skills if present)
   - Uses lightweight retrieval (TF-IDF-ish scoring + keyword boosts)
   - Returns answers with "Sources" so it feels credible
========================================================= */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---- Editable: structured CV + profile facts ----
  const AMAN_PROFILE = {
    name: "Aman Kang",
    contact: {
      email: "AmanSinghk@icloud.com",
      linkedin: "https://www.linkedin.com/in/aman-kang44/",
      github: "https://github.com"
    },
    headline:
      "Aspiring developer specialising in AI and data with a focus on finance, on track for a first-class degree.",
    education: [
      {
        org: "Newcastle University",
        program: "BSc Computer Science with an Industrial Placement Year",
        graduation: "June 2027",
        notes: ["Predicted first-class honours"],
        modules: [
          "Algorithm Analysis",
          "Data Science & Machine Learning",
          "Software Design",
          "Computer Architecture"
        ]
      }
    ],
    roles: [
      {
        org: "Ernst & Young",
        title: "Technology consulting placement",
        dates: "Sep 2025 – Aug 2026",
        bullets: [
          "Collaborated across industries and AI & Data teams to deliver Microsoft Power Platform solutions using Agile sprints and DevOps practices (across 8+ service lines).",
          "Built a Dynamics 365 prototype with custom entities, forms, and business workflows, gaining exposure to automation security overviews and automation strategy.",
          "Worked on document intelligence tooling; prototyped automated extraction + semantic search, cutting manual processing by ~30%."
        ],
        tags: ["experience", "consulting", "microsoft", "power platform", "dynamics 365", "agile", "devops", "ai", "data"]
      },
      {
        org: "Nomura",
        title: "Technology simulation day candidate",
        dates: "Nov 2024",
        bullets: [
          "Achieved 1st place leading a team to design an AI-driven automation solution integrating RTO/RPO recovery planning and workflow visualisation.",
          "Gained exposure to FX Risk and Credit Technology including REST APIs, Risk Pads, and scalable systems (Solace, Red Hat)."
        ],
        tags: ["experience", "finance", "ai", "rest", "risk", "resilience"]
      },
      {
        org: "Baillie Gifford",
        title: "Technology programme candidate",
        dates: "Sep 2024",
        bullets: [
          "Explored how Baillie Gifford uses R&D to stay ahead of emerging technologies in finance.",
          "Investigated AI automation for document search/sorting; insights suggested ~30% operational efficiency uplift."
        ],
        tags: ["experience", "finance", "ai", "research", "automation"]
      }
    ],
    projects: [
      {
        name: "Collaborative Java Quiz Application",
        dates: "Feb 2024 – Mar 2024",
        bullets: [
          "Led a group Java application project with database integration + JUnit testing.",
          "Improved data efficiency and retrieval by ~40% with innovative solutions."
        ],
        tags: ["project", "java", "testing", "database"]
      },
      {
        name: "Skill Scope",
        dates: "Jan 2025 – Mar 2025",
        bullets: [
          "Built a tool to identify key technical + soft skills in software roles using React, Tailwind, Node.js, and external APIs for real-time integration.",
          "Designed interactive charts + map visualisations to present insights clearly."
        ],
        tags: ["project", "react", "tailwind", "node", "api", "data viz", "frontend"]
      }
    ],
    skills: {
      languages: ["Python", "Java", "C", "C++", "JavaScript", "SQL"],
      frontend: ["React", "Tailwind", "CSS"],
      databases: ["MySQL", "MongoDB", "D-Beaver"],
      data: ["Tableau", "HCI", "Excel"],
      backendCloud: ["Azure", "AWS", "Docker", "REST APIs", "Node.js"],
      certifications: [
        "JPMorgan Chase Software Engineering Simulation (2024)",
        "PL-200 Power Platform Functional Consultant"
      ],
      softSkills: [
        "Clear communication",
        "Teamwork",
        "Problem solving",
        "Growth mindset",
        "Discipline (Hyrox events)"
      ]
    }
  };

  function buildKnowledgeBase() {
    const chunks = [];

    chunks.push({
      id: "cv_personal_statement",
      title: "CV: Personal statement",
      tags: ["about", "cv", "ai", "data", "finance"],
      text: AMAN_PROFILE.headline + " Strong problem-solving mindset; discipline + collaboration from Hyrox events."
    });

    AMAN_PROFILE.education.forEach((e, i) => {
      chunks.push({
        id: `cv_edu_${i}`,
        title: `CV: Education — ${e.org}`,
        tags: ["education", "cv", "university", "modules"],
        text:
          `${e.program} (Grad: ${e.graduation}). ` +
          `${e.notes.join(" ")} ` +
          `Core modules: ${e.modules.join(", ")}.`
      });
    });

    AMAN_PROFILE.roles.forEach((r, i) => {
      chunks.push({
        id: `cv_role_${i}`,
        title: `CV: ${r.org} — ${r.title}`,
        tags: ["experience", "cv"].concat(r.tags || []),
        text: `${r.dates}. ` + r.bullets.join(" ")
      });
    });

    AMAN_PROFILE.projects.forEach((p, i) => {
      chunks.push({
        id: `cv_project_${i}`,
        title: `CV: Project — ${p.name}`,
        tags: ["projects", "cv"].concat(p.tags || []),
        text: `${p.dates}. ` + p.bullets.join(" ")
      });
    });

    chunks.push({
      id: "cv_skills_certs",
      title: "CV: Technical skills & certifications",
      tags: ["skills", "certifications", "cv"],
      text:        `Programming: ${AMAN_PROFILE.skills.languages.join(", ")}. ` +
      `Frontend: ${AMAN_PROFILE.skills.frontend.join(", ")}. ` +
      `Databases: ${AMAN_PROFILE.skills.databases.join(", ")}. ` +
      `Data/Tools: ${AMAN_PROFILE.skills.data.join(", ")}. ` +
      `Backend/Cloud: ${AMAN_PROFILE.skills.backendCloud.join(", ")}. ` +
      `Certifications: ${AMAN_PROFILE.skills.certifications.join(", ")}.`
  });

  // ---- Also scrape portfolio page content (so it stays in-sync) ----
  const scrape = [
    { id: "about_section", title: "Portfolio: About", selector: "#about", tags: ["about", "portfolio"], href: "#about" },
    { id: "skills_section", title: "Portfolio: Skills", selector: "#skills", tags: ["skills", "portfolio"], href: "#skills" },
    { id: "experience_section", title: "Portfolio: Experience & Certifications", selector: "#experience", tags: ["experience", "certifications", "portfolio"], href: "#experience" },
    { id: "projects_section", title: "Portfolio: Projects", selector: "#projects", tags: ["projects", "portfolio"], href: "#projects" },
    { id: "contact_section", title: "Portfolio: Contact", selector: "#contact", tags: ["contact", "portfolio"], href: "#contact" }
  ];

  scrape.forEach((s) => {
    const el = $(s.selector);
    if (!el) return;

    // Pull text while keeping it light (avoid nav/footer noise)
    const text = el.innerText
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3000);

    if (!text) return;

    chunks.push({
      id: s.id,
      title: s.title,
      tags: s.tags,
      text,
      source: { label: s.title, href: s.href }
    });
  });

  return chunks;
}

// ---------------------------
// Retrieval (lightweight TF-IDF-ish)
// ---------------------------
const STOP = new Set([
  "a","an","the","and","or","to","of","in","on","for","with","is","are","was","were",
  "i","me","my","you","your","it","this","that","as","at","by","from","be","been",
  "about","into","over","also","can","do","does","did","what","when","where","why","how"
]);

function tokenize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9+&\s]/g, " ")
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t && t.length > 1 && !STOP.has(t));
}

function termFreq(tokens) {
  const m = new Map();
  tokens.forEach(t => m.set(t, (m.get(t) || 0) + 1));
  return m;
}

function buildIndex(docs) {
  const docTF = docs.map(d => termFreq(tokenize(d.text + " " + (d.title || "") + " " + (d.tags || []).join(" "))));
  const df = new Map();

  docTF.forEach(tf => {
    for (const k of tf.keys()) df.set(k, (df.get(k) || 0) + 1);
  });

  const N = docs.length;
  const idf = new Map();
  for (const [term, n] of df.entries()) {
    idf.set(term, Math.log((N + 1) / (n + 1)) + 1);
  }

  // Precompute TF-IDF vectors + norms
  const vectors = docTF.map(tf => {
    const v = new Map();
    let norm = 0;
    for (const [term, count] of tf.entries()) {
      const w = (1 + Math.log(count)) * (idf.get(term) || 0);
      v.set(term, w);
      norm += w * w;
    }
    return { v, norm: Math.sqrt(norm) || 1 };
  });

  return { docs, idf, vectors };
}

function vectorizeQuery(q, idf) {
  const tf = termFreq(tokenize(q));
  const v = new Map();
  let norm = 0;
  for (const [term, count] of tf.entries()) {
    const w = (1 + Math.log(count)) * (idf.get(term) || 0);
    if (w > 0) {
      v.set(term, w);
      norm += w * w;
    }
  }
  return { v, norm: Math.sqrt(norm) || 1 };
}

function cosine(a, b) {
  let dot = 0;
  // iterate smaller map
  const [small, big] = a.v.size < b.v.size ? [a.v, b.v] : [b.v, a.v];
  for (const [term, w] of small.entries()) {
    const w2 = big.get(term);
    if (w2) dot += w * w2;
  }
  return dot / (a.norm * b.norm);
}

function keywordBoost(q) {
  const s = q.toLowerCase();
  const boosts = new Map();

  const add = (tag, val) => boosts.set(tag, (boosts.get(tag) || 0) + val);

  if (/(cloud|azure|aws|docker|devops|power platform|dynamics|rest)/.test(s)) add("cloud", 0.12);
  if (/(ai|ml|machine learning|data|semantic|document intelligence)/.test(s)) add("ai", 0.12);
  if (/(education|university|degree|modules)/.test(s)) add("education", 0.12);
  if (/(project|build|built|app|react|node|javascript)/.test(s)) add("projects", 0.10);
  if (/(contact|email|linkedin|reach)/.test(s)) add("contact", 0.18);
  if (/(role|experience|worked|job|placement|intern)/.test(s)) add("experience", 0.14);
  if (/(cert|certification|pl-200|jpmorgan)/.test(s)) add("certifications", 0.14);

  return boosts;
}

function scoreDoc(doc, baseScore, boosts) {
  let s = baseScore;
  const tags = doc.tags || [];
  for (const [boostTag, val] of boosts.entries()) {
    // If doc contains tag directly OR text contains keyword-ish tag
    if (tags.includes(boostTag) || (doc.text || "").toLowerCase().includes(boostTag)) {
      s += val;
    }
  }
  return s;
}

// ---------------------------
// Answer templates (make it feel smart without an LLM)
// ---------------------------
function normalizeQ(q) {
  return (q || "").trim().toLowerCase();
}

function matches(q, re) {
  return re.test(normalizeQ(q));
}

function formatBullets(lines) {
  return `<ul>${lines.map(l => `<li>${l}</li>`).join("")}</ul>`;
}

function sourcesHTML(sources) {
  if (!sources.length) return "";
  const unique = [];
  const seen = new Set();
  sources.forEach(s => {
    const key = (s.href || "") + (s.label || "");
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(s);
    }
  });

  return `
    <div style="margin-top:10px; opacity:0.95;">
      <strong>Sources:</strong>
      ${unique
        .slice(0, 4)
        .map(s => s.href ? `<a href="${s.href}">${escapeHTML(s.label)}</a>` : escapeHTML(s.label))
        .join(" • ")}
    </div>
  `;
}

function escapeHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function answerFromTemplates(q) {
  // Roles / Experience
  if (matches(q, /(roles|experience|worked|work(ed)?|job|placement|intern)/)) {
    const roles = AMAN_PROFILE.roles.map(r =>
      `<strong>${escapeHTML(r.org)}</strong> — ${escapeHTML(r.title)} <em>(${escapeHTML(r.dates)})</em><br>${escapeHTML(r.bullets[0])}`
    );

    return {
      html: `
        <div>
          Here are Aman’s key roles:
          ${formatBullets(roles)}
          ${sourcesHTML([{ label: "Portfolio: Experience & Certifications", href: "#experience" }])}
        </div>
      `,
      confidence: 0.9
    };
  }

  // Skills
  if (matches(q, /(strongest skills|skills|best at|strengths)/)) {
    const lines = [
      `<strong>Programming:</strong> ${AMAN_PROFILE.skills.languages.join(", ")}`,
      `<strong>Cloud / Backend:</strong> ${AMAN_PROFILE.skills.backendCloud.join(", ")}`,
      `<strong>Frontend:</strong> ${AMAN_PROFILE.skills.frontend.join(", ")}`,
      `<strong>Databases:</strong> ${AMAN_PROFILE.skills.databases.join(", ")}`,
      `<strong>Data / Tools:</strong> ${AMAN_PROFILE.skills.data.join(", ")}`
    ];

    return {
      html: `
        <div>
          Here’s a quick breakdown of Aman’s strongest skills:
          ${formatBullets(lines)}
          ${sourcesHTML([{ label: "Portfolio: Skills", href: "#skills" }, { label: "CV: Technical skills & certifications", href: "#aman-ai" }])}
        </div>
      `,
      confidence: 0.9
    };
  }

  // Cloud + AI
  if (matches(q, /(cloud|azure|aws|ai|ml|machine learning|data)/)) {
    const bullets = [
      "Specialises in AI + data with a focus on finance (per CV statement).",
      "Experience delivering Microsoft Power Platform solutions using Agile sprints + DevOps practices.",
      "Prototyped document intelligence tooling: automated extraction + semantic search (~30% reduction in manual processing)."
    ];

    return {
      html: `
        <div>
          Aman’s Cloud + AI highlights:
          ${formatBullets(bullets)}
          ${sourcesHTML([{ label: "Portfolio: About", href: "#about" }, { label: "Portfolio: Experience & Certifications", href: "#experience" }])}
        </div>
      `,
      confidence: 0.85
    };
  }

  // Projects
  if (matches(q, /(projects|built|build|portfolio|apps)/)) {
    const p = AMAN_PROFILE.projects.map(pr =>
      `<strong>${escapeHTML(pr.name)}</strong> <em>(${escapeHTML(pr.dates)})</em><br>${escapeHTML(pr.bullets[0])}`
    );

    return {
      html: `
        <div>
          Notable projects:
          ${formatBullets(p)}
          ${sourcesHTML([{ label: "Portfolio: Projects", href: "#projects" }, { label: "CV: Projects", href: "#aman-ai" }])}
        </div>
      `,
      confidence: 0.85
    };
  }

  // Education
  if (matches(q, /(education|university|degree|modules|newcastle)/)) {
    const e = AMAN_PROFILE.education[0];
    const lines = [
      `${e.program} — <strong>${e.org}</strong> (Grad: ${e.graduation})`,
      `Status: ${e.notes.join(", ")}`,
      `Core modules: ${e.modules.join(", ")}`
    ];

    return {
      html: `
        <div>
          Education:
          ${formatBullets(lines)}
          ${sourcesHTML([{ label: "Portfolio: About", href: "#about" }])}
        </div>
      `,
      confidence: 0.9
    };
  }

  // Contact
  if (matches(q, /(contact|email|linkedin|reach|message)/)) {
    const lines = [
      `<strong>Email:</strong> <a href="mailto:${AMAN_PROFILE.contact.email}">${AMAN_PROFILE.contact.email}</a>`,
      `<strong>LinkedIn:</strong> <a href="${AMAN_PROFILE.contact.linkedin}" target="_blank" rel="noopener">aman-kang44</a>`
    ];

    return {
      html: `
        <div>
          You can reach Aman here:
          ${formatBullets(lines)}
          ${sourcesHTML([{ label: "Portfolio: Contact", href: "#contact" }])}
        </div>
      `,
      confidence: 0.95
    };
  }

  return null;
}

function answerWithSearch(q, index) {
  const qv = vectorizeQuery(q, index.idf);
  const boosts = keywordBoost(q);

  const scored = index.docs.map((doc, i) => {
    const base = cosine(qv, index.vectors[i]);
    const final = scoreDoc(doc, base, boosts);
    return { doc, score: final };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 4);
  const best = top[0];

  // Confidence gate: if really low, fall back nicely
  if (!best || best.score < 0.14) {
    return {
      html: `
        <div>
          I might not have that specific detail in my portfolio/CV yet.
          Try one of these:
          ${formatBullets([
            "What roles has Aman done?",
            "What are Aman’s strongest skills?",
            "Tell me about Aman’s cloud + AI experience",
            "How can I contact Aman?"
          ])}
          ${sourcesHTML([{ label: "Portfolio: About", href: "#about" }, { label: "Portfolio: Contact", href: "#contact" }])}
        </div>
      `,
      confidence: 0.25
    };
  }

  // Build a short “synthesis” from top docs
  const points = top
    .filter(x => x.score > 0.12)
    .slice(0, 3)
    .map(x => {
      const snippet = (x.doc.text || "").split(". ").slice(0, 2).join(". ").trim();
      return `<strong>${escapeHTML(x.doc.title)}:</strong> ${escapeHTML(snippet)}${snippet.endsWith(".") ? "" : "."}`;
    });

  const sources = top
    .map(x => x.doc.source)
    .filter(Boolean);

  return {
    html: `
      <div>
        Here’s what I found that best matches your question:
        ${formatBullets(points)}
        ${sourcesHTML(sources)}
      </div>
    `,
    confidence: Math.min(0.85, best.score + 0.2)
  };
}

// ---------------------------
// UI wiring
// ---------------------------
function addMsg(chatEl, who, html) {
  const wrap = document.createElement("div");
  wrap.className = `aman-ai-msg aman-ai-msg--${who}`;

  const bubble = document.createElement("div");
  bubble.className = "aman-ai-bubble";
  bubble.innerHTML = html;

  wrap.appendChild(bubble);
  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;

  return wrap;
}

function addLoading(chatEl) {
  const wrap = document.createElement("div");
  wrap.className = "aman-ai-msg aman-ai-msg--ai";

  const bubble = document.createElement("div");
  bubble.className = "aman-ai-bubble aman-ai-bubble--loading";
  bubble.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;

  wrap.appendChild(bubble);
  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;

  return wrap;
}

function initAmanAI() {
  const chat = $("#aman-ai-chat");
  const form = $("#aman-ai-form");
  const input = $("#aman-ai-input");
  if (!chat || !form || !input) return; // section not on page

  const kb = buildKnowledgeBase();
  const index = buildIndex(kb);

  function respond(q) {
    const templ = answerFromTemplates(q);
    const ans = templ || answerWithSearch(q, index);
    return ans.html;
  }

  function handleSend(question) {
    const q = (question || input.value || "").trim();
    if (!q) return;

    addMsg(chat, "user", escapeHTML(q));
    input.value = "";

    const loading = addLoading(chat);

    // tiny delay so UI feels natural
    window.setTimeout(() => {
      loading.remove();
      const html = respond(q);
      addMsg(chat, "ai", html);
    }, 220);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSend();
  });

  // Suggested chips
  $$(".ai-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      handleSend(btn.getAttribute("data-ai-question") || btn.innerText);
    });
  });
}

// Run after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAmanAI);
} else {
  initAmanAI();
}
})();
        
