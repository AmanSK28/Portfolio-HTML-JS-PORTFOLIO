/**
 * Replaces inline handlers with event delegation. Ensures ARIA state stays in sync with UI.
 */
(function() {
  function initNavigation() {
    const hamburgerIcon = document.querySelector(".hamburger-icon");
    if (hamburgerIcon) {
      if (!hamburgerIcon.hasAttribute("aria-expanded")) {
        hamburgerIcon.setAttribute("aria-expanded", "false");
      }
      if (!hamburgerIcon.hasAttribute("aria-label")) {
        hamburgerIcon.setAttribute("aria-label", "Toggle navigation menu");
      }
      
      hamburgerIcon.addEventListener("click", (e) => {
        e.preventDefault();
        toggleMenu();
        const menu = document.querySelector(".menu-links");
        if (menu) {
          const isOpen = menu.classList.contains("open");
          hamburgerIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
      });
      
      hamburgerIcon.setAttribute("role", "button");
      hamburgerIcon.setAttribute("tabindex", "0");
      
      hamburgerIcon.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleMenu();
          const menu = document.querySelector(".menu-links");
          if (menu) {
            const isOpen = menu.classList.contains("open");
            hamburgerIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
          }
        }
      });
    }

    const menuLinks = document.querySelectorAll(".menu-links a");
    menuLinks.forEach(link => {
      link.addEventListener("click", () => {
        toggleMenu();
      });
    });

    const cvButton = document.querySelector(".btn-color-2");
    if (cvButton && cvButton.textContent.trim() === "Download CV") {
      cvButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.open("./assets/CV-Aman.pdf", "_blank");
      });
    }

    const contactButton = document.querySelector(".btn-color-1");
    if (contactButton && contactButton.textContent.trim() === "Contact Info") {
      contactButton.addEventListener("click", (e) => {
        e.preventDefault();
        const contactSection = document.querySelector("#contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    const githubIcon = document.querySelector('img[alt="My Github profile"]');
    if (githubIcon) {
      githubIcon.addEventListener("click", () => {
        window.open("https://github.com", "_blank", "noopener,noreferrer");
      });
      githubIcon.setAttribute("role", "button");
      githubIcon.setAttribute("tabindex", "0");
      githubIcon.setAttribute("aria-label", "Visit GitHub profile");
      githubIcon.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open("https://github.com", "_blank", "noopener,noreferrer");
        }
      });
    }

    const linkedinIcon = document.querySelector('img[alt="My LinkedIn profile"]');
    if (linkedinIcon) {
      linkedinIcon.addEventListener("click", () => {
        window.open("https://linkedin.com/in/aman-kang44/", "_blank", "noopener,noreferrer");
      });
      linkedinIcon.setAttribute("role", "button");
      linkedinIcon.setAttribute("tabindex", "0");
      linkedinIcon.setAttribute("aria-label", "Visit LinkedIn profile");
      linkedinIcon.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open("https://linkedin.com/in/aman-kang44/", "_blank", "noopener,noreferrer");
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }
})();

