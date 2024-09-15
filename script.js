// script.js

const phrases = [
    "A Driven tech enthusiast",
    "Commited to Physical Wellness",
    "innovative Problem Solver"
];

const typewriterElement = document.getElementById('typewriter');
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[currentPhraseIndex];
    const isAtEnd = currentCharIndex === currentPhrase.length;

    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex--);
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex++);
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, 1000); // Pause at the end of the phrase
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        setTimeout(type, 500); // Pause before starting a new phrase
    } else {
        setTimeout(type, isDeleting ? 50 : 100); // Speed of typing
    }
}

type();
