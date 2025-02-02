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



