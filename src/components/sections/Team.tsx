'use client'

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTeam } from "../../contexts/TeamContext";
import type { TeamMember } from "../../types/index";

interface TeamCardProps {
  m: TeamMember;
  i: number;
  inView: boolean;
}

function TeamCard({ m, i, inView }: TeamCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.14 }}
      className="relative"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      data-hover
    >
      {/* Card wrapper — flips on hover */}
      <div
        className="relative w-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: 340,
        }}
      >
        {/* ── Front ── */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-8 border"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderColor: "rgba(242,237,228,0.08)",
            background: "var(--card)",
          }}
        >
          {/* Index + accent line */}
          <div className="flex items-center justify-between">
            <span
              className="font-['DM_Mono'] text-[10px] tracking-[0.25em] uppercase"
              style={{ color: "rgba(242,237,228,0.2)" }}
            >
              {m.index}
            </span>
            <div className="w-6 h-px" style={{ background: m.accent }} />
          </div>

          {/* Giant initials */}
          <div
            className="font-['Playfair_Display'] font-black leading-none select-none"
            style={{
              fontSize: "clamp(5rem, 10vw, 8rem)",
              color: "transparent",
              WebkitTextStroke: `1px ${m.accent}40`,
              letterSpacing: "-0.04em",
            }}
          >
            {m.initials}
          </div>

          {/* Name + role */}
          <div>
            <div
              className="w-4 h-px mb-4 transition-all duration-500"
              style={{ background: m.accent }}
            />
            <h3 className="font-['Playfair_Display'] font-bold text-xl text-foreground mb-1">
              {m.name}
            </h3>
            <p
              className="font-['DM_Mono'] text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(242,237,228,0.38)" }}
            >
              {m.role}
            </p>
          </div>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-8 border"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderColor: m.accent + "30",
            background: "var(--card)",
          }}
        >
          {/* Accent corner decoration */}
          <div className="flex items-start justify-between">
            <span
              className="font-['DM_Mono'] text-[10px] tracking-[0.25em] uppercase"
              style={{ color: m.accent }}
            >
              {m.role}
            </span>
            <div
              className="w-5 h-5 border-t border-r"
              style={{ borderColor: m.accent + "60" }}
            />
          </div>

          {/* Bio */}
          <p
            className="font-['DM_Sans'] text-sm leading-relaxed"
            style={{ color: "rgba(242,237,228,0.65)" }}
          >
            {m.bio}
          </p>

          {/* Tools */}
          <div>
            <p
              className="font-['DM_Mono'] text-[9px] tracking-[0.25em] uppercase mb-3"
              style={{ color: "rgba(242,237,228,0.25)" }}
            >
              Tools & Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {m.tools.map((t) => (
                <span
                  key={t}
                  className="font-['DM_Mono'] text-[10px] tracking-wider px-3 py-1.5"
                  style={{
                    border: `1px solid ${m.accent}35`,
                    color: m.accent,
                    background: m.accent + "0A",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { teamMembers } = useTeam();

  return (
    <section
      id="team"
      ref={ref}
      className="py-36 max-w-[1440px] mx-auto px-8 md:px-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20"
      >
        <div>
          <span
            className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-4 block"
            style={{ color: "var(--accent)" }}
          >
            The Team
          </span>
          <h2
            className="font-['Playfair_Display'] font-black leading-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            Small team.
            <br />
            Huge ambition.
          </h2>
        </div>
        <p
          className="font-['DM_Mono'] text-[10px] tracking-[0.2em] uppercase max-w-xs"
          style={{ color: "rgba(242,237,228,0.3)" }}
        >
          Hover each card to learn more ↗
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {teamMembers.map((m, i) => (
          <TeamCard key={m.id} m={m} i={i} inView={inView} />
        ))}
      </div>
    </section>
  );
}
