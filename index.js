document.addEventListener('DOMContentLoaded', () => {
    const coverContainer = document.getElementById('cover-container');
    const videoWrapper = document.getElementById('video-wrapper');
    const introVideo = document.getElementById('intro-video');
    const mainVideo = document.getElementById('main-video');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const greetingCard = document.getElementById('greeting-card');
    const shareBtn = document.getElementById('share-btn');
    const tourBtn = document.getElementById('tour-btn');
    const videoToggle = document.getElementById('video-toggle');
    const vPlayIcon = document.getElementById('v-play-icon');
    const vPauseIcon = document.getElementById('v-pause-icon');
    
    // Tour Elements
    const tourOverlay = document.getElementById('tour-overlay');
    const tourCard = tourOverlay.querySelector('.tour-card');
    const tourTitle = document.getElementById('tour-title');
    const tourText = document.getElementById('tour-text');
    const tourNext = document.getElementById('tour-next');
    const tourPrev = document.getElementById('tour-prev');
    const tourClose = document.getElementById('tour-close');
    const spotlightHole = document.getElementById('spotlight-hole');
    const envelopeImg = document.getElementById('envelope');

    // --- Smart Asset Loading ---
    const assetMap = {
        'envelope': { base: 'sobrec', exts: ['png', 'webp', 'jpg', 'jpeg'] },
        'intro-video-source': { base: 'sobrev', exts: ['mp4', 'webm', 'mov'] },
        'main-video-source': { base: 'video', exts: ['mp4', 'webm', 'mov'] },
        'bg-music-source': { base: 'mañanitas', exts: ['mp3', 'wav', 'ogg'] }
    };

    async function initSmartAssets() {
        for (const [id, data] of Object.entries(assetMap)) {
            const el = document.getElementById(id);
            if (!el) continue;
            
            // Try each extension
            for (const ext of data.exts) {
                const testUrl = `${data.base}.${ext}`;
                try {
                    const response = await fetch(testUrl, { method: 'HEAD' });
                    if (response.ok) {
                        el.src = testUrl;
                        // If it's a source tag, we need to reload the parent
                        if (el.tagName === 'SOURCE') {
                            el.parentElement.load();
                        }
                        break;
                    }
                } catch (e) {
                    // Fallback to default if fetch fails (e.g. CORS or file not found)
                }
            }
        }
    }

    initSmartAssets();

    let isMusicPlaying = false;
    let isVideoPlaying = false;
    let currentStepIndex = -1;

    const tourSteps = [
        {
            target: 'cover-container',
            title: "Bienvenido",
            text: "Esta es una felicitación totalmente personalizable. Toca el sobre para descubrir la magia.",
            placement: 'bottom'
        },
        {
            target: 'video-wrapper',
            title: "Animación Exclusiva",
            text: "El diseño y la apertura del sobre son 100% editables para cualquier ocasión.",
            placement: 'center'
        },
        {
            target: 'video-toggle',
            title: "Mensaje de Felicitación",
            text: "Presiona este botón para reproducir o pausar tu mensaje de felicitación personalizado.",
            placement: 'left'
        },
        {
            target: 'music-toggle',
            title: "Control Musical",
            text: "Prueba a activar o pausar la música aquí. Es una pieza única para tu felicitación.",
            placement: 'left'
        },
        {
            target: 'share-btn',
            title: "Comparte la Alegría",
            text: "Usa este botón para enviar esta experiencia personalizada a quien tú quieras.",
            placement: 'left'
        }
    ];

    function updateSpotlight(targetEl) {
        if (!targetEl) {
            // Hide spotlight if no target
            spotlightHole.setAttribute('width', '0');
            spotlightHole.setAttribute('height', '0');
            return;
        }

        const rect = targetEl.getBoundingClientRect();
        const padding = 10;
        
        spotlightHole.setAttribute('x', rect.left - padding);
        spotlightHole.setAttribute('y', rect.top - padding);
        spotlightHole.setAttribute('width', rect.width + (padding * 2));
        spotlightHole.setAttribute('height', rect.height + (padding * 2));
        spotlightHole.setAttribute('rx', '12');
    }

    function positionCard(targetEl, placement) {
        if (!targetEl || placement === 'center') {
            tourCard.style.top = '50%';
            tourCard.style.left = '50%';
            tourCard.style.transform = 'translate(-50%, -50%)';
            return;
        }

        const rect = targetEl.getBoundingClientRect();
        let top, left;
        const margin = 20;

        if (placement === 'bottom') {
            top = rect.bottom + margin;
            left = rect.left + (rect.width / 2) - (tourCard.offsetWidth / 2);
        } else if (placement === 'left') {
            top = rect.top;
            left = rect.right + margin;
        }

        // Clamp to screen (Senior Polish: Ensuring visibility on all viewports)
        const screenMargin = 15;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Ensure left is within bounds
        left = Math.max(screenMargin, Math.min(left, viewportWidth - tourCard.offsetWidth - screenMargin));
        
        // Ensure top is within bounds and doesn't push the card off-bottom
        top = Math.max(screenMargin, Math.min(top, viewportHeight - tourCard.offsetHeight - screenMargin));

        // Fallback: If target is bottom and no space, place at top
        if (placement === 'bottom' && (top + tourCard.offsetHeight > viewportHeight)) {
            top = Math.max(screenMargin, rect.top - tourCard.offsetHeight - margin);
        }

        tourCard.style.top = `${top}px`;
        tourCard.style.left = `${left}px`;
        tourCard.style.transform = 'none';
    }

    function showStep(index) {
        if (index < 0 || index >= tourSteps.length) {
            closeTour();
            return;
        }

        currentStepIndex = index;
        const step = tourSteps[index];
        const targetEl = document.getElementById(step.target);

        tourTitle.textContent = step.title;
        tourText.textContent = step.text;
        
        tourOverlay.style.display = 'block';
        setTimeout(() => tourOverlay.classList.add('active'), 10);

        updateSpotlight(targetEl);
        positionCard(targetEl, step.placement);

        tourPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
        tourNext.textContent = index === tourSteps.length - 1 ? 'Finalizar' : 'Siguiente';
    }

    function closeTour() {
        tourOverlay.classList.remove('active');
        setTimeout(() => {
            tourOverlay.style.display = 'none';
            currentStepIndex = -1;
        }, 300);
    }

    // --- Interactive Logic ---

    // Start tour on load
    setTimeout(() => { if (currentStepIndex === -1) showStep(0); }, 1500);

    // Step 0 -> 1: Envelope Click
    coverContainer.addEventListener('click', async () => {
        if (currentStepIndex === 0) showStep(1);
        
        coverContainer.classList.add('hidden');
        videoWrapper.classList.add('visible');

        try {
            await introVideo.play();
            playMusic();
            mainVideo.load();
        } catch (error) { console.error("Play error:", error); }
    });

    // Step 1 -> 2: Auto transition mid-intro or after click
    introVideo.addEventListener('play', () => {
        if (currentStepIndex === 1) {
            setTimeout(() => { if (currentStepIndex === 1) showStep(2); }, 2500);
        }
    });

    // Step 2 -> 3: Intro Video Ends
    introVideo.addEventListener('ended', () => {
        fadeOutIn(introVideo, mainVideo);
        videoToggle.style.display = 'flex'; // Show the video control button
        // Sync with the actual start of the congratulatory message
        setTimeout(() => {
            if (currentStepIndex >= 0 && currentStepIndex <= 2) {
                showStep(2); // Show "Mensaje de Felicitación" step (video button)
            }
        }, 800);
    });

    // Control Buttons logic
    videoToggle.addEventListener('click', () => {
        if (mainVideo.paused) {
            mainVideo.play();
            isVideoPlaying = true;
            vPlayIcon.style.display = 'none';
            vPauseIcon.style.display = 'block';
        } else {
            mainVideo.pause();
            isVideoPlaying = false;
            vPlayIcon.style.display = 'block';
            vPauseIcon.style.display = 'none';
        }
        if (currentStepIndex === 2) {
            setTimeout(() => { showStep(3); }, 800);
        }
    });

    // Step 3 -> 4: Music toggle interaction
    musicToggle.addEventListener('click', () => {
        isMusicPlaying ? pauseMusic() : playMusic();
        if (currentStepIndex === 3) {
            setTimeout(() => { showStep(4); }, 1000);
        }
    });

    // Navigation
    tourNext.addEventListener('click', () => showStep(currentStepIndex + 1));
    tourPrev.addEventListener('click', () => showStep(currentStepIndex - 1));
    tourClose.addEventListener('click', closeTour);
    tourBtn.addEventListener('click', () => showStep(0));

    // Audio & Transitions
    function playMusic() {
        bgMusic.volume = (introVideo.paused && mainVideo.paused) ? 1.0 : 0.15;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }).catch(() => console.log("Music blocked"));
    }

    function pauseMusic() {
        bgMusic.pause();
        isMusicPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }

    function fadeOutIn(oldVid, newVid) {
        oldVid.style.display = 'none';
        newVid.style.display = 'block';
        requestFullScreen(newVid);
        newVid.play().then(() => {
            isVideoPlaying = true;
            vPlayIcon.style.display = 'none';
            vPauseIcon.style.display = 'block';
            setTimeout(() => { greetingCard.style.opacity = '1'; }, 5000);
        }).catch(() => {
            isVideoPlaying = false;
            vPlayIcon.style.display = 'block';
            vPauseIcon.style.display = 'none';
            console.log("Video fail");
        });
    }

    function requestFullScreen(element) {
        try {
            if (element.requestFullscreen) element.requestFullscreen().catch(() => {});
            else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        } catch (e) {}
    }

    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'Felicitación Especial',
            text: '¡Mira esta felicitación personalizada!',
            url: window.location.href
        };
        try {
            if (navigator.share) await navigator.share(shareData);
            else {
                alert('Copiado al portapapeles: ' + window.location.href);
                navigator.clipboard.writeText(window.location.href);
            }
            if (currentStepIndex === 4) closeTour();
        } catch (err) { console.error('Share error', err); }
    });

    // Handle window resize for spotlight
    window.addEventListener('resize', () => {
        if (currentStepIndex >= 0) {
            const step = tourSteps[currentStepIndex];
            const targetEl = document.getElementById(step.target);
            updateSpotlight(targetEl);
            positionCard(targetEl, step.placement);
        }
    });
});

