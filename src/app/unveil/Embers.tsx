"use client";

import { useEffect, useRef } from "react";

/* Slow, glowing specks drifting upward behind the intro. `speed` lets the countdown stir them up. */
export default function Embers({ className, speed = 1 }: { className?: string; speed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // one pre-rendered glow sprite, reused for every speck (cheaper than shadowBlur)
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const s = sprite.getContext("2d")!;
    const grad = s.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,214,170,1)");
    grad.addColorStop(0.25, "rgba(255,140,60,.75)");
    grad.addColorStop(1, "rgba(232,82,26,0)");
    s.fillStyle = grad; s.fillRect(0, 0, 32, 32);

    const n = W < 600 ? 34 : 70;
    const dots = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: 4 + Math.random() * 12,
      v: 0.15 + Math.random() * 0.45, ph: Math.random() * 6.28, a: 0.25 + Math.random() * 0.6,
    }));

    let raf = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        if (!still) {
          d.y -= d.v * speedRef.current;
          d.x += Math.sin(t / 2200 + d.ph) * 0.25;
          if (d.y < -20) { d.y = H + 20; d.x = Math.random() * W; }
        }
        ctx.globalAlpha = d.a * (0.6 + 0.4 * Math.sin(t / 900 + d.ph));
        ctx.drawImage(sprite, d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
