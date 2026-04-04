// --- Particle Generation (Underwater Bubbles) ---
function createParticles() {
    const container = document.getElementById('particles-container');
    const fishContainer = document.getElementById('fish-container');
    const particleCount = 60; // Number of bubbles
    const fishCount = 15; // Number of fish

    // Bubbles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 8 + 2; // 2px to 10px
        const posX = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        container.appendChild(particle);
    }

    // Fish
    if (fishContainer) {
        for (let i = 0; i < fishCount; i++) {
            const fish = document.createElement('div');
            fish.classList.add('fish-particle');

            const size = Math.random() * 0.8 + 0.4; // Scale 0.4x to 1.2x
            const startY = Math.random() * 80 + 10; // 10vh to 90vh
            const delay = Math.random() * 15;
            const duration = Math.random() * 15 + 15; // 15s to 30s

            fish.style.setProperty('--swim-y', `${startY}vh`);
            fish.style.setProperty('--scale', size);
            fish.style.animationDelay = `${delay}s`;
            fish.style.animationDuration = `${duration}s`;

            // Randomly flip some fish to swim left-to-right or right-to-left
            if (Math.random() > 0.5) {
                fish.classList.add('reverse');
            }

            fishContainer.appendChild(fish);
        }
    }
}

// --- Parallax Effect on Mouse Move ---
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    // Move the main bubble slightly opposite to mouse
    const bubble = document.querySelector('.main-bubble');
    if (bubble) {
        bubble.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
    }

    // Move projects differently for depth
    const projects = document.querySelectorAll('.project-card');
    projects.forEach((proj, index) => {
        const factor = (index % 2 === 0) ? 20 : -20;
        proj.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
});

// Reset transform on mouse leave to prevent getting stuck
document.addEventListener('mouseleave', () => {
    const bubble = document.querySelector('.main-bubble');
    if (bubble) {
        bubble.style.transform = `translate(0px, 0px)`;
    }
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(proj => {
        proj.style.transform = `translate(0px, 0px)`;
    });
});

// --- Scroll Reveal Animations & Depth Progress ---
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });

    // Calculate scroll progress for background depth
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? (scrollTop / maxScroll) : 0;
    // Cap progress between 0 and 1
    const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
    document.documentElement.style.setProperty('--scroll-progress', clampedProgress);
}

window.addEventListener('scroll', reveal);
// Trigger once on load
reveal();

// --- Audio Control ---
const bgMusic = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle');
const musicIcon = musicToggleBtn.querySelector('i');
const musicText = musicToggleBtn.querySelector('span');
let isPlaying = false;

// Set audio volume to be pleasant
bgMusic.volume = 0.4;

musicToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-volume-mute');
        musicText.textContent = 'Play Sound';
        musicToggleBtn.classList.remove('playing');
    } else {
        bgMusic.play().catch(error => {
            console.log('Audio playback failed', error);
        });
        musicIcon.classList.remove('fa-volume-mute');
        musicIcon.classList.add('fa-music');
        musicText.textContent = 'Pause Sound';
        musicToggleBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
});
// star-sprinkle cursor effect (replaces the old circular follower)
window.addEventListener('DOMContentLoaded', () => {
    // allow CSS animations to start
    document.body.classList.remove('not-loaded');

    let last = 0;
    document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - last < 16) return; // approx 60fps throttle
        last = now;

        // create 12-18 particles per move for a very thick 'powder' effect
        const count = Math.floor(Math.random() * 7) + 12;

        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'sparkle';

            // very small for a powder look (1.5px to 4px)
            const size = Math.random() * 2.5 + 1.5;
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;

            // vibrant various colors across the whole spectrum
            const h = Math.floor(Math.random() * 360);
            spark.style.setProperty('--h', `${h}`);

            // scatter effect variables
            const spreadX = (Math.random() - 0.5) * 70; // spread left/right up to 35px
            const spreadY = Math.random() * 80 + 50; // fall down 50px to 130px
            spark.style.setProperty('--tx', `${spreadX}px`);
            spark.style.setProperty('--ty', `${spreadY}px`);
            
            // randomized fade out time (even longer lasting to increase trail length)
            const duration = Math.random() * 1500 + 1000; // 1000ms - 2500ms
            spark.style.setProperty('--duration', `${duration}`);

            spark.style.left = `${e.clientX}px`;
            spark.style.top = `${e.clientY}px`;

            document.body.appendChild(spark);

            // cleanup
            spark.addEventListener('animationend', () => spark.remove(), { once: true });
        }
    });
});
