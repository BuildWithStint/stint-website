import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { WHY_US_POINTS } from "../../constants";

export function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
            "radial-gradient(ellipse 50% 60% at 100% 50%, rgba(200,151,61,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <span
            className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-4 block"
            style={{ color: "var(--accent)" }}
          >
            Why Axis
          </span>
          <h2
            className="font-['Playfair_Display'] font-black leading-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            The case for hiring
            <br />
            us first.
          </h2>
        </motion.div>

        <div
          className="grid md:grid-cols-3 gap-px"
          style={{ background: "rgba(242,237,228,0.06)" }}
        >
          {WHY_US_POINTS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group p-10 bg-card hover:bg-background transition-colors duration-400 relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: "var(--accent)" }}
              />
              <span
                className="font-['Playfair_Display'] font-black text-6xl leading-none mb-8 block"
                style={{ color: "rgba(200,151,61,0.12)" }}
              >
                0{i + 1}
              </span>
              <h3 className="font-['Playfair_Display'] font-bold text-xl mb-4 text-foreground leading-snug">
                {p.title}
              </h3>
              <p
                className="font-['DM_Sans'] text-sm leading-relaxed"
                style={{ color: "rgba(242,237,228,0.45)" }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
