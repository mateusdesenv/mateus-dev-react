import { useEffect, useRef } from 'react';

const CELL_SIZE = 24;
const TRAIL_RADIUS = 2;
const FADE_PER_SECOND = 1.8;

function InteractiveGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!canvas || !context || reducedMotion || !finePointer) return undefined;

    const activeCells = new Map();
    let animationFrame = 0;
    let previousTime = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time) => {
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;
      context.clearRect(0, 0, width, height);

      activeCells.forEach((intensity, key) => {
        const nextIntensity = Math.max(0, intensity - FADE_PER_SECOND * delta);
        if (nextIntensity <= 0.01) {
          activeCells.delete(key);
          return;
        }

        activeCells.set(key, nextIntensity);
        const [column, row] = key.split(':').map(Number);
        const alpha = 0.08 + nextIntensity * 0.48;
        context.fillStyle = `rgba(47, 184, 65, ${alpha})`;
        context.fillRect(
          column * CELL_SIZE + 1,
          row * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2,
        );
      });

      if (activeCells.size) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        animationFrame = 0;
        previousTime = 0;
      }
    };

    const activateCell = (column, row, intensity) => {
      if (column < 0 || row < 0) return;
      const key = `${column}:${row}`;
      activeCells.set(key, Math.max(activeCells.get(key) || 0, intensity));
    };

    const handlePointerMove = (event) => {
      const centerColumn = Math.floor(event.clientX / CELL_SIZE);
      const centerRow = Math.floor(event.clientY / CELL_SIZE);

      for (let x = -TRAIL_RADIUS; x <= TRAIL_RADIUS; x += 1) {
        for (let y = -TRAIL_RADIUS; y <= TRAIL_RADIUS; y += 1) {
          const distance = Math.hypot(x, y);
          if (distance > TRAIL_RADIUS + 0.25) continue;
          const intensity = Math.max(0.16, 1 - distance / (TRAIL_RADIUS + 0.5));
          activateCell(centerColumn + x, centerRow + y, intensity);
        }
      }

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-grid" aria-hidden="true" />;
}

export default InteractiveGrid;
