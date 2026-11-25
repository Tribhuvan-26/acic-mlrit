/* Small canvas particle engine: confetti, streamers and stars for poppers, bursts and rain. */

const COLORS = ["#e8521a", "#ff8a3d", "#ffd166", "#fdf6e8", "#ff5d8f", "#3ec1d3", "#8ac926", "#ffb703"];

type Shape = "rect" | "dot" | "streamer" | "star";
type Particle = {
  x: number; y: number; vx: number; vy: number; rot: number; vr: number;
  w: number; h: number; color: string; shape: Shape; g: number; drag: number; t: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: readonly T[]) => a[(Math.random() * a.length) | 0];
const shapeRoll = (): Shape => {
  const r = Math.random();
  return r < 0.62 ? "rect" : r < 0.8 ? "dot" : r < 0.92 ? "streamer" : "star";
};

export class Confetti {
  private ctx: CanvasRenderingContext2D | null;
  private parts: Particle[] = [];
  private raf = 0;
  private last = 0;
  private rainUntil = 0;
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

  private get scale() { return this.W < 600 ? 0.55 : 1; }

  private add(x: number, y: number, angle: number, spread: number, speed: [number, number], n: number) {
    for (let i = 0; i < Math.round(n * this.scale); i++) {
      const a = angle + rand(-spread, spread);
      const s = rand(speed[0], speed[1]);
      const shape = shapeRoll();
      this.parts.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, rot: rand(0, 6.28), vr: rand(-0.3, 0.3),
        w: shape === "streamer" ? rand(30, 60) : rand(6, 13), h: shape === "streamer" ? 3 : rand(4, 9),
        color: pick(COLORS), shape, g: shape === "streamer" ? 0.18 : 0.26, drag: shape === "streamer" ? 0.975 : 0.984, t: rand(0, 60),
      });
    }
    this.start();
  }

  /* Party popper fired from the left or right edge, up and inward. */
  popper(side: "left" | "right") {
    const left = side === "left";
    const x = left ? -10 : this.W + 10, y = this.H * 0.78;
    const angle = left ? -Math.PI / 3.2 : -Math.PI + Math.PI / 3.2;
    const v = Math.max(16, Math.min(28, this.W / 50));
    this.add(x, y, angle, 0.38, [v * 0.55, v * 1.1], 170);
  }

  /* Round burst from a point (the centre explosion). */
  burst(x = this.W / 2, y = this.H * 0.45) {
    this.add(x, y, 0, Math.PI, [6, 20], 260);
  }

  /* Gentle confetti falling from the top for `ms` milliseconds. */
  rain(ms: number) {
    this.rainUntil = performance.now() + ms;
    this.start();
  }

  /* The whole reveal: centre blast, poppers both sides in waves, then a continuous fall. */
  celebrate() {
    this.burst();
    [0, 380, 760].forEach((d, i) => this.timers.push(window.setTimeout(() => {
      this.popper("left"); this.popper("right");
      if (i === 2) this.rain(4200);
    }, d)));
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

    if (now < this.rainUntil) {
      for (let i = 0; i < 3 * this.scale + 1; i++) {
        const shape = Math.random() < 0.85 ? "rect" : "dot";
        this.parts.push({
          x: rand(0, this.W), y: -20, vx: rand(-1, 1), vy: rand(2, 4), rot: rand(0, 6.28), vr: rand(-0.15, 0.15),
          w: rand(6, 11), h: rand(4, 8), color: pick(COLORS), shape, g: 0.05, drag: 0.99, t: rand(0, 60),
        });
      }
    }

    ctx.clearRect(0, 0, this.W, this.H);
    for (const p of this.parts) {
      p.vy += p.g * k;
      const d = Math.pow(p.drag, k);
      p.vx *= d; p.vy *= d;
      p.t += k;
      p.x += (p.vx + Math.sin(p.t / 10) * 0.7) * k;
      p.y += p.vy * k;
      p.rot += p.vr * k;
      this.draw(ctx, p);
    }
    this.parts = this.parts.filter((p) => p.y < this.H + 60 && p.x > -200 && p.x < this.W + 200);

    if (this.parts.length || now < this.rainUntil) this.raf = requestAnimationFrame(this.tick);
    else { this.raf = 0; ctx.clearRect(0, 0, this.W, this.H); }
  };

  private draw(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color; ctx.strokeStyle = p.color;
    if (p.shape === "rect") {
      ctx.scale(1, Math.cos(p.t / 6));
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else if (p.shape === "dot") {
      ctx.beginPath(); ctx.arc(0, 0, p.w / 2.5, 0, Math.PI * 2); ctx.fill();
    } else if (p.shape === "streamer") {
      ctx.lineWidth = p.h; ctx.lineCap = "round"; ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const x = (i / 12 - 0.5) * p.w, y = Math.sin(i * 0.9 + p.t / 4) * 5;
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    } else {
      const r = p.w / 1.6;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rr = i % 2 ? r * 0.35 : r, a = (i * Math.PI) / 4;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  stop() {
    cancelAnimationFrame(this.raf); this.raf = 0;
    this.timers.forEach(clearTimeout); this.timers = [];
    this.parts = []; this.rainUntil = 0;
    this.ctx?.clearRect(0, 0, this.W, this.H);
  }
}
