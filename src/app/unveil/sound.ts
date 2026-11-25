/* Cinematic Web Audio sounds, synthesized (no files). The context is created on the first click,
   so browsers allow playback. Everything goes through one master gain for mute. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let riser: { src: AudioBufferSourceNode; gain: GainNode } | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noise(a: AudioContext, seconds: number) {
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * seconds), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/* Call inside the click handler to unlock audio. */
export function unlockAudio() { audio(); }

export function setMuted(muted: boolean) {
  if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : 0.9, ctx.currentTime, 0.05);
}

/* Deep cinematic hit for each countdown number. `level` 0..1 makes later numbers heavier. */
export function boom(level = 0) {
  const a = audio();
  if (!a || !master) return;
  const t = a.currentTime;

  // sub drop
  const o = a.createOscillator(), g = a.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(70 + level * 20, t);
  o.frequency.exponentialRampToValueAtTime(34, t + 0.9);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.55 + level * 0.25, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + 1.2);

  // soft body thump (low-passed noise)
  const n = a.createBufferSource(), f = a.createBiquadFilter(), ng = a.createGain();
  n.buffer = noise(a, 0.4);
  f.type = "lowpass"; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(120, t + 0.3);
  ng.gain.setValueAtTime(0.35, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  n.connect(f).connect(ng).connect(master);
  n.start(t);

  // faint metallic ring that brightens as the count goes on
  const r = a.createOscillator(), rg = a.createGain();
  r.type = "triangle"; r.frequency.value = 220 * (1 + level);
  rg.gain.setValueAtTime(0.0001, t);
  rg.gain.exponentialRampToValueAtTime(0.05 + level * 0.05, t + 0.02);
  rg.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  r.connect(rg).connect(master);
  r.start(t); r.stop(t + 1);
}

/* Rising filtered-noise whoosh over `seconds`; stopped by the impact. */
export function startRiser(seconds: number) {
  const a = audio();
  if (!a || !master) return;
  stopRiser();
  const t = a.currentTime;
  const src = a.createBufferSource(), bp = a.createBiquadFilter(), gain = a.createGain();
  src.buffer = noise(a, seconds + 0.5);
  bp.type = "bandpass"; bp.Q.value = 1.4;
  bp.frequency.setValueAtTime(180, t);
  bp.frequency.exponentialRampToValueAtTime(4200, t + seconds);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.16, t + seconds);
  src.connect(bp).connect(gain).connect(master);
  src.start(t);
  riser = { src, gain };
}

export function stopRiser() {
  if (!riser || !ctx) return;
  const t = ctx.currentTime;
  riser.gain.gain.cancelScheduledValues(t);
  riser.gain.gain.setTargetAtTime(0.0001, t, 0.03);
  riser.src.stop(t + 0.2);
  riser = null;
}

/* The reveal: big impact, a cannon pop on each side, and a bright shimmer tail. */
export function impact() {
  const a = audio();
  if (!a || !master) return;
  const out = master;
  stopRiser();
  boom(1);
  const t = a.currentTime;

  // cannon pops (left/right panned bursts of noise)
  [-0.8, 0.8].forEach((pan, i) => {
    const n = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), p = a.createStereoPanner();
    n.buffer = noise(a, 0.5);
    f.type = "highpass"; f.frequency.value = 700;
    p.pan.value = pan;
    const s = t + i * 0.03;
    g.gain.setValueAtTime(0.45, s); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.45);
    n.connect(f).connect(g).connect(p).connect(out);
    n.start(s);
  });

  // shimmer: a quick, quiet bell arpeggio
  [1318.5, 1760, 2349.3, 2637].forEach((hz, i) => {
    const o = a.createOscillator(), g = a.createGain();
    const s = t + 0.08 + i * 0.07;
    o.type = "sine"; o.frequency.value = hz;
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(0.06, s + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, s + 1.6);
    o.connect(g).connect(out);
    o.start(s); o.stop(s + 1.7);
  });
}
