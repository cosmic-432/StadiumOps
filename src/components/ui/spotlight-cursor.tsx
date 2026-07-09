'use client';
import { useRef, useEffect, HTMLAttributes } from 'react';

interface SpotlightConfig {
  radius?: number;
  brightness?: number;
  color?: string | string[];
  smoothing?: number;
}

const useSpotlightEffect = (config: SpotlightConfig) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const hexToRgb = (hex: string) => {
      let cleanHex = hex.replace('#', '');
      if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('');
      }
      const bigint = parseInt(cleanHex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r},${g},${b}`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouseX !== -1000 && mouseY !== -1000) {
        const gradient = ctx.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, config.radius || 250
        );

        const colors = Array.isArray(config.color)
          ? config.color
          : [config.color || '#f472b6', '#38bdf8', '#34d399'];

        colors.forEach((col, idx) => {
          const rgb = hexToRgb(col);
          const stop = colors.length === 1 ? 0 : idx / (colors.length - 1);
          const brightness = config.brightness || 0.15;
          const alpha = brightness * (1 - stop * 0.5);
          gradient.addColorStop(stop, `rgba(${rgb}, ${Math.max(0, alpha)})`);
        });
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config.radius, config.brightness, config.color]);

  return canvasRef;
};

interface ComponentProps extends HTMLAttributes<HTMLCanvasElement> {
  config?: SpotlightConfig;
  className?: string;
}

export const Component = ({
  config = {},
  className,
  ...rest
}: ComponentProps) => {
  const spotlightConfig = {
    radius: 200,
    brightness: 0.15,
    color: '#ffffff',
    smoothing: 0.1,
    ...config,
  };

  const canvasRef = useSpotlightEffect(spotlightConfig);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] w-full h-full ${className}`}
      {...rest}
    />
  );
};
