document.addEventListener('DOMContentLoaded', () => {
    const coverContainer = document.getElementById('cover-container');
    const videoWrapper = document.getElementById('video-wrapper');
    const introVideo = document.getElementById('intro-video');
    const mainVideo = document.getElementById('main-video');

    // Handle Cover Click
    coverContainer.addEventListener('click', async () => {
        // 1. Fade out the cover
        coverContainer.classList.add('hidden');
        
        // 2. Prepare the video wrapper
        videoWrapper.classList.add('visible');

        try {
            // 3. Start playing the intro video
            // Browsers usually require a user interaction to play video with sound
            await introVideo.play();
        } catch (error) {
            console.error("Video play failed:", error);
            // Fallback: try muted
            introVideo.muted = true;
            introVideo.play();
        }
    });

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
