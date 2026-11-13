"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sprout, Wheat, Bus, HeartHandshake, Plane,
  Boxes, Palette, Cpu, CalendarDays, Rocket, Package,
  ArrowLeft, Users, CheckCircle2,
  Zap, Trophy,
} from "lucide-react";
import type { Vertical, ProposalBlock } from "../programs-data";
import PageGeometric from "@/components/ui/PageGeometric";
import AutoplayVideo from "@/components/ui/AutoplayVideo";

const ICONS: Record<string, React.ElementType> = {
  "pre-incubation": Sprout,
  incubation: Rocket,
  grip: Wheat,
  "innovation-yatra": Bus,
  "community-innovator-fellowship": HeartHandshake,
  "liftoff-accelerator": Plane,
};

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  Active:    { bg: "rgba(5,150,105,0.08)",  text: "#059669" },
  Completed: { bg: "rgba(8,145,178,0.08)",  text: "#0891B2" },
  Upcoming:  { bg: "rgba(217,119,6,0.08)",  text: "#D97706" },
};

function FadeIn({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="section-tag" style={{ marginBottom: "10px", display: "inline-block" }}>
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(22px,3.5vw,36px)", color: "#000000", lineHeight: 1.1, marginBottom: "32px" }}>
      {children}
    </h2>
  );
}

type ProposalBodyBlock = Exclude<ProposalBlock, { type: "heading" } | { type: "subheading" }>;
type ProposalSubsection = { subheading: string; body: ProposalBodyBlock[] };
type ProposalSection = { heading: string; body: ProposalBodyBlock[]; subs: ProposalSubsection[] };

function groupProposalBlocks(blocks: ProposalBlock[]): ProposalSection[] {
  const sections: ProposalSection[] = [];
  let current: ProposalSection | null = null;
  let currentSub: ProposalSubsection | null = null;
  for (const b of blocks) {
    if (b.type === "heading") {
      current = { heading: b.text, body: [], subs: [] };
      sections.push(current);
      currentSub = null;
    } else if (b.type === "subheading") {
      if (!current) continue;
      currentSub = { subheading: b.text, body: [] };
      current.subs.push(currentSub);
    } else if (currentSub) {
      currentSub.body.push(b);
    } else if (current) {
      current.body.push(b);
    }
  }
  return sections;
}

