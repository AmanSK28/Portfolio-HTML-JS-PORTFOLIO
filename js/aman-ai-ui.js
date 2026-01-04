  /**
   * Hybrid Q&A: TF-IDF retrieval for fast answers, LLM for natural language when API available.
   * Knowledge base built from structured profile data and scraped page content.
   */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

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

  /**
   * Builds a knowledge base from structured profile data and scraped page content.
   * @returns {Array<Object>} Array of document chunks for retrieval
   */
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

  const STOP = new Set([
  "a","an","the","and","or","to","of","in","on","for","with","is","are","was","were",
  "i","me","my","you","your","it","this","that","as","at","by","from","be","been",
  "about","into","over","also","can","do","does","did","what","when","where","why","how"
  ]);

  /**
   * Tokenizes a string into an array of cleaned, lowercase words, filtering out stop words.
   * @param {string} s - The input string to tokenize
   * @returns {Array<string>} Array of filtered tokens
   */
  function tokenize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9+&\s]/g, " ")
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t && t.length > 1 && !STOP.has(t));
  }

  /**
   * Calculates term frequencies for a given array of tokens.
   * @param {Array<string>} tokens - Array of tokens
   * @returns {Map<string, number>} Map of term to frequency count
   */
  function termFreq(tokens) {
  const m = new Map();
    tokens.forEach(t => m.set(t, (m.get(t) || 0) + 1));
    return m;
  }

  /**
   * Builds an inverted index with TF-IDF vectors for a collection of documents.
   * @param {Array<Object>} docs - Array of document objects with text, title, and tags
   * @returns {Object} Index object containing docs, idf map, and TF-IDF vectors
   */
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

  /**
   * Vectorizes a query string using the precomputed IDF values.
   * @param {string} q - The query string
   * @param {Map<string, number>} idf - The IDF map from the document index
   * @returns {Object} Object containing the query vector (v) and its norm
   */
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

  /**
   * Calculates the cosine similarity between two vectors.
   * @param {Object} a - First vector object with v (Map) and norm (number)
   * @param {Object} b - Second vector object with v (Map) and norm (number)
   * @returns {number} Cosine similarity score (0-1)
   */
  function cosine(a, b) {
  let dot = 0;
  const [small, big] = a.v.size < b.v.size ? [a.v, b.v] : [b.v, a.v];
  for (const [term, w] of small.entries()) {
    const w2 = big.get(term);
    if (w2) dot += w * w2;
  }
    return dot / (a.norm * b.norm);
  }

  /**
   * Applies keyword-based boosts to retrieval scores based on query content.
   * @param {string} q - The query string
   * @returns {Map<string, number>} Map of tag to boost value
   */
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

  /**
   * Scores a document based on its base similarity score and keyword boosts.
   * @param {Object} doc - The document object
   * @param {number} baseScore - The base similarity score (e.g., cosine similarity)
   * @param {Map<string, number>} boosts - Map of keyword boosts
   * @returns {number} The final boosted score
   */
  function scoreDoc(doc, baseScore, boosts) {
  let s = baseScore;
  const tags = doc.tags || [];
  for (const [boostTag, val] of boosts.entries()) {
    if (tags.includes(boostTag) || (doc.text || "").toLowerCase().includes(boostTag)) {
      s += val;
    }
  }
    return s;
  }

  // Answer template system
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

  /**
   * Escapes HTML special characters to prevent XSS.
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  function escapeHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  }

  function answerFromTemplates(q) {
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

  /**
   * XSS-safe HTML rendering via whitelist. Strips script tags and javascript: protocols.
   * @param {string} html - HTML string to render
   * @param {HTMLElement} container - Container element to append to
   */
  function safeRenderHTML(html, container) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const allowedTags = new Set(["strong", "em", "ul", "ol", "li", "a", "br", "div", "span", "p"]);
    const allowedAttrs = {
      a: ["href", "target", "rel"],
      div: ["style"]
    };

    function sanitizeNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.textContent);
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        
        if (!allowedTags.has(tagName)) {
          return document.createTextNode(node.textContent);
        }

        const safeNode = document.createElement(tagName);

        if (allowedAttrs[tagName]) {
          allowedAttrs[tagName].forEach(attr => {
            const value = node.getAttribute(attr);
            if (value) {
              if (attr === "href" && value.trim().toLowerCase().startsWith("javascript:")) {
                return;
              }
              safeNode.setAttribute(attr, value);
            }
          });
        }

        Array.from(node.childNodes).forEach(child => {
          const safeChild = sanitizeNode(child);
          if (safeChild) {
            safeNode.appendChild(safeChild);
          }
        });

        return safeNode;
      }

      return null;
    }

    Array.from(temp.childNodes).forEach(node => {
      const safeNode = sanitizeNode(node);
      if (safeNode) {
        container.appendChild(safeNode);
      }
    });
  }

  function addMsg(chatEl, who, html) {
  const wrap = document.createElement("div");
  wrap.className = `aman-ai-msg aman-ai-msg--${who}`;

  const bubble = document.createElement("div");
  bubble.className = "aman-ai-bubble";
  
  if (who === "user") {
    bubble.textContent = html;
  } else {
    try {
      safeRenderHTML(html, bubble);
    } catch (error) {
      bubble.textContent = html.replace(/<[^>]*>/g, "");
    }
  }

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

  async function callAmanAiLLM(question, contexts) {
  const res = await fetch("/.netlify/functions/aman-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, contexts }),
  });

  const data = await res.json().catch(() => null);
    return data && data.text ? String(data.text) : null;
  }

  function isAbusiveOrOffTopic(q) {
    return /(idiot|stupid|dumb|moron|trash|hate|ugly)/i.test(q || "");
  }

  /**
   * Retrieves the top relevant contexts from the knowledge base for a given question.
   * @param {string} question - The user's question
   * @param {Object} index - The pre-built TF-IDF index
   * @param {number} k - Number of top contexts to retrieve (default: 4)
   * @returns {Object} Object containing contexts array and bestScore number
   */
  function retrieveTopContexts(question, index, k = 4) {
  const qv = vectorizeQuery(question, index.idf);
  const boosts = keywordBoost(question);

  const scored = index.docs.map((doc, i) => {
    const base = cosine(qv, index.vectors[i]);
    const final = scoreDoc(doc, base, boosts);
    return { doc, score: final };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, k);

  const bestScore = top[0]?.score ?? 0;

  const contexts = top.map((x) => ({
    title: x.doc.title,
    text: x.doc.text,
    score: x.score,
  }));

    return { contexts, bestScore };
  }

  function initAmanAI() {
  const chat = $("#aman-ai-chat");
  const form = $("#aman-ai-form");
  const input = $("#aman-ai-input");
  
  if (!chat || !form || !input) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAmanAI);
    } else {
      setTimeout(initAmanAI, 50);
    }
    return;
  }

  const kb = buildKnowledgeBase();
  const index = buildIndex(kb);

  let pendingRequest = false;

  function respond(q) {
    const templ = answerFromTemplates(q);
    const ans = templ || answerWithSearch(q, index);
    return ans.html;
  }

  async function handleSend(question) {
    const q = (question || input.value || "").trim();
    if (!q) return;

    if (pendingRequest) {
      return;
    }
  
    input.value = "";
    addMsg(chat, "user", escapeHTML(q));
    pendingRequest = true;
  
    if (isAbusiveOrOffTopic(q)) {
      pendingRequest = false;
      addMsg(
        chat,
        "ai",
        "I can help with questions about Aman's experience, skills, projects, and education. Try: <em>\"What's Aman's best cloud project?\"</em>"
      );
      return;
    }
  
    const loading = addLoading(chat);
  
    try {
      const { contexts, bestScore } = retrieveTopContexts(q, index, 4);
    
      if (bestScore < 0.18) {
        loading.remove();
        pendingRequest = false;
        addMsg(
          chat,
          "ai",
          `
          <div>
            I'm not fully sure which part you mean yet — is this about:
            ${formatBullets([
              "Work experience / roles",
              "Projects",
              "Skills",
              "Education"
            ])}
            <div style="margin-top:10px;">Try asking: <em>&quot;What roles has Aman done?&quot;</em></div>
          </div>
          `
        );
        return;
      }
    
      const llmText = await callAmanAiLLM(q, contexts);
    
      loading.remove();
      pendingRequest = false;
    
      if (llmText) {
        const safeText = escapeHTML(llmText).replace(/\n/g, "<br>");
        addMsg(chat, "ai", safeText);
        return;
      }
    
      const html = respond(q);
      addMsg(chat, "ai", html);
    } catch (error) {
      loading.remove();
      pendingRequest = false;
      addMsg(
        chat,
        "ai",
        "Sorry, something went wrong. Please try again in a moment."
      );
    }
  }

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSend();
  });

  const chips = $$(".ai-chip");
  chips.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const question = btn.getAttribute("data-ai-question") || btn.textContent.trim();
      if (question) {
        handleSend(question);
      }
    });
  });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAmanAI);
  } else {
    setTimeout(initAmanAI, 0);
  }
})();
