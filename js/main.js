/**
 * Module initialization coordinator. Defensive checks prevent errors if modules fail to load.
 */
document.addEventListener("DOMContentLoaded", () => {
  try {
    if (typeof initReveal === "function") {
      initReveal();
    }
    
    if (typeof initParallax === "function") {
      initParallax();
    }
    
    if (typeof initExperience === "function") {
      initExperience();
    }
    
    if (typeof initSkillsMatrix === "function") {
      initSkillsMatrix();
    }
  } catch (error) {
    console.error("Error during module initialization:", error);
  }
});

