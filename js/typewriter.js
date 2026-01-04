/**
 * Typewriter animation with variable timing: slower typing, faster deletion for natural feel.
 */
const phrases = [
    "A software engineer",
    "A motivated athlete",
    "AI and Cloud enthusiast"
];

const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) {
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
            isDeleting = true;
            setTimeout(type, 1000);
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();
}