function ProposalBlockView({ block, color }: { block: ProposalBodyBlock; color: string }) {
  if (block.type === "paragraph") {
    return (
      <p style={{ fontFamily: "var(--font-body)", fontSize: "14.5px", color: "#374151", lineHeight: 1.75, marginBottom: "10px" }}>
        {block.text}
      </p>
    );
  }
  if (block.type === "list") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        {block.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <CheckCircle2 size={14} style={{ color, flexShrink: 0, marginTop: "3px" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#374151", lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
    );
  }
  // table
  return (
    <div style={{ overflowX: "auto", borderRadius: "14px", border: "1px solid #E5E7EB", marginBottom: "14px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "13.5px" }}>
        <thead>
          <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
            {block.headers.map((h) => (
              <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontWeight: 700, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#6B7280", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < block.rows.length - 1 ? "1px solid #F3F4F6" : "none" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "12px 18px", color: j === 0 ? "#111111" : "#374151", fontWeight: j === 0 ? 600 : 400 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProposalSectionCard({ section, color, lightBg, border }: { section: ProposalSection; color: string; lightBg: string; border: string }) {
  return (
    <div style={{ padding: "clamp(22px,3vw,32px)", borderRadius: "18px", background: "#FAFAFA", border: "1px solid rgba(0,0,0,0.07)", marginBottom: "20px" }}>
      <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "19px", color: "#000000", marginBottom: "14px" }}>
        {section.heading}
      </h3>
      {section.body.map((block, i) => (
        <ProposalBlockView key={i} block={block} color={color} />
      ))}
      {section.subs.map((sub, i) => (
        <div key={i} style={{ padding: "18px 20px", borderRadius: "14px", background: lightBg, border: `1px solid ${border}`, marginTop: i === 0 ? "6px" : "14px" }}>
          <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "15px", color: "#111111", marginBottom: "10px" }}>
            {sub.subheading}
          </h4>
          {sub.body.map((block, j) => (
            <ProposalBlockView key={j} block={block} color={color} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function VerticalDetailClient({ vertical: v }: { vertical: Vertical }) {
  const Icon = ICONS[v.id] ?? Boxes;

  return (
    <div style={{ background: "#FFFFFF", position: "relative" }}>
      <PageGeometric />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="page-hero" style={{ background: v.gradient, position: "relative", overflow: "hidden", paddingTop: "calc(var(--nav-height) + 48px)", paddingBottom: "80px" }}>
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        {/* Watermark abbr */}
        <div style={{ position: "absolute", right: "-40px", bottom: "-60px", fontSize: "clamp(180px,22vw,280px)", fontFamily: "var(--font-heading)", fontWeight: 900, color: "rgba(255,255,255,0.05)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
          {v.abbr}
        </div>

        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Back link */}
          <Link href="/programs" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", marginBottom: "28px" }}>
            <ArrowLeft size={13} /> All Verticals
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={24} style={{ color: "rgba(255,255,255,0.92)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
              ACIC Program · {v.abbr}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(36px,6vw,72px)", color: "#FFFFFF", lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "12px" }}
          >
            {v.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(16px,2vw,22px)", color: "rgba(255,255,255,0.65)", fontStyle: "italic", marginBottom: "36px" }}
          >
            {v.tagline}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}
          >
            {v.stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(24px,3.5vw,36px)", color: "#FFFFFF", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px", fontWeight: 500, letterSpacing: "0.04em" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Overview ──────────────────────────────────────────────── */}
      <section style={{ paddingTop: "clamp(52px,8vw,96px)", paddingBottom: "clamp(52px,8vw,96px)", background: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <FadeIn>
              <SectionLabel>Overview</SectionLabel>
              <SectionHeading>About {v.name}</SectionHeading>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {v.overview.map((para, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.78, color: "#374151" }}>{para}</p>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              {/* Quote */}
              <div style={{ padding: "24px", borderRadius: "16px", background: v.lightBg, border: `1px solid ${v.border}`, marginBottom: "28px" }}>
                <div style={{ width: "3px", height: "100%", position: "absolute" }} />
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "16px", color: v.textColor, fontStyle: "italic", lineHeight: 1.65 }}>
                  &ldquo;{v.quote}&rdquo;
                </p>
              </div>

              {/* Achievement pills */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {v.achievements.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle2 size={15} style={{ color: v.color, flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#374151", lineHeight: 1.6 }}>{a}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Features / Why Choose Us ─────────────────────────────────── */}
      {v.features && v.features.length > 0 && (
        <section style={{ paddingTop: "clamp(52px,8vw,96px)", paddingBottom: "clamp(52px,8vw,96px)", background: "#F9FAFB", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="page-container">
            <FadeIn><div style={{ marginBottom: "clamp(32px,4vw,52px)" }}>
              <SectionLabel>{v.featuresLabel ?? "Why Choose Us"}</SectionLabel>
              <SectionHeading>{v.featuresHeading ?? `Why Choose ${v.name}?`}</SectionHeading>
            </div></FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ alignItems: "stretch" }}>
              {v.features.map((f, i) => (
                <FadeIn key={f.title} delay={i * 0.06} className="flex flex-col">
                  <div style={{ padding: "22px", borderRadius: "14px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", flex: 1 }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: v.lightBg, border: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                      <CheckCircle2 size={15} style={{ color: v.color }} />
                    </div>
                    <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "15px", color: "#000000", marginBottom: "8px" }}>{f.title}</h4>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#6B7280", lineHeight: 1.65 }}>{f.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery (any vertical with media entries) ───────────────── */}
      {v.media && v.media.length > 0 && (
        <section style={{ paddingTop: "clamp(52px,8vw,96px)", paddingBottom: "clamp(52px,8vw,96px)", background: "#F9FAFB", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="page-container">
            <FadeIn><div style={{ marginBottom: "clamp(32px,4vw,52px)" }}>
              <SectionLabel>In Action</SectionLabel>
              <SectionHeading>Photos &amp; Videos</SectionHeading>
            </div></FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {v.media.map((item, i) => (
                <FadeIn key={item.src} delay={i * 0.06}>
                  <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.07)", background: "#000", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ position: "relative", aspectRatio: "4 / 3", background: "#0a0a0a" }}>
                      {item.type === "image" ? (
                        <Image src={item.src} alt={item.caption ?? `${v.name} media`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                      ) : (
                        <AutoplayVideo src={item.src} unmuteOnHover style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>
                    {item.caption && (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#374151", padding: "12px 14px", background: "#FFFFFF" }}>{item.caption}</p>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ── Roles ─────────────────────────────────────────────────── */}
      {v.roles.length > 0 && <section style={{ paddingTop: "clamp(52px,8vw,96px)", paddingBottom: "clamp(52px,8vw,96px)", background: "#F9FAFB", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="page-container">
          <FadeIn><div style={{ marginBottom: "clamp(32px,4vw,52px)" }}>
            <SectionLabel>Team Structure</SectionLabel>
            <SectionHeading>Roles &amp; Responsibilities</SectionHeading>
          </div></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ alignItems: "stretch" }}>
            {v.roles.map((role, i) => (
              <FadeIn key={role.title} delay={i * 0.06} className="flex flex-col">
                <div style={{ padding: "22px", borderRadius: "14px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", flex: 1 }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: v.lightBg, border: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                    <Users size={15} style={{ color: v.color }} />
                  </div>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "15px", color: "#000000", marginBottom: "8px" }}>{role.title}</h4>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#6B7280", lineHeight: 1.65 }}>{role.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>}

      {/* ── Projects ──────────────────────────────────────────────── */}
      {v.projects.length > 0 && <section style={{ paddingTop: "clamp(52px,8vw,96px)", paddingBottom: "clamp(52px,8vw,96px)", background: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="page-container">
          <FadeIn><div style={{ marginBottom: "clamp(32px,4vw,52px)" }}>
            <SectionLabel>Work</SectionLabel>
            <SectionHeading>Projects &amp; Initiatives</SectionHeading>
          </div></FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {v.projects.map((proj, i) => {
              const sc = STATUS_COLOR[proj.status] ?? STATUS_COLOR["Active"];
              return (
                <FadeIn key={proj.name} delay={i * 0.05}>
                  <div style={{ padding: "20px 24px", borderRadius: "14px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: "18px", alignItems: "flex-start", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: v.lightBg, border: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                      <Zap size={15} style={{ color: v.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "15px", color: "#000000" }}>{proj.name}</h4>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: sc.text, background: sc.bg, padding: "2px 8px", borderRadius: "999px" }}>
                          {proj.status}
                        </span>
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13.5px", color: "#6B7280", lineHeight: 1.6 }}>{proj.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>}

      {/* ── Proposal ─────────────────────────────────────────────── */}
      {v.proposal && (
        <section style={{ paddingTop: "clamp(52px,8vw,96px)", paddingBottom: "clamp(52px,8vw,96px)", background: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="page-container">
            <FadeIn>
              <div style={{ marginBottom: "clamp(32px,4vw,52px)" }}>
                <SectionLabel>Proposal</SectionLabel>
                <SectionHeading>{v.proposal.title}</SectionHeading>
                {v.proposal.subtitle.map((line, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "14.5px", color: "#6B7280", lineHeight: 1.6, marginTop: i === 0 ? "-16px" : "2px" }}>
                    {line}
                  </p>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.05}>
              <div>
                {groupProposalBlocks(v.proposal.blocks).map((section, i) => (
                  <ProposalSectionCard key={i} section={section} color={v.color} lightBg={v.lightBg} border={v.border} />
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Events ────────────────────────────────────────────────── */}
      {v.events.length > 0 && <section style={{ paddingTop: "clamp(52px,8vw,96px)", paddingBottom: "clamp(52px,8vw,96px)", background: "#F9FAFB", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="page-container">
          <FadeIn><div style={{ marginBottom: "clamp(32px,4vw,52px)" }}>
            <SectionLabel>Programming</SectionLabel>
            <SectionHeading>Events &amp; Gatherings</SectionHeading>
          </div></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {v.events.map((ev, i) => (
              <FadeIn key={ev.name} delay={i * 0.07}>
                <div style={{ padding: "22px", borderRadius: "14px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: v.lightBg, border: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Trophy size={14} style={{ color: v.color }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "15px", color: "#000000", lineHeight: 1.2 }}>{ev.name}</h4>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 700, color: v.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>{ev.type}</span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#6B7280", lineHeight: 1.65 }}>{ev.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>}

      {/* ── Timeline ─────────────────────────────────────────────── */}
      {v.timeline && (
        <section style={{ paddingTop: "clamp(52px,8vw,96px)", paddingBottom: "clamp(52px,8vw,96px)", background: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="page-container">
            <FadeIn><div style={{ marginBottom: "clamp(32px,4vw,52px)" }}>
              <SectionLabel>{v.timelineLabel ?? "How It Works"}</SectionLabel>
              <SectionHeading>{v.timelineHeading ?? "Sprint Timeline"}</SectionHeading>
            </div></FadeIn>
            <div style={{ position: "relative" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: "21px", top: "8px", bottom: "8px", width: "2px", background: `linear-gradient(to bottom, ${v.color}, ${v.color}44)`, borderRadius: "2px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {v.timeline.map((item, i) => (
                  <FadeIn key={item.step} delay={i * 0.07}>
                    <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", paddingBottom: i < v.timeline!.length - 1 ? "36px" : "0" }}>
                      {/* Circle */}
                      <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: v.lightBg, border: `2px solid ${v.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, backgroundColor: "#fff" }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "11px", color: v.color, letterSpacing: "0.04em" }}>{item.step}</span>
                      </div>
                      {/* Content */}
                      <div style={{ paddingTop: "8px", flex: 1 }}>
                        <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "16px", color: "#000000", marginBottom: "6px" }}>{item.title}</h4>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#6B7280", lineHeight: 1.7 }}>{item.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer nav ────────────────────────────────────────────── */}
      <section style={{ paddingTop: "40px", paddingBottom: "40px", background: "#F9FAFB", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <Link href="/programs" style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13px", color: "#6B7280", textDecoration: "none" }}>
            <ArrowLeft size={14} /> Back to Programs
          </Link>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#9CA3AF" }}>
            ACIC · MLRIT · {v.name}
          </span>
        </div>
      </section>
    </div>
  );
}
