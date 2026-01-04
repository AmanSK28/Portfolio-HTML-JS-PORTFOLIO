/**
 * Binary matrix animation with fade cycles. Starts/stops via IntersectionObserver to save CPU when off-screen.
 */
function initSkillsMatrix() {
    if (typeof HTMLCanvasElement === "undefined" || 
        typeof CanvasRenderingContext2D === "undefined") {
        return;
    }
    
    const canvas = document.getElementById("skills-canvas");
    const skillsSection = document.getElementById("skills");
    if (!canvas || !skillsSection) return;
  
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    
    if (typeof IntersectionObserver === "undefined") {
        return;
    }
  
    const ctx = canvas.getContext("2d");
  
    const FONT_SIZE = 18;
    const CELL_PAD = 2;
    const DENSITY = 0.92;
    const DRIFT_PX_PER_SEC = 10;
    const SPARKLE_CHANCE = 0.03;
    const DIM_ALPHA = 0.62;
    const BRIGHT_ALPHA = 0.95;
  
    const FADE_IN_MS = 1400;
    const HOLD_MS = 4000;
    const FADE_OUT_MS = 900;
  
    const getMatrixColor = () => {
      const panel = canvas.closest(".skills-panel") || skillsSection || document.body;
      const css = getComputedStyle(panel);
      return css.getPropertyValue("--skills-matrix").trim() || "rgba(60, 60, 60, 0.65)";
    };
  
    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
    let grid = [];
    let running = false;
    let rafId = null;
    let lastTs = 0;
    let driftOffset = 0;
    let cycleStart = 0;
  
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
        return elapsedMs / FADE_IN_MS;
      }
  
      if (elapsedMs < FADE_IN_MS + HOLD_MS) {
        return 1;
      }
  
      if (elapsedMs < total) {
        const t = (elapsedMs - (FADE_IN_MS + HOLD_MS)) / FADE_OUT_MS;
        return 1 - t;
      }
  
      return 0;
    }
  
    function forceAlpha(color, a) {
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
  
      if (elapsed >= total) {
        makeGrid();
        cycleStart = ts;
      }
  
      driftOffset += DRIFT_PX_PER_SEC * dt;
      const cellH = FONT_SIZE + CELL_PAD;
      if (driftOffset > cellH) driftOffset -= cellH;
  
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
}

