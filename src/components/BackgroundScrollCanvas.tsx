import React, { useEffect, useRef } from 'react';

const FRAME_COUNT = 300;

export const BackgroundScrollCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnIndexRef = useRef(-1);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Build image array & preload
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const pad = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${pad}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          resize();
          renderFrame(1);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    function drawImageCover(image: HTMLImageElement) {
      if (!canvas || !ctx || !image.complete || image.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;

      const r = Math.max(cw / iw, ch / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (cw - nw) * 0.5;
      const cy = (ch - nh) * 0.5;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, iw, ih, cx, cy, nw, nh);
    }

    function renderFrame(frameNumber: number) {
      const index = Math.max(0, Math.min(FRAME_COUNT - 1, frameNumber - 1));
      let img = imagesRef.current[index];

      // Fallback if current frame is not yet fully loaded
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < FRAME_COUNT; offset++) {
          const prev = imagesRef.current[index - offset];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            img = prev;
            break;
          }
          const next = imagesRef.current[index + offset];
          if (next && next.complete && next.naturalWidth > 0) {
            img = next;
            break;
          }
        }
      }

      if (img && img.complete && img.naturalWidth > 0) {
        drawImageCover(img);
        lastDrawnIndexRef.current = index;
      }
    }

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      if (lastDrawnIndexRef.current >= 0) {
        renderFrame(lastDrawnIndexRef.current + 1);
      }
    }

    function handleScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrollTop = window.scrollY || window.pageYOffset || 0;
        targetProgressRef.current = Math.max(0, Math.min(1, scrollTop / docHeight));
      }
    }

    const LERP = 0.09;
    function tick() {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * LERP;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const frameIndex = Math.min(
        FRAME_COUNT,
        Math.max(1, Math.round(currentProgressRef.current * (FRAME_COUNT - 1)) + 1)
      );

      if (frameIndex - 1 !== lastDrawnIndexRef.current) {
        renderFrame(frameIndex);
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    resize();
    handleScroll();
    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {/* Background Canvas with subtle blur */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover"
        style={{
          filter: 'blur(2.5px)',
          transform: 'scale(1.03)',
        }}
      />
      {/* Subtle obsidian glass dark vignette overlay so content is always high-contrast & legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/70 pointer-events-none" />
    </div>
  );
};
