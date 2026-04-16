document.addEventListener('DOMContentLoaded', () => {
    const coverContainer = document.getElementById('cover-container');
    const videoWrapper = document.getElementById('video-wrapper');
    const introVideo = document.getElementById('intro-video');
    const mainVideo = document.getElementById('main-video');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

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
            // Fallback: user interaction might be needed for audio too
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

    /**
     * Smoothly transitions from one video to another
     * @param {HTMLVideoElement} oldVid 
     * @param {HTMLVideoElement} newVid 
     */
    function fadeOutIn(oldVid, newVid) {
        // Show current video fade out if we had a layer, 
        // but since they are stacked, we can just switch them.
        
        oldVid.style.display = 'none';
        newVid.style.display = 'block';
        
        // Try to enter fullscreen for the main video
        requestFullScreen(newVid);

        newVid.play().catch(e => console.log("Main video play blocked:", e));
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
