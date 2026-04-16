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

    let isMusicPlaying = false;

    // Handle Cover Click
    coverContainer.addEventListener('click', async () => {
        // 1. Fade out the cover
        coverContainer.classList.add('hidden');
        
        // 2. Prepare the video wrapper
        videoWrapper.classList.add('visible');

        try {
            // 3. Start playing the intro video
            await introVideo.play();
            
            // 4. Start Background Music
            playMusic();
        } catch (error) {
            console.error("Interaction play failed:", error);
        }
    });

    // Music Toggle Logic
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    function playMusic() {
        // Set volume to a lower level if a video is playing (ducking)
        bgMusic.volume = (introVideo.paused && mainVideo.paused) ? 1.0 : 0.15;
        
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }).catch(e => console.log("Music play blocked:", e));
    }

    function pauseMusic() {
        bgMusic.pause();
        isMusicPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }

    // Handle Transitions between videos
    introVideo.addEventListener('ended', () => {
        // Transition to main video
        fadeOutIn(introVideo, mainVideo);
    });

    // Helper to lower volume during video playback
    const duckAudio = () => {
        if (isMusicPlaying) bgMusic.volume = 0.15;
    };

    introVideo.addEventListener('play', duckAudio);
    mainVideo.addEventListener('play', duckAudio);

    /**
     * Smoothly transitions from one video to another
     * @param {HTMLVideoElement} oldVid 
     * @param {HTMLVideoElement} newVid 
     */
    function fadeOutIn(oldVid, newVid) {
        oldVid.style.display = 'none';
        newVid.style.display = 'block';
        
        // Try to enter fullscreen for the main video
        requestFullScreen(newVid);

        newVid.play().then(() => {
            // Show Greeting Card with 5 second delay over main video
            setTimeout(() => {
                greetingCard.style.opacity = '1';
            }, 5000);
        }).catch(e => console.log("Main video play blocked:", e));
    }

    /**
     * Requests fullscreen mode for an element
     * @param {Element} element 
     */
    function requestFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
            element.msRequestFullscreen();
        }
    }
});
