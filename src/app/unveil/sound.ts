/* Tiny Web Audio sounds. The context is created on the first click, so browsers allow playback. */

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/* Call inside the click handler to unlock audio. */
export function unlockAudio() { audio(); }

/* Clock tick: a short, bright click. The last number ticks a little higher. */
export function tick(final = false) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const o = a.createOscillator(), g = a.createGain();
  o.type = "square";
  o.frequency.setValueAtTime(final ? 1400 : 1000, t);
  o.frequency.exponentialRampToValueAtTime(final ? 700 : 500, t + 0.05);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + 0.1);
}

/* Popper bang: a burst of filtered noise. */
export function pop() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime, len = 0.35;
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * len), a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
  const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = buf; f.type = "lowpass"; f.frequency.value = 2400; g.gain.value = 0.5;
  src.connect(f).connect(g).connect(a.destination);
  src.start(t);
}
