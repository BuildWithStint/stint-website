import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MANIFESTO_POINTS } from "../../constants";

export function Manifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-36 relative overflow-hidden"
      style={{ background: "var(--card)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(200,151,61,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-8 md:px-16">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span
              className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-5 block"
              style={{ color: "var(--accent)" }}
            >
              Our Position
            </span>
            <h2
              className="font-['Playfair_Display'] font-black leading-tight mb-8"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Newcomers who refuse to act like it.
            </h2>
            <p
              className="font-['DM_Sans'] text-base leading-relaxed"
              style={{ color: "rgba(242,237,228,0.55)" }}
            >
              We don't have decades of client work to show you. What we have is
              sharper: a burning need to make something worth looking at. Every
              brief we take is the most important one we've ever worked on —
              because so far, it is.
            </p>
          </motion.div>

          <div className="space-y-0">
            {MANIFESTO_POINTS.map((m, i) => (
              <motion.div
                key={m.n}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group flex items-start gap-6 py-7 border-b transition-all duration-300"
                style={{ borderColor: "rgba(242,237,228,0.07)" }}
              >
                <span
                  className="font-['DM_Mono'] text-[10px] tracking-widest mt-1 shrink-0"
                  style={{ color: "var(--accent)", opacity: 0.7 }}
                >
                  {m.n}
                </span>
                <span
                  className="font-['Playfair_Display'] font-medium text-xl leading-snug group-hover:text-foreground transition-colors duration-300"
                  style={{ color: "rgba(242,237,228,0.6)" }}
                >
                  {m.line}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
