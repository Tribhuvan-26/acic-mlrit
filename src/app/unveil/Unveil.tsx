"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import Embers from "./Embers";
import { Confetti } from "./confetti";
import { boom, impact, setMuted, startRiser, stopRiser, unlockAudio } from "./sound";
import s from "./unveil.module.css";

/* Launch reveal over the site: landing → one click → 5·4·3·2·1 → confetti cannons + celebration.
   "Enter the website" removes the overlay. No reloads. */

type Stage = "intro" | "count" | "party" | "gone";
const FROM = 5;
const STEP_MS = 1000;
const ease = [0.16, 1, 0.3, 1] as const;
const FACTS = [["5", "Focus areas"], ["8+", "Programs"], ["3", "Month pre-incubation"], ["6", "Month incubation"]] as const;

/* CTA that leans toward the pointer and springs back. */
function Magnetic({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div className={s.ctaWrap} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1, ease }}>
      <motion.button
        className={s.cta}
        style={{ x: sx, y: sy }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
          y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
        }}
        onPointerLeave={() => { x.set(0); y.set(0); }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
      >
        <span className={s.ctaInner}>{children}</span>
      </motion.button>
    </motion.div>
  );
}

export default function Unveil() {
  const [stage, setStage] = useState<Stage>("intro");
  const [n, setN] = useState(FROM);
  const [sound, setSound] = useState(true);
  const canvas = useRef<HTMLCanvasElement>(null);
  const confetti = useRef<Confetti | null>(null);
  const timers = useRef<number[]>([]);
  const running = useRef(false);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => { document.documentElement.style.overflow = stage === "gone" ? "" : "hidden"; }, [stage]);
  useEffect(() => { setMuted(!sound); }, [sound]);
  useEffect(() => {
    const onResize = () => confetti.current?.resize();
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimers(); confetti.current?.stop(); stopRiser(); };
  }, []);

  const celebrate = useCallback(() => {
    setStage("party");
    impact();
    running.current = false;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!confetti.current && canvas.current) confetti.current = new Confetti(canvas.current);
    confetti.current?.celebrate();
  }, []);

  /* One click starts it; the guard stops repeat clicks from stacking countdowns.
     Every step is scheduled from one start time, so the count doesn't drift. */
  const unveil = () => {
    if (running.current) return;
    running.current = true;
    unlockAudio(); setMuted(!sound);
    setN(FROM); setStage("count");
    startRiser((FROM * STEP_MS) / 1000);
    const t0 = performance.now();
    for (let i = 0; i <= FROM; i++) {
      timers.current.push(window.setTimeout(() => {
        if (i === FROM) { celebrate(); return; }
        setN(FROM - i);
        boom(i / (FROM - 1));
      }, Math.max(0, t0 + i * STEP_MS - performance.now())));
    }
  };

  const enter = () => { clearTimers(); stopRiser(); running.current = false; setStage("gone"); };

  // background light: dim on the landing, brighter with every number, full at the reveal
  const lvl = stage === "count" ? (FROM - n + 1) / FROM : stage === "party" ? 1.25 : 0;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence onExitComplete={() => confetti.current?.stop()}>
        {stage !== "gone" && (
          <motion.div
            key="unveil"
            className={s.root}
            data-stage={stage}
            style={{ ["--lvl" as string]: lvl }}
            role="dialog"
            aria-modal="true"
            aria-label="Website unveiling"
            exit={{ opacity: 0, transition: { duration: 0.9, ease } }}
          >
            <div className={s.bg} aria-hidden="true">
              <span className={s.light} />
              <span className={s.halo} />
              <span className={s.beam} />
              <span className={s.grain} />
              <span className={s.vignette} />
            </div>
            <Embers className={s.embers} speed={stage === "count" ? 3 : 1} />

            <header className={s.chrome}>
              <span className={s.brand}>ACIC — MLRIT</span>
              <button className={s.mute} onClick={() => setSound((v) => !v)} aria-pressed={!sound} aria-label={sound ? "Mute sound" : "Turn sound on"}>
                {sound ? <SpeakerHigh /> : <SpeakerSlash />}
                <span>{sound ? "Sound on" : "Sound off"}</span>
              </button>
            </header>

            <AnimatePresence mode="wait">
              {stage === "intro" && (
                <motion.section
                  key="intro"
                  className={s.stage}
                  exit={{ opacity: 0, scale: 0.97, filter: "blur(12px)", transition: { duration: 0.5, ease } }}
                >
                  <motion.p className={s.kicker} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1.2 }}>
                    <span className={s.rule} /> An exclusive unveiling <span className={s.rule} />
                  </motion.p>
                  <h1 className={s.title}>
                    {["The moment", "has arrived."].map((line, i) => (
                      <span key={line} className={s.mask}>
                        <motion.span className={s.line} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ delay: 0.35 + i * 0.16, duration: 1.2, ease }}>
                          {line}
                        </motion.span>
                      </span>
                    ))}
                  </h1>
                  <motion.p className={s.sub} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 1.1, ease }}>
                    Something extraordinary is about to be unveiled.
                  </motion.p>
                  <Magnetic onClick={unveil}>
                    Unveil now <ArrowRight weight="bold" className={s.arrow} />
                  </Magnetic>
                  <motion.button className={s.skip} onClick={enter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
                    Skip to website
                  </motion.button>
                </motion.section>
              )}

              {stage === "count" && (
                <motion.section key="count" className={s.stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                  <p className={s.kicker}><span className={s.rule} /> Unveiling in <span className={s.rule} /></p>
                  <div className={s.count} aria-live="assertive">
                    <AnimatePresence>
                      <motion.span
                        key={n}
                        className={s.num}
                        initial={{ opacity: 0, scale: 1.35, filter: "blur(28px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease } }}
                        exit={{ opacity: 0, scale: 0.82, filter: "blur(18px)", transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } }}
                      >
                        {n}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className={s.meter} aria-hidden="true">
                    <motion.span key={n} className={s.meterFill} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: STEP_MS / 1000, ease: "linear" }} />
                  </div>
                </motion.section>
              )}

              {stage === "party" && (
                <motion.section key="party" className={s.stage} exit={{ opacity: 0, transition: { duration: 0.4 } }}>
                  <motion.span className={s.bloom} initial={{ opacity: 0.85, scale: 0.4 }} animate={{ opacity: 0, scale: 2.2 }} transition={{ duration: 1.4, ease: "easeOut" }} aria-hidden="true" />
                  <motion.p className={s.kicker} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
                    <span className={s.rule} /> We are now live <span className={s.rule} />
                  </motion.p>
                  <motion.h2
                    className={s.message}
                    initial={{ opacity: 0, scale: 0.86, filter: "blur(16px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.1, duration: 1.4, ease }}
                  >
                    Empowering <span className={s.out}>Innovations</span> <span className={s.gold}>for Bharath</span>
                  </motion.h2>
                  <motion.p className={s.over} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1.2, ease }}>
                    <b>ACIC-MLR Institute of Technology Foundation</b> &middot; Atal Community Innovation Centre, supported by Atal Innovation Mission, NITI Aayog
                  </motion.p>
                  <motion.ul className={s.facts} initial="hide" animate="show" variants={{ show: { transition: { delayChildren: 1.2, staggerChildren: 0.12 } } }}>
                    {FACTS.map(([num, label]) => (
                      <motion.li key={label} variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}>
                        <b>{num}</b><span>{label}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <motion.div className={s.actions} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1, ease }}>
                    <button className={s.primary} onClick={enter}>Enter the website <ArrowRight weight="bold" /></button>
                  </motion.div>
                </motion.section>
              )}
            </AnimatePresence>

            <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
