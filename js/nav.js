/**
 * Hamburger menu toggle. Updates ARIA state for screen readers.
 */
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && icon) {
        const isOpen = menu.classList.toggle("open");
        icon.classList.toggle("open");
        
        if (icon.hasAttribute("aria-expanded")) {
            icon.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
    }
}

