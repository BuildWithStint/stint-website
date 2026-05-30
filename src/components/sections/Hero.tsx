'use client'

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MagneticBtn } from "../MagneticBtn";
import { SITE_CONFIG } from "../../constants";

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
      });
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
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
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&h=1200&fit=crop&auto=format"
          alt="Abstract creative"
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

      {/* Grain */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
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

      <div className="relative max-w-[1440px] mx-auto px-8 md:px-16 w-full pt-28">
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

        {/* Headline */}
        <div className="overflow-hidden pb-6 -mb-2">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="font-['Playfair_Display'] font-black text-foreground leading-[1]"
            style={{ fontSize: "clamp(3.8rem, 11vw, 10.5rem)" }}
          >
            Design.
          </motion.h1>
        </div>

        <div className="overflow-hidden pb-2 -mb-2">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
            className="font-['Playfair_Display'] font-black italic leading-[1]"
            style={{
              fontSize: "clamp(3.8rem, 11vw, 10.5rem)",
              color: "var(--accent)",
            }}
          >
            Build.
          </motion.h1>
        </div>

        <div className="overflow-hidden pb-2 mb-8">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.51 }}
            className="font-['Playfair_Display'] font-black text-foreground leading-[1]"
            style={{ fontSize: "clamp(3.8rem, 11vw, 10.5rem)" }}
          >
            Scale.
          </motion.h1>
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
