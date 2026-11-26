"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useMotionValue, useSpring } from "motion/react";
import gsap from "gsap";
import { ArrowRight, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import Embers from "./Embers";
import Envelope from "./Envelope";
import { makeCannons, type Cannons } from "./celebrate";
import { boom, crack, impact, setMuted, startRiser, stopRiser, unlockAudio } from "./sound";
import type { OrbScene } from "./orb";
import s from "./unveil.module.css";

/* Launch reveal over the site, on one page with no reload:
   sealed invitation → click → seal breaks, envelope opens → energy orb → 5·4·3·2·1
   → freeze, orb explodes, poppers + cannons → site message → "Enter the website". */

type Stage = "intro" | "opening" | "count" | "freeze" | "party" | "gone";
const FROM = 5;
const STEP_MS = 1000;
const OPEN_S = 2.4;      // envelope choreography length (countdown starts here)
const FREEZE_MS = 650;   // charge + hold before the blast
const ease = [0.16, 1, 0.3, 1] as const;
const SPARKLES = [[12, 20, 0], [86, 16, 0.5], [20, 74, 1.1], [80, 70, 0.3], [6, 46, 1.5], [93, 44, 0.8], [33, 10, 1.9], [66, 88, 1.3], [48, 6, 0.6]] as const;
const FACTS = [["5", "Focus areas"], ["8+", "Programs"], ["3", "Month pre-incubation"], ["6", "Month incubation"]] as const;

/* CTA that leans toward the pointer and springs back. */
function Magnetic({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
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
  );
}

export default function Unveil() {
  const [stage, setStage] = useState<Stage>("intro");
  const [n, setN] = useState(FROM);
  const [sound, setSound] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const orbCanvas = useRef<HTMLCanvasElement>(null);
  const fxCanvas = useRef<HTMLCanvasElement>(null);
  const orb = useRef<OrbScene | null>(null);
  const cannons = useRef<Cannons | null>(null);
  const gctx = useRef<gsap.Context | null>(null);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const orbReady = useRef<Promise<OrbScene | null> | null>(null);

  const later = (ms: number, f: () => void) => { timers.current.push(window.setTimeout(f, ms)); };
  const cleanup = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    gctx.current?.revert(); gctx.current = null;
    stopRiser();
    cannons.current?.stop();
  };

  useEffect(() => { document.documentElement.style.overflow = stage === "gone" ? "" : "hidden"; }, [stage]);
  useEffect(() => { setMuted(!sound); }, [sound]);
  useEffect(() => {
    const onResize = () => orb.current?.resize();
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); cleanup(); orb.current?.dispose(); orb.current = null; };
  }, []);

  /* 3 — freeze, max brightness, blast, celebrate */
  const explode = () => {
    setStage("freeze");
    const o = orb.current;
    if (o) gsap.to(o.params, { intensity: 1.45, ringSpeed: 6, inflow: 1.3, duration: 0.3, ease: "power2.in", onComplete: () => { o.params.frozen = true; } });
    later(FREEZE_MS, () => {
      if (o) { o.params.frozen = false; gsap.to(o.params, { explode: 1, duration: 1.4, ease: "power2.out" }); }
      impact();
      cannons.current?.fire();
      setStage("party");
    });
  };

  /* 2 — orb appears, countdown scheduled from one start time so it doesn't drift */
  const countdown = () => {
    setN(FROM); setStage("count");
    orbReady.current?.then((o) => {
      if (!o) return;
      o.resize(); o.start();
      gsap.fromTo(o.params, { scale: 0.2, intensity: 0 }, { scale: 1, intensity: 0.5, duration: 1.1, ease: "elastic.out(1, 0.6)" });
    });
    const t0 = performance.now() + 350;
    for (let i = 0; i <= FROM; i++) {
      timers.current.push(window.setTimeout(() => {
        if (i === FROM) { explode(); return; }
        const lvl = i / (FROM - 1);
        setN(FROM - i);
        boom(lvl);
        const o = orb.current;
        if (o) gsap.to(o.params, { intensity: 0.5 + lvl * 0.55, ringSpeed: 0.5 + lvl * 3.2, inflow: lvl, duration: 0.7, ease: "power2.out" });
      }, Math.max(0, t0 + i * STEP_MS - performance.now())));
    }
  };

  /* 1 — the click: seal glows, cracks into sparks, flap opens, light pours out */
  const unveil = () => {
    if (started.current) return;            // no double triggers
    started.current = true;
    unlockAudio(); setMuted(!sound);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setStage("party"); return; }

    // load the 3D orb now, while the envelope opens
    orbReady.current = import("./orb")
      .then(({ OrbScene }) => {
        if (orbCanvas.current && !orb.current) orb.current = new OrbScene(orbCanvas.current);
        return orb.current;
      })
      .catch(() => null); // no WebGL: the countdown still runs, just without the orb
    if (fxCanvas.current && !cannons.current) cannons.current = makeCannons(fxCanvas.current);

    setStage("opening");
    startRiser(OPEN_S + (FROM * STEP_MS + 350 + FREEZE_MS) / 1000);

    const env = root.current?.querySelector<HTMLElement>("[data-env]");
    const r = env?.getBoundingClientRect();
    const dy = r ? window.innerHeight / 2 - (r.top + r.height / 2) : 0;

    gctx.current = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to("[data-cta]", { autoAlpha: 0, y: 14, scale: 0.92, duration: 0.35, ease: "power2.in" })
        .to("[data-fade]", { autoAlpha: 0, y: -16, duration: 0.5, ease: "power2.in", stagger: 0.05 }, 0)
        .to("[data-env]", { y: dy, scale: 1.12, duration: 1.05, ease: "power3.inOut" }, 0.1)
        .to("[data-glow]", { opacity: 1, scale: 1.7, duration: 0.85, ease: "sine.in" }, 0.3)
        .to("[data-seal]", { x: 1.5, duration: 0.04, repeat: 11, yoyo: true, ease: "none" }, 0.7)
        .add(() => crack(), 1.15)
        .to("[data-seal]", { scale: 1.3, autoAlpha: 0, duration: 0.18, ease: "power2.out" }, 1.15)
        .fromTo("[data-shard]",
          { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0 },
          {
            x: () => gsap.utils.random(-190, 190), y: () => gsap.utils.random(-170, 140),
            rotation: () => gsap.utils.random(-400, 400), scale: 0, opacity: 0,
            duration: () => gsap.utils.random(0.6, 1.2), ease: "power3.out",
          }, 1.15)
        .to("[data-flap]", { rotateX: 180, duration: 0.85, ease: "power2.inOut" }, 1.3)
        .set("[data-flap]", { zIndex: 1 }, 1.72)
        .to("[data-card]", { yPercent: -48, duration: 0.8, ease: "power3.out" }, 1.75)
        .to("[data-burst]", { opacity: 1, scale: 16, duration: 0.9, ease: "power2.out" }, 1.9)
        .to("[data-veil]", { opacity: 0.85, duration: 0.35, ease: "power2.in" }, 2.15)
        .to("[data-env]", { autoAlpha: 0, scale: 1.35, duration: 0.5, ease: "power2.in" }, 2.15)
        .to("[data-veil]", { opacity: 0, duration: 0.7, ease: "power2.out" }, 2.55)
        .add(countdown, 2.4);
    }, root);
  };

  const enter = () => { cleanup(); setStage("gone"); };

  // background light: dim → brighter with every number → full at the blast
  const lvl = stage === "count" ? (FROM - n + 1) / FROM : stage === "freeze" || stage === "party" ? 1.3 : stage === "opening" ? 0.35 : 0;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence onExitComplete={() => { orb.current?.dispose(); orb.current = null; }}>
        {stage !== "gone" && (
          <motion.div
            key="unveil"
            ref={root}
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
            <canvas ref={orbCanvas} className={s.orb} aria-hidden="true" />

            <header className={s.chrome}>
              <span className={s.brand}>ACIC — MLRIT</span>
              <button className={s.mute} onClick={() => setSound((v) => !v)} aria-pressed={!sound} aria-label={sound ? "Mute sound" : "Turn sound on"}>
                {sound ? <SpeakerHigh /> : <SpeakerSlash />}
                <span>{sound ? "Sound on" : "Sound off"}</span>
              </button>
            </header>

            <AnimatePresence mode="wait">
              {(stage === "intro" || stage === "opening") && (
                <motion.section key="intro" className={s.stage} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                  <div data-fade>
                    <motion.h1 className={s.title} initial={{ opacity: 0, y: 24, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.25, duration: 1.2, ease }}>
                      Something special <span className={s.accent}>awaits.</span>
                    </motion.h1>
                  </div>
                  <motion.div initial={{ opacity: 0, y: 30, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.55, duration: 1.4, ease }}>
                    <Envelope />
                  </motion.div>
                  <div data-fade>
                    <motion.p className={s.sub} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1.1 }}>
                      A moment worth waiting for.
                    </motion.p>
                  </div>
                  <div data-cta>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45, duration: 1, ease }}>
                      <Magnetic onClick={unveil}>Unveil now <ArrowRight weight="bold" className={s.arrow} /></Magnetic>
                    </motion.div>
                  </div>
                  <button className={s.skip} onClick={enter} data-fade>Skip to website</button>
                </motion.section>
              )}

              {(stage === "count" || stage === "freeze") && (
                <motion.section key="count" className={s.stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                  <div className={s.count} aria-live="assertive">
                    <AnimatePresence>
                      {stage === "count" && (
                        <motion.span
                          key={n}
                          className={s.num}
                          initial={{ opacity: 0, scale: 0.4, filter: "blur(20px)" }}
                          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.55, ease } }}
                          exit={{ opacity: 0, scale: 1.6, filter: "blur(14px)", transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] } }}
                        >
                          {n}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className={s.countLabel}><span className={s.rule} /> Unveiling in <span className={s.rule} /></p>
                </motion.section>
              )}

              {stage === "party" && (
                <motion.section key="party" className={s.stage} initial={{ opacity: 1 }}>
                  <motion.span className={s.flash} initial={{ opacity: 0.95 }} animate={{ opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} aria-hidden="true" />
                  <div className={s.streaks} aria-hidden="true">
                    {Array.from({ length: 14 }, (_, i) => <span key={i} style={{ rotate: `${i * (360 / 14) + (i % 2) * 7}deg`, animationDelay: `${(i % 4) * 0.04}s` }} />)}
                  </div>
                  <motion.p className={s.kicker} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}>
                    <span className={s.rule} /> We are now live <span className={s.rule} />
                  </motion.p>
                  <span className={s.ghostMark} aria-hidden="true">ACIC</span>
                  {SPARKLES.map(([x, y, d], i) => (
                    <span key={i} className={s.sparkle} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${0.8 + d}s` }} aria-hidden="true" />
                  ))}
                  <h2 className={s.message} aria-label="Empowering Innovations for Bharath">
                    {["Empowering", "Innovations", "for Bharath"].map((line, i) => (
                      <span key={line} className={s.msgLine} aria-hidden="true">
                        <motion.span initial={{ y: "110%", filter: "blur(8px)" }} animate={{ y: 0, filter: "blur(0px)" }} transition={{ delay: 0.3 + i * 0.14, duration: 1.1, ease }}>
                          {line}
                        </motion.span>
                      </span>
                    ))}
                  </h2>
                  <motion.p className={s.over} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1.2, ease }}>
                    <b>ACIC-MLR Institute of Technology Foundation</b> &middot; Atal Community Innovation Centre, supported by Atal Innovation Mission, NITI Aayog
                  </motion.p>
                  <motion.ul className={s.facts} initial="hide" animate="show" variants={{ show: { transition: { delayChildren: 1.3, staggerChildren: 0.12 } } }}>
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

            <span className={s.veil} data-veil aria-hidden="true" />
            <canvas ref={fxCanvas} className={s.canvas} aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
