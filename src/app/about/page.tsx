"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Heart, Sprout, Palette, Recycle, Cpu, Tractor, Printer, Zap, Plane, Activity, Gauge, Thermometer } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import PageGeometric from "@/components/ui/PageGeometric";

/* ─── Design tokens ──────────────────────────────────────────────── */
const ORANGE   = "#E8521A";
const T_HEAD   = "#000000";
const T_BODY   = "#374151";
const T_MUTED  = "#6B7280";

const SECTION_PY: React.CSSProperties = {
  paddingTop:    "clamp(52px, 8vw, 96px)",
  paddingBottom: "clamp(52px, 8vw, 96px)",
};

const BG_WHITE = "#FFFFFF";
const BG_GRAY  = "#F5F5F5";

/* ─── FadeIn helper ──────────────────────────────────────────────── */
function FadeIn({
  children, delay = 0, className = "",
}: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section header — used in every section ─────────────────────── */
function SectionHeader({
  tag, heading, sub, center = false,
}: {
  tag: string; heading: string; sub?: string; center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""} style={{ marginBottom: "clamp(36px, 5vw, 60px)" }}>
      <span className="section-tag">{tag}</span>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "clamp(26px, 4vw, 44px)",
          letterSpacing: "-0.03em",
          color: T_HEAD,
          lineHeight: 1.12,
          marginTop: "10px",
          ...(center ? { maxWidth: "none" } : { maxWidth: "520px" }),
        }}
      >
        {heading}
      </h2>
      {sub && (
        <p
          style={{
            marginTop: "14px",
            fontSize: "clamp(15px, 1.4vw, 17px)",
            lineHeight: 1.72,
            color: T_MUTED,
            maxWidth: "560px",
            ...(center ? { margin: "14px auto 0" } : {}),
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────── */
const aboutAcic = [
  "Atal Innovation Mission (AIM) at NITI Aayog is mandated to promote a culture of innovation and entrepreneurship in India.",
  "AIM has selected a number of institutions for supporting them in establishing Atal Community Innovation Centres (ACICs). MLRIT has been selected by AIM and received approval for the establishment of an Atal Community Innovation Centre (ACIC) at the MLRIT campus.",
  "ACIC-MLRIT envisions creating a formal approach to identify, build, and nurture sustainable communities through innovation.",
];

const visionMission = [
  {
    icon: Eye,
    title: "Our Vision",
    content:
      "ACIC-MLRIT's vision is to encourage a spirit of entrepreneurship in the underserved and unserved regions by providing enabling infrastructure and facilitating an environment for innovations.",
  },
  {
    icon: Target,
    title: "Our Approach",
    content:
      "We identify innovators in the community, build their skills and products through structured programs and makerspace access, and nurture them into sustainable startups with mentorship, funding support and market access.",
  },
];

const objectives = [
  "To build an innovative mindset and the need for entrepreneurship among the community.",
  "To enhance the domain knowledge, skills and abilities (K-S-A) to develop innovative products and services.",
  "To promote design thinking processes among the community and provide the necessary infrastructure support for building prototypes and MVPs.",
  "To build a vibrant startup ecosystem by establishing a network between academia, industries, incubation centres, financial institutions, Government and other stakeholders.",
  "To build a sector-specific expert mentor pool from academia and industry to provide expert opinions and suggestions to innovators and startups.",
  "To provide necessary support services, such as Legal, IPR, Funding and Market Access, to help innovators become sustainable startups.",
];

const focusAreas = [
  { icon: Sprout,     title: "Agriculture",    desc: "Animal husbandry, crop cultivation, farming techniques, food technology and agro processing." },
  { icon: Palette,    title: "Art & Culture",  desc: "Visual arts, performing arts, creative internships, cultural events and cultural heritage." },
  { icon: Heart,      title: "Social Impact",  desc: "Skill development, education development, poverty alleviation and community development." },
  { icon: Recycle,    title: "Sustainability", desc: "Renewable energy, waste management, sustainable fashion, green technologies and eco-friendly products." },
  { icon: Cpu,        title: "Technology",     desc: "Information technology, software development, artificial intelligence, IoT and machine learning." },
  { icon: Tractor,    title: "Rural Economy",  desc: "Farm automation, agri-waste recycling, value addition to farm and forest produce, and local rural employment." },
];

const facilities = [
  { icon: Printer,     title: "3D Printing",           desc: "Single extruder 3D printer for rapid prototyping of parts and product enclosures." },
  { icon: Zap,         title: "Laser Cutting",         desc: "CO2 laser engraver and cutting machine for precise cutting and engraving." },
  { icon: Plane,       title: "UAV & UGV Kits",        desc: "Unmanned aerial and ground vehicle assembly kits to build and test mobility prototypes." },
  { icon: Activity,    title: "Test & Measurement",    desc: "Tektronix 2-channel arbitrary/function generator (60 MHz, 300 MSa/s) and digital and mixed signal oscilloscopes with differential and current probes." },
  { icon: Gauge,       title: "Power & Electronics",   desc: "Keithley digital multimeter with temperature probes, Yokogawa digital power meter with current clamps, and soldering and desoldering kits." },
  { icon: Thermometer, title: "Thermal Imaging",       desc: "FLIR C5 compact thermal camera for testing and diagnostics." },
];

/* ─── Page ───────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div style={{ background: BG_WHITE, position: "relative" }}>
      <PageGeometric />

      <PageHero
        tag="About ACIC"
        line1="BUILT TO"
        line2="EMPOWER"
        line3="BHARATH"
        scriptText="— atal community innovation centre, mlrit"
        description="Established at MLRIT with the support of Atal Innovation Mission, NITI Aayog, to identify, build, and nurture sustainable communities through innovation."
        watermark="ABOUT"
      />

      {/* ── About ACIC ────────────────────────────────────────────── */}
      <section style={{ background: BG_GRAY, ...SECTION_PY }}>
        <div className="page-container">
          <FadeIn>
            <SectionHeader tag="Who We Are" heading="About ACIC MLRIT" />
            <div style={{ maxWidth: "1040px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {aboutAcic.map((line, i) => (
                <p key={i} style={{ fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.8, color: T_BODY }}>
                  {line}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Vision & Approach ─────────────────────────────────────── */}
      <section style={{ background: BG_WHITE, ...SECTION_PY }}>
        <div className="page-container">
          <FadeIn>
            <SectionHeader tag="Direction" heading="Vision & Approach" center />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {visionMission.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.12}>
                <div
                  className="card-light h-full relative overflow-hidden"
                  style={{ padding: "clamp(28px,4vw,44px)", borderRadius: "18px" }}
                >
                  <div
                    className="absolute top-0 right-0 rounded-full pointer-events-none"
                    style={{
                      width: "130px", height: "130px",
                      background: ORANGE, opacity: 0.05,
                      transform: "translate(35%, -35%)",
                    }}
                  />
                  <div
                    style={{
                      width: "52px", height: "52px", borderRadius: "14px",
                      background: `${ORANGE}12`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <item.icon size={24} style={{ color: ORANGE }} />
                  </div>
                  <div style={{ width: "32px", height: "3px", background: ORANGE, borderRadius: "2px", marginBottom: "18px" }} />
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)", fontWeight: 800,
                      fontSize: "22px", letterSpacing: "-0.02em",
                      color: T_HEAD, marginBottom: "14px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.78, color: T_BODY }}>
                    {item.content}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Objectives ────────────────────────────────────────────── */}
      <section style={{ background: BG_GRAY, ...SECTION_PY }}>
        <div className="page-container">
          <FadeIn>
            <SectionHeader
              tag="What We Aim For"
              heading="Our Objectives"
              sub="Six objectives that guide every ACIC-MLRIT program."
            />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4 items-stretch">
            {objectives.map((obj, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div
                  className="card-light flex items-start gap-4 h-full"
                  style={{ padding: "clamp(18px,3vw,26px)", borderRadius: "14px" }}
                >
                  <span
                    style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: ORANGE, color: "#FFFFFF",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-heading)", fontWeight: 900,
                      fontSize: "12px", flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={{ fontSize: "clamp(14px,1.3vw,16px)", lineHeight: 1.72, color: T_BODY }}>
                    {obj}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Focus Areas ───────────────────────────────────────────── */}
      <section id="focus-areas" style={{ background: BG_WHITE, ...SECTION_PY }}>
        <div className="page-container">
          <FadeIn>
            <SectionHeader
              tag="Focus Areas"
              heading="Where We Innovate"
              sub="We support innovators and startups solving real community problems across these sectors."
              center
            />
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {focusAreas.map((area, i) => (
              <FadeIn key={area.title} delay={i * 0.08}>
                <div
                  className="card-light h-full"
                  style={{ padding: "clamp(22px,3vw,34px)", borderRadius: "16px" }}
                >
                  <div
                    style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: `${ORANGE}0f`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "18px",
                    }}
                  >
                    <area.icon size={20} style={{ color: ORANGE }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)", fontWeight: 800,
                      fontSize: "16px", color: T_HEAD, letterSpacing: "-0.01em",
                      marginBottom: "10px",
                    }}
                  >
                    {area.title}
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.72, color: T_MUTED }}>
                    {area.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Facilities ────────────────────────────────────────────── */}
      <section id="facilities" style={{ background: BG_GRAY, ...SECTION_PY }}>
        <div className="page-container">
          <FadeIn>
            <SectionHeader
              tag="Infrastructure"
              heading="Makerspace & Sector-Specific Labs"
              sub="Our makerspace and sector-specific labs are fully equipped with cutting-edge equipment and resources, making it easy to design, develop and test your prototypes."
              center
            />
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {facilities.map((facility, i) => (
              <FadeIn key={facility.title} delay={i * 0.06}>
                <div
                  className="card-light h-full"
                  style={{ padding: "clamp(22px,3vw,34px)", borderRadius: "16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: `${ORANGE}0f`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "18px",
                    }}
                  >
                    <facility.icon size={20} style={{ color: ORANGE }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)", fontWeight: 800,
                      fontSize: "16px", color: T_HEAD, letterSpacing: "-0.01em",
                      marginBottom: "10px",
                    }}
                  >
                    {facility.title}
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.72, color: T_MUTED }}>
                    {facility.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────── */}
      <section style={{ background: "#0A0A0A", ...SECTION_PY }}>
        <div className="page-container text-center">
          <FadeIn>
            <span className="section-tag" style={{ background: `${ORANGE}18`, color: ORANGE, border: "none" }}>
              ACIC · MLRIT
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "clamp(28px, 4.5vw, 52px)",
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                color: "#FFFFFF",
                marginTop: "14px",
                maxWidth: "760px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Empowering Innovations for Bharath.
            </h2>
            <p
              style={{
                fontSize: "clamp(15px,1.4vw,17px)",
                lineHeight: 1.8,
                color: "#9CA3AF",
                maxWidth: "620px",
                margin: "20px auto 0",
              }}
            >
              Bring an idea, a prototype or a growing startup. Reach out to join a program,
              use the makerspace, or partner with ACIC-MLRIT.
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
