"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowRight, ArrowCounterClockwise, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import Embers from "./Embers";
import Balloons from "./Balloons";
import { Confetti } from "./confetti";
import { pop, tick, unlockAudio } from "./sound";
import s from "./unveil.module.css";

/* Launch reveal: suspense intro → one click → 5·4·3·2·1 → poppers, confetti, balloons → celebration.
   Sits over the site; "Enter the website" removes it. Everything happens on this page, no reload. */

type Stage = "intro" | "count" | "party" | "gone";
const FROM = 5;
const STEP_MS = 1000;
const ease = [0.16, 1, 0.3, 1] as const;

const SPARKLES = [
  { x: 14, y: 22, d: 0 }, { x: 84, y: 18, d: 0.4 }, { x: 22, y: 70, d: 0.8 }, { x: 78, y: 74, d: 0.2 },
  { x: 50, y: 12, d: 1 }, { x: 8, y: 48, d: 0.6 }, { x: 92, y: 46, d: 1.2 }, { x: 36, y: 86, d: 0.3 }, { x: 64, y: 88, d: 0.9 },
];

export default function Unveil() {
  const [stage, setStage] = useState<Stage>("intro");
  const [n, setN] = useState(FROM);
  const [sound, setSound] = useState(true);
  const canvas = useRef<HTMLCanvasElement>(null);
  const confetti = useRef<Confetti | null>(null);
  const timers = useRef<number[]>([]);
  const soundRef = useRef(sound);
  useEffect(() => { soundRef.current = sound; }, [sound]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  // lock page scroll while the overlay is up
  useEffect(() => {
    document.documentElement.style.overflow = stage === "gone" ? "" : "hidden";
  }, [stage]);

  useEffect(() => {
    const onResize = () => confetti.current?.resize();
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimers(); confetti.current?.stop(); };
  }, []);

  const celebrate = useCallback(() => {
    setStage("party");
    if (soundRef.current) pop();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!confetti.current && canvas.current) confetti.current = new Confetti(canvas.current);
    confetti.current?.celebrate();
  }, []);

  /* Countdown scheduled against one start time, so ticks don't drift. */
  const runCountdown = useCallback(() => {
    clearTimers();
    confetti.current?.stop();
    setN(FROM);
    setStage("count");
    const t0 = performance.now();
    for (let i = 0; i <= FROM; i++) {
      const at = t0 + i * STEP_MS;
      timers.current.push(window.setTimeout(() => {
        if (i === FROM) { celebrate(); return; }
        setN(FROM - i);
        if (soundRef.current) tick(i === FROM - 1);
      }, Math.max(0, at - performance.now())));
    }
  }, [celebrate]);

  const unveil = () => { unlockAudio(); runCountdown(); };
  const enter = () => { clearTimers(); setStage("gone"); };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence onExitComplete={() => confetti.current?.stop()}>
        {stage !== "gone" && (
          <motion.div
            key="unveil"
            className={s.root}
            data-stage={stage}
            role="dialog"
            aria-modal="true"
            aria-label="Website unveiling"
            exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
            transition={{ duration: 0.8, ease }}
          >
            {/* layered background */}
            <div className={s.bg} aria-hidden="true">
              <span className={s.blobA} /><span className={s.blobB} />
              <span className={s.rays} />
              <span className={s.partyBg} />
              <span className={s.grain} />
              <span className={s.vignette} />
            </div>
            <Embers className={s.embers} speed={stage === "count" ? 4 : 1} />

            <div className={s.chrome}>
              <span className={s.brand}>ACIC-MLRIT</span>
              <button className={s.mute} onClick={() => setSound((v) => !v)} aria-pressed={!sound} aria-label={sound ? "Mute sound" : "Turn sound on"}>
                {sound ? <SpeakerHigh weight="fill" /> : <SpeakerSlash weight="fill" />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {stage === "intro" && (
                <motion.section
                  key="intro"
                  className={s.stage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.94, filter: "blur(14px)", transition: { duration: 0.45, ease } }}
                >
                  <motion.p className={s.eyebrow} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9, ease }}>
                    <span className={s.dot} /> Website launch · 2026
                  </motion.p>
                  <h1 className={s.title}>
                    {["Something", "Special", "Is", "About", "to", "Be"].map((w, i) => (
                      <motion.span key={w} className={s.word} initial={{ opacity: 0, y: "60%", filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.35 + i * 0.08, duration: 1, ease }}>
                        {w}{" "}
                      </motion.span>
                    ))}
                    <motion.em className={s.em} initial={{ opacity: 0, y: "40%", filter: "blur(14px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.95, duration: 1.3, ease }}>
                      Unveiled<span className={s.ellipsis}>...</span>
                    </motion.em>
                  </h1>
                  <motion.p className={s.sub} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}>
                    The wait is almost over.
                  </motion.p>
                  <motion.button
                    className={s.cta}
                    onClick={unveil}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6, type: "spring", stiffness: 160, damping: 16 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    autoFocus
                  >
                    <span className={s.ctaPulse} aria-hidden="true" />
                    <span className={s.ctaLabel}>Click to unveil</span>
                  </motion.button>
                  <motion.button className={s.skip} onClick={enter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                    Skip intro
                  </motion.button>
                </motion.section>
              )}

              {stage === "count" && (
                <motion.section key="count" className={s.stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} aria-live="assertive">
                  <div className={s.count}>
                    <AnimatePresence>
                      <motion.span
                        key={`ring${n}`}
                        className={s.ring}
                        initial={{ scale: 0.2, opacity: 0.8 }}
                        animate={{ scale: 2.6, opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        aria-hidden="true"
                      />
                      <motion.span
                        key={n}
                        className={s.num}
                        initial={{ scale: 0.3, opacity: 0, filter: "blur(16px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)", transition: { duration: 0.55, ease } }}
                        exit={{ scale: 1.7, opacity: 0, filter: "blur(10px)", transition: { duration: 0.4, ease: "easeIn" } }}
                      >
                        {n}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className={s.bars} aria-hidden="true">
                    {Array.from({ length: FROM }, (_, i) => <span key={i} className={i < FROM - n + 1 ? s.barOn : s.bar} />)}
                  </div>
                </motion.section>
              )}

              {stage === "party" && (
                <motion.section key="party" className={s.stage} initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.span className={s.flash} initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }} aria-hidden="true" />
                  <Balloons />
                  {SPARKLES.map((p, i) => (
                    <span key={i} className={s.sparkle} style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.d}s` }} aria-hidden="true" />
                  ))}
                  <motion.h2
                    className={s.message}
                    initial={{ scale: 0.25, opacity: 0, filter: "blur(20px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 120, damping: 13 }}
                  >
                    Let the <em>Celebration</em> Begin!
                  </motion.h2>
                  <motion.p className={s.msgSub} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8, ease }}>
                    ACIC-MLR Institute of Technology Foundation is now live.
                  </motion.p>
                  <motion.div className={s.actions} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8, ease }}>
                    <button className={s.primary} onClick={enter} autoFocus>Enter the website <ArrowRight weight="bold" /></button>
                    <button className={s.ghost} onClick={runCountdown}><ArrowCounterClockwise weight="bold" /> Replay</button>
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
