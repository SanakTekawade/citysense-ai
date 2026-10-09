(function () {
  const FRAME_COUNT = 300;
  const canvas = document.getElementById("animation-canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const loader = document.getElementById("loader");
  const loaderProgress = document.getElementById("loader-progress");
  const scrollContainer = document.getElementById("scroll-container");

  const images = [];
  let loadedCount = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let lastDrawnIndex = -1;
  const LERP_FACTOR = 0.08; // Smooth inertia damping

  // Pad numbers to 3 digits (e.g. 1 -> 001)
  const currentFrameUrl = (index) => {
    const padIndex = String(index).padStart(3, "0");
    return `./frames/ezgif-frame-00${padIndex}.jpg`.replace(/00(\d{3})/, "$1");
  };

  function getFramePath(index) {
    const pad = String(index).padStart(3, "0");
    return `./frames/ezgif-frame-${pad}.jpg`;
  }

  // Preload all frames
  function preloadImages() {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        const percent = Math.round((loadedCount / FRAME_COUNT) * 100);
        if (loaderProgress) {
          loaderProgress.style.width = `${percent}%`;
        }

        // When initial critical frames are ready, render first frame and hide loader
        if (loadedCount === 1) {
          resizeCanvas();
          renderFrame(1);
        }

        if (loadedCount >= Math.min(20, FRAME_COUNT)) {
          if (loader && !loader.classList.contains("loaded")) {
            loader.classList.add("loaded");
          }
        }
      };
      img.onerror = () => {
        loadedCount++;
      };
      images.push(img);
    }
  }

  // Cover fit drawing
  function drawImageProp(ctx, img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const r = Math.max(cw / iw, ch / ih);
    const nw = iw * r;
    const nh = ih * r;
    const cx = (cw - nw) * 0.5;
    const cy = (ch - nh) * 0.5;

    ctx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh);
  }

  function renderFrame(frameNumber) {
    const index = Math.max(0, Math.min(FRAME_COUNT - 1, frameNumber - 1));
    let img = images[index];

    // Fallback to nearest loaded frame if current frame hasn't loaded yet
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const prev = images[index - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = images[index + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      drawImageProp(ctx, img);
      lastDrawnIndex = index;
    }
  }

  // Handle Resize & DPR
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    if (lastDrawnIndex >= 0) {
      renderFrame(lastDrawnIndex + 1);
    }
  }

  // Calculate target scroll progress
  function onScroll() {
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      targetProgress = Math.max(0, Math.min(1, scrollTop / maxScroll));
    }
  }

  // Smooth animation loop
  function tick() {
    // Lerp progress for ultra-smooth fluid motion
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * LERP_FACTOR;
    } else {
      currentProgress = targetProgress;
    }

    const frameIndex = Math.min(
      FRAME_COUNT,
      Math.max(1, Math.round(currentProgress * (FRAME_COUNT - 1)) + 1)
    );

    if (frameIndex - 1 !== lastDrawnIndex) {
      renderFrame(frameIndex);
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", resizeCanvas);

  // Initialize
  preloadImages();
  resizeCanvas();
  onScroll();
  requestAnimationFrame(tick);
})();
