'use client'

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MagneticBtn } from "../MagneticBtn";
import { SITE_CONFIG } from "../../constants";

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [enableHeavyFx, setEnableHeavyFx] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only attach pointer parallax + render the expensive grain filter on
    // devices with a precise pointer (desktop). On touch / low-power devices
    // the SVG turbulence + spring animation stutters the headline reveal.
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    setEnableHeavyFx(true);

    const fn = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
      });
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Parallax bg */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
        style={{ scale: 1.06 }}
      >
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=600&fit=crop&auto=format&q=60"
          srcSet="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop&auto=format&q=55 600w,
                  https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=600&fit=crop&auto=format&q=60 900w,
                  https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&h=933&fit=crop&auto=format&q=65 1400w,
                  https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&h=1200&fit=crop&auto=format&q=70 1800w"
          sizes="100vw"
          alt="Abstract creative"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.15) saturate(0.5)" }}
        />
      </motion.div>

      {/* Gradient veil */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,151,61,0.07) 0%, transparent 70%), linear-gradient(to bottom, rgba(10,10,11,0.2) 0%, rgba(10,10,11,0.85) 100%)",
        }}
      />

      {/* Animated grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i + 1) * (100 / 7)}%`,
              background: "#F2EDE4",
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${(i + 1) * 25}%`,
              background: "#F2EDE4",
            }}
          />
        ))}
      </div>

      {/* Grain (desktop only — feTurbulence is GPU-expensive on mobile) */}
      {enableHeavyFx && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06] hidden md:block"
          aria-hidden
        >
          <filter id="g">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#g)" />
        </svg>
      )}

      <div className="relative max-w-[1440px] mx-auto px-8 md:px-16 w-full pt-28">
        {/* SEO: real semantic H1 — visually hidden, read by Google + screen readers */}
        <h1 className="sr-only">
          Hire senior freelance developers — STINT builds web, mobile, Next.js,
          React, MERN, backend, and cloud software for startups and growing teams.
        </h1>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-3 mb-12 px-4 py-2 border"
          style={{
            borderColor: "rgba(200,151,61,0.3)",
            background: "rgba(200,151,61,0.06)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--accent)" }}
          />
          <span
            className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            {SITE_CONFIG.status} · {SITE_CONFIG.year}
          </span>
        </motion.div>

        {/* Headline — pure CSS keyframe reveal (see globals.css .hero-line) */}
        <div className="overflow-hidden pb-6 -mb-2">
          <div
            className="hero-line hero-line--1 font-['Playfair_Display'] font-black text-foreground leading-[1]"
            style={{ fontSize: "clamp(3.8rem, 11vw, 10.5rem)" }}
            aria-hidden="true"
          >
            Design.
          </div>
        </div>

        <div className="overflow-hidden pb-2 -mb-2">
          <div
            className="hero-line hero-line--2 font-['Playfair_Display'] font-black italic leading-[1]"
            style={{
              fontSize: "clamp(3.8rem, 11vw, 10.5rem)",
              color: "var(--accent)",
            }}
            aria-hidden="true"
          >
            Build.
          </div>
        </div>

        <div className="overflow-hidden pb-2 mb-8">
          <div
            className="hero-line hero-line--3 font-['Playfair_Display'] font-black text-foreground leading-[1]"
            style={{ fontSize: "clamp(3.8rem, 11vw, 10.5rem)" }}
            aria-hidden="true"
          >
            Scale.
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
        >
          <div className="max-w-md">
            <p
              className="font-['DM_Sans'] text-lg leading-relaxed"
              style={{ color: "rgba(242,237,228,0.55)" }}
            >
              A digital product and software studio. We design and build
              dependable software that helps teams move faster.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <MagneticBtn
              href="#work"
              className="flex items-center gap-3 px-8 py-4 font-['DM_Mono'] text-xs tracking-[0.2em] uppercase border border-foreground/20 text-foreground hover:border-foreground/60 transition-all duration-300"
            >
              See Our Work
            </MagneticBtn>

            <MagneticBtn
              href="#contact"
              className="flex items-center gap-3 px-8 py-4 font-['DM_Mono'] text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-90"
              style={{ background: "var(--accent)", color: "#0A0A0B" }}
            >
              Work With Us <ArrowUpRight size={14} />
            </MagneticBtn>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
