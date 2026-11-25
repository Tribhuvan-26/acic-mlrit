import s from "./unveil.module.css";

/* Fixed layout (no randomness) so server and client render the same thing. */
const BALLOONS = [
  { x: 4, size: 86, color: "#e8521a", delay: 0.1, dur: 7.5 },
  { x: 14, size: 64, color: "#ffd166", delay: 0.9, dur: 8.5 },
  { x: 24, size: 74, color: "#3ec1d3", delay: 0.4, dur: 7 },
  { x: 72, size: 70, color: "#ff5d8f", delay: 0.6, dur: 8 },
  { x: 82, size: 90, color: "#e8521a", delay: 0, dur: 7.2 },
  { x: 92, size: 66, color: "#8ac926", delay: 1.1, dur: 8.8 },
  { x: 40, size: 58, color: "#fdf6e8", delay: 1.6, dur: 9 },
  { x: 60, size: 62, color: "#ffb703", delay: 1.3, dur: 8.2 },
];

export default function Balloons() {
  return (
    <div className={s.balloons} aria-hidden="true">
      {BALLOONS.map((b, i) => (
        <span
          key={i}
          className={s.balloon}
          style={{ left: `${b.x}%`, width: b.size, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s`, ["--sway" as string]: `${2.6 + (i % 3) * 0.5}s` }}
        >
          <svg viewBox="0 0 60 120" width="100%">
            <path d="M30 2C13 2 3 16 3 32c0 20 15 36 27 40 12-4 27-20 27-40C57 16 47 2 30 2Z" fill={b.color} />
            <path d="M18 14c-6 4-9 10-9 17" stroke="#fff" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M26 72h8l-4 6Z" fill={b.color} />
            <path d="M30 78c-6 10 6 18 0 28s4 12 0 14" stroke="rgba(255,255,255,.6)" strokeWidth="1.2" fill="none" />
          </svg>
        </span>
      ))}
    </div>
  );
}
