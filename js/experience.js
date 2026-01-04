/**
 * Triggers timeline animation when section enters viewport. Unobserves after trigger to prevent re-animation.
 */
function initExperience() {
    if (typeof IntersectionObserver === "undefined") {
        return;
    }
    
    const experienceSection = document.querySelector("#experience");
    const containers = document.querySelectorAll(".time-line .container");

    if (experienceSection && containers.length > 0) {
        try {
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            experienceSection.classList.remove("animate-start");
                            containers.forEach(container => container.classList.remove("animate-start"));
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.4 }
            );

            observer.observe(experienceSection);
        } catch (error) {
            if (typeof console !== "undefined" && console.error) {
                console.error("Error initializing experience observer:", error);
            }
        }
    }
}

