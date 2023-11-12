document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll('[tlg-video-control^="video-"] video');
  const root = document.documentElement;

  /* Rate-limiting function for smoother execution at a specified frames-per-second (fps) */
  const rateLimit = (func, fps) => {
    let lastFunc;
    let lastRan;
    const interval = 1000 / fps;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if ((Date.now() - lastRan) >= interval) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, interval - (Date.now() - lastRan));
      }
    };
  };

  /* Handles the playback of the videos based on the observed CSS variable */
  const playback = (videoRef) => {
    let videoControlValue = root.style.getPropertyValue(videoRef.controlVariable).trim();
    if (!videoControlValue) {
      videoControlValue = getComputedStyle(root).getPropertyValue(videoRef.controlVariable).trim();
    }

    videoControlValue = parseFloat(videoControlValue.replace('%', ''));
    if (!isNaN(videoControlValue) && videoControlValue !== videoRef.lastControlValue && videoRef.video.readyState >= 1) {
      videoRef.lastControlValue = videoControlValue;
      const seekTime = videoRef.video.duration * (videoControlValue / 100);

      requestAnimationFrame(() => {
        videoRef.video.currentTime = Math.min(Math.max(seekTime, 0), videoRef.video.duration - 0.01);
      });
    }
  };
  /* Sets up necessary configurations for each video, and adds MutationObservers for tracking changes in the CSS variable */
  videos.forEach(video => {
    video.style.pointerEvents = "none";
    video.load();
    const videoParent = video.parentElement;
    const videoControl = videoParent.getAttribute('tlg-video-control');
    const videoIndex = videoControl.split('-')[1];
    const controlVariable = `--tlg--video-control-${videoIndex}`;

    // Retrieve the FPS from the attribute, or default to 30 if it's not available or not a number
    const fpsAttribute = videoParent.getAttribute('tlg-video-control-fps');
    const fpsValue = isNaN(parseInt(fpsAttribute)) ? 30 : parseInt(fpsAttribute);

    const videoRef = {
      video,
      controlVariable,
      lastControlValue: null
    };

    // Skip setting up the observer if the CSS variable is not found.
    if (!getComputedStyle(root).getPropertyValue(controlVariable).trim()) {
      console.error(`Error: Expected CSS variable "${controlVariable}" not found.`);
      return;
    }

    const rateLimitedPlayback = rateLimit(() => playback(videoRef), fpsValue);
    const observer = new MutationObserver(() => {
      rateLimitedPlayback();
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true
    });
  });
});