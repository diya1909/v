document.addEventListener('DOMContentLoaded', () => {
    // Hidden Note Reveal
    const revealBtn = document.getElementById('revealBtn');
    const secretMessage = document.getElementById('secretMessage');

    revealBtn.addEventListener('click', () => {
        secretMessage.classList.remove('hidden');
        revealBtn.textContent = "I knew you knew! 😉";
        revealBtn.disabled = true; // Accessibility improvement
        confettiEffect();
    });



    // Scroll Fade Effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-on-scroll').forEach(section => {
        observer.observe(section);
    });

    // Floating Hearts Generation
    const heartsContainer = document.getElementById('floatingHearts');
    const heartSymbols = ['❤️', '💖', '💕', '🥰', '✨'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 5 + 10) + 's';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 15000); // Remove after animation
    }

    setInterval(createHeart, 800);

    // Simple confetti burst for the button click
    function confettiEffect() {
        const count = 50;
        const buttonRect = revealBtn.getBoundingClientRect();

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = '💖';
            confetti.style.position = 'fixed';
            confetti.style.left = (buttonRect.left + buttonRect.width / 2) + 'px';
            confetti.style.top = (buttonRect.top) + 'px';
            confetti.style.fontSize = '1.5rem';
            confetti.style.pointerEvents = 'none';
            confetti.style.transition = 'all 1s ease-out';

            document.body.appendChild(confetti);

            // Randomize direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 200 + 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 100; // slightly upward

            // Trigger animation in next frame
            requestAnimationFrame(() => {
                confetti.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg)`;
                confetti.style.opacity = '0';
            });

            setTimeout(() => confetti.remove(), 1000);
        }
    }

    // --- Story Sequence Logic ---
    const storySection = document.getElementById('story-sequence');
    const scenes = document.querySelectorAll('.scene');
    let storyPlayed = false;

    if (storySection) {
        const storyObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !storyPlayed) {
                storyPlayed = true;
                storySection.classList.add('visible');
                playStory();
            }
        }, { threshold: 0.5 });

        storyObserver.observe(storySection);
    }

    function playStory() {
        const sceneDurations = [5000, 6000, 7000, 7000];
        const sceneBackgrounds = ['bg-scene-1', 'bg-scene-2', 'bg-scene-3', 'bg-scene-end'];
        const sceneParticles = [
            ['📩', '✉️', '✨'],
            ['😂', '❤️', '💬', '💖'],
            ['✨', '🌟', '💫', '💖'],
            ['💖', '💕', '🥰', '✨']
        ];

        let currentScene = 0;
        let particleInterval;

        function startParticles(emojis) {
            if (particleInterval) clearInterval(particleInterval);
            particleInterval = setInterval(() => {
                createParticle(emojis);
            }, 400);
        }

        function createParticle(emojis) {
            const particle = document.createElement('div');
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.position = 'absolute';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '-50px';
            particle.style.fontSize = (Math.random() * 20 + 20) + 'px';
            particle.style.opacity = '0.6';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';
            particle.style.transition = `all ${(Math.random() * 4 + 4)}s linear`;

            storySection.appendChild(particle);

            requestAnimationFrame(() => {
                particle.style.transform = `translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
                particle.style.opacity = '0';
            });

            setTimeout(() => particle.remove(), 8000);
        }

        function showScene(index) {
            // Handle Exit Animation for previous scene
            if (index > 0) {
                scenes[index - 1].classList.remove('active');
                scenes[index - 1].classList.add('exit');
            }

            // Update Background Class
            storySection.className = 'story-container visible ' + sceneBackgrounds[index];

            // Show current scene
            if (scenes[index]) {
                scenes[index].classList.add('active');
                startParticles(sceneParticles[index]);

                const texts = scenes[index].querySelectorAll('.story-text p');
                texts.forEach((p, i) => {
                    p.style.transitionDelay = `${i * 1.5}s`;
                });

                // Special Interaction for Scene 1 (Bubbles)
                if (index === 0) {
                    const bubbles = scenes[index].querySelectorAll('.bubble');
                    bubbles.forEach(bubble => {
                        bubble.addEventListener('click', () => {
                            // Mini burst on click
                            for (let i = 0; i < 5; i++) createParticle(['✨', '❤️']);
                            bubble.style.display = 'none';
                        });
                    });
                }
            }

            if (index < scenes.length - 1) {
                setTimeout(() => {
                    showScene(index + 1);
                }, sceneDurations[index]);
            } else {
                // Keep final particles for the end scene
                setTimeout(() => clearInterval(particleInterval), 10000);
            }
        }

        showScene(0);
    }
});

