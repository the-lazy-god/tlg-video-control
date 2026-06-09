document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll('[tlg-video-control]');
  const root = document.documentElement;

  const rootComputedStyle = getComputedStyle(root);
  const INTERVAL = 1000 / 30; // 30 FPS

  const refs = [];
  elements.forEach(element => {
    // Use the element itself if it's a <video>, otherwise find the video child inside it
    const video = element.tagName === 'VIDEO' ? element : element.querySelector('video');
    if (!video) {
      console.error('Error: No <video> element found for', element);
      return;
    }

    // Get the CSS variable name from the attribute
    const raw = element.getAttribute('tlg-video-control');
    const match = raw && raw.match(/--[\w-]+/); // Read the raw variable name with regex
    if (!match) {
      console.error('Error: No CSS custom property found in attribute', raw, element);
      return;
    }
    const controlVariable = match[0];

    video.style.pointerEvents = "none";
    
    video.loop = false;
    video.load();

    // Throw an error if the CSS variable is not found
    if (!rootComputedStyle.getPropertyValue(controlVariable).trim()) {
      console.error(`Error: CSS variable "${controlVariable}" not found. Make sure it is defined and initialized.`);
      return;
    }

    refs.push({
      video,
      controlVariable,
      lastControlValue: null,
      pendingTime: NaN
    });
  });

  if (!refs.length) return;

  // Single batched update for the whole frame: read all variables, then write all currentTimes.
  let scheduled = false;
  let lastApplied = 0;

  const flush = () => {
    scheduled = false;
    const now = performance.now();

    // Cap at 30 FPS. If a fresh value arrives while gated, keep a frame scheduled
    if (now - lastApplied < INTERVAL) {
      scheduled = true;
      requestAnimationFrame(flush);
      return;
    }
    lastApplied = now;

    // Resolve each video's target seek time.
    for (const ref of refs) {
      // Read the value of the CSS variable on the root element
      const percent = parseFloat(root.style.getPropertyValue(ref.controlVariable));
      if (isNaN(percent) || percent === ref.lastControlValue || ref.video.readyState < 1) {
        continue;
      }

      ref.lastControlValue = percent;
      const seekTime = ref.video.duration * (percent / 100);
      ref.pendingTime = Math.min(Math.max(seekTime, 0), ref.video.duration);
    }

    // Apply the resolved seek times.
    for (const ref of refs) {
      if (!isNaN(ref.pendingTime)) {
        ref.video.currentTime = ref.pendingTime;
        ref.pendingTime = NaN;
      }
    }
  };

  // Observe the root element for style changes
  const observer = new MutationObserver(() => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  });
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['style']
  });
});
