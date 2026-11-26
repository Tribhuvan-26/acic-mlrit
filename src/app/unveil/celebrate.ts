/* Party poppers and confetti cannons, built on canvas-confetti, in the site palette.
   Sparkles are CSS (Unveil.tsx), so they stay crisp instead of tumbling grey. */

import confetti from "canvas-confetti";

const COLORS = ["#e8521a", "#ff7a3d", "#ffb38a", "#ffffff", "#e9ebef", "#fff3ec", "#c2410c"];

export type Cannons = { fire: () => void; stop: () => void };

export function makeCannons(canvas: HTMLCanvasElement): Cannons {
  const shoot = confetti.create(canvas, { resize: true, useWorker: true });
  const timers: number[] = [];

  const fire = () => {
    const k = window.innerWidth < 600 ? 0.5 : window.innerWidth < 1024 ? 0.75 : 1;
    const n = (x: number) => Math.round(x * k);
    const base = { colors: COLORS, ticks: 320, gravity: 0.95, decay: 0.92, disableForReducedMotion: true };
    const at = (ms: number, f: () => void) => timers.push(window.setTimeout(f, ms));

    // outward blast from the orb
    shoot({ ...base, particleCount: n(170), spread: 360, startVelocity: 48, origin: { x: 0.5, y: 0.5 }, scalar: 0.9 });

    // party poppers from both sides
    at(120, () => {
      shoot({ ...base, particleCount: n(90), angle: 55, spread: 50, startVelocity: 62, origin: { x: 0, y: 0.62 } });
      shoot({ ...base, particleCount: n(90), angle: 125, spread: 50, startVelocity: 62, origin: { x: 1, y: 0.62 } });
    });
    // cannons from the bottom corners, twice
    [260, 900].forEach((d) => at(d, () => {
      shoot({ ...base, particleCount: n(110), angle: 66, spread: 38, startVelocity: 78, origin: { x: 0, y: 1.02 } });
      shoot({ ...base, particleCount: n(110), angle: 114, spread: 38, startVelocity: 78, origin: { x: 1, y: 1.02 } });
    }));
    // light, continuous fall for a few seconds
    const end = performance.now() + 3200;
    const fall = () => {
      shoot({ ...base, particleCount: Math.max(1, n(3)), startVelocity: 0, gravity: 0.6, ticks: 420, origin: { x: Math.random(), y: -0.05 }, scalar: 0.9 });
      if (performance.now() < end) timers.push(window.setTimeout(fall, 60));
    };
    at(1300, fall);
  };

  return {
    fire,
    stop: () => { timers.forEach(clearTimeout); timers.length = 0; shoot.reset(); },
  };
}
