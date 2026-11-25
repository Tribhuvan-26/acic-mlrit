/* Canvas confetti engine: brand orange / white / silver confetti cannons from the bottom corners,
   bursts across the screen and a gentle natural fall. Each piece flips between a light and
   dark shade of its metal as it tumbles, which reads as a metallic glint. */

const METALS: readonly [string, string][] = [
  ["#ff7a3d", "#c2410c"], // brand orange
  ["#ffb38a", "#e8521a"], // light orange
  ["#fff3ec", "#f0c9b3"], // orange tint
  ["#ffffff", "#c9ccd3"], // white / silver
  ["#ff9a66", "#a8350b"], // deep orange
  ["#5b6170", "#2b2d34"], // ink grey
];
const WEIGHTS = [0.3, 0.2, 0.14, 0.2, 0.1, 0.06];

type Shape = "rect" | "strip" | "dot" | "spark";
type Particle = {
  x: number; y: number; vx: number; vy: number; rot: number; vr: number; w: number; h: number;
  c: [string, string]; shape: Shape; g: number; drag: number; t: number; flip: number; life: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
function metal(): [string, string] {
  let r = Math.random();
  for (let i = 0; i < METALS.length; i++) { r -= WEIGHTS[i]; if (r <= 0) return METALS[i]; }
  return METALS[0];
}
function shape(): Shape {
  const r = Math.random();
  return r < 0.58 ? "rect" : r < 0.8 ? "strip" : r < 0.92 ? "dot" : "spark";
}

export class Confetti {
  private ctx: CanvasRenderingContext2D | null;
  private parts: Particle[] = [];
  private raf = 0;
  private last = 0;
  private fallUntil = 0;
  private timers: number[] = [];
  private W = 0;
  private H = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = window.innerWidth; this.H = window.innerHeight;
    this.canvas.width = this.W * dpr; this.canvas.height = this.H * dpr;
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private get k() { return this.W < 600 ? 0.5 : this.W < 1024 ? 0.75 : 1; }

  private emit(x: number, y: number, angle: number, spread: number, speed: [number, number], n: number) {
    for (let i = 0; i < Math.round(n * this.k); i++) {
      const a = angle + rand(-spread, spread), s = rand(speed[0], speed[1]), sh = shape();
      this.parts.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, rot: rand(0, 6.28), vr: rand(-0.25, 0.25),
        w: sh === "strip" ? rand(14, 22) : sh === "spark" ? rand(5, 9) : rand(7, 12),
        h: sh === "strip" ? rand(3, 4.5) : rand(4, 8),
        c: metal(), shape: sh, g: sh === "spark" ? 0.12 : 0.24, drag: sh === "strip" ? 0.982 : 0.986,
        t: 0, flip: rand(4, 9), life: 0,
      });
    }
    this.start();
  }

  /* Confetti cannon from a bottom corner, aimed up and inward. */
  cannon(side: "left" | "right") {
    const left = side === "left";
    const x = left ? 0 : this.W, y = this.H + 10;
    const angle = left ? -Math.PI / 2 + 0.42 : -Math.PI / 2 - 0.42;
    const v = Math.min(34, Math.max(20, this.H / 26));
    this.emit(x, y, angle, 0.22, [v * 0.7, v * 1.15], 150);
  }

  /* Small airborne burst, like a shell opening. */
  burst(x: number, y: number, n = 60) {
    this.emit(x, y, 0, Math.PI, [3, 11], n);
  }

  /* Pieces drifting down from the top for `ms`. */
  fall(ms: number) { this.fallUntil = performance.now() + ms; this.start(); }

  celebrate() {
    this.cannon("left"); this.cannon("right");
    const at = (ms: number, fn: () => void) => this.timers.push(window.setTimeout(fn, ms));
    at(420, () => { this.burst(this.W * 0.28, this.H * 0.28); this.burst(this.W * 0.72, this.H * 0.24); });
    at(800, () => { this.cannon("left"); this.cannon("right"); });
    at(1150, () => { this.burst(this.W * 0.5, this.H * 0.18, 70); this.fall(3200); });
  }

  private start() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const ctx = this.ctx;
    if (!ctx) return;
    const k = Math.min(3, (now - this.last) / 16.67);
    this.last = now;

    if (now < this.fallUntil && Math.random() < 0.9) {
      for (let i = 0; i < Math.max(1, Math.round(2 * this.k)); i++) {
        const sh = Math.random() < 0.75 ? "rect" : "strip";
        this.parts.push({
          x: rand(0, this.W), y: -16, vx: rand(-0.6, 0.6), vy: rand(1.5, 3), rot: rand(0, 6.28), vr: rand(-0.12, 0.12),
          w: sh === "strip" ? rand(14, 20) : rand(7, 11), h: sh === "strip" ? 3.5 : rand(4, 7),
          c: metal(), shape: sh, g: 0.03, drag: 0.992, t: rand(0, 50), flip: rand(5, 9), life: 0,
        });
      }
    }

    ctx.clearRect(0, 0, this.W, this.H);
    for (const p of this.parts) {
      p.vy += p.g * k;
      const d = Math.pow(p.drag, k);
      p.vx *= d; p.vy *= d;
      // terminal velocity + air flutter, so pieces settle into a natural drift
      if (p.vy > 4.2) p.vy = 4.2;
      p.t += k; p.life += k;
      p.x += (p.vx + Math.sin(p.t / 14) * 0.6) * k;
      p.y += p.vy * k;
      p.rot += p.vr * k;
      this.draw(ctx, p);
    }
    this.parts = this.parts.filter((p) => p.y < this.H + 40 && p.x > -120 && p.x < this.W + 120 && (p.shape !== "spark" || p.life < 140));

    if (this.parts.length || now < this.fallUntil) this.raf = requestAnimationFrame(this.tick);
    else { this.raf = 0; ctx.clearRect(0, 0, this.W, this.H); }
  };

  private draw(ctx: CanvasRenderingContext2D, p: Particle) {
    const face = Math.cos(p.t / p.flip);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = face > 0 ? p.c[0] : p.c[1];
    if (p.shape === "rect" || p.shape === "strip") {
      ctx.scale(1, Math.max(0.08, Math.abs(face)));
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else if (p.shape === "dot") {
      ctx.beginPath(); ctx.arc(0, 0, p.h / 2, 0, Math.PI * 2); ctx.fill();
    } else {
      // sparkle: thin four-point star that twinkles and fades
      ctx.globalAlpha = Math.max(0, 1 - p.life / 140) * (0.55 + 0.45 * Math.abs(Math.sin(p.t / 4)));
      ctx.fillStyle = "#fff3ec";
      const r = p.w;
      ctx.beginPath();
      ctx.moveTo(0, -r); ctx.lineTo(r * 0.18, -r * 0.18); ctx.lineTo(r, 0); ctx.lineTo(r * 0.18, r * 0.18);
      ctx.lineTo(0, r); ctx.lineTo(-r * 0.18, r * 0.18); ctx.lineTo(-r, 0); ctx.lineTo(-r * 0.18, -r * 0.18);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  stop() {
    cancelAnimationFrame(this.raf); this.raf = 0;
    this.timers.forEach(clearTimeout); this.timers = [];
    this.parts = []; this.fallUntil = 0;
    this.ctx?.clearRect(0, 0, this.W, this.H);
  }
}
