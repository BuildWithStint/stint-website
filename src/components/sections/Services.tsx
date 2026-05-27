'use client'

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES } from "../../data/services";

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="services"
      ref={ref}
      className="py-36 max-w-[1440px] mx-auto px-8 md:px-16"
    >
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
          What We Do
        </span>
        <h2
          className="font-['Playfair_Display'] font-black leading-tight"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
        >
          Built to do it all,
          <br />
          exceptionally well.
        </h2>
      </motion.div>

      <div
        className="space-y-0 border-t"
        style={{ borderColor: "rgba(242,237,228,0.07)" }}
      >
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.number}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="group relative border-b cursor-pointer transition-all duration-500"
              style={{ borderColor: "rgba(242,237,228,0.07)" }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              data-hover
            >
              <div
                className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, ${s.color}08 0%, transparent 60%)`,
                  borderLeft: `2px solid ${s.color}`,
                }}
              />

              <div className="relative py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-1 md:px-4">
                <div className="flex items-center gap-6 md:gap-10">
                  <span
                    className="font-['DM_Mono'] text-[10px] tracking-widest"
                    style={{ color: "rgba(242,237,228,0.22)" }}
                  >
                    {s.number}
                  </span>

                  <Icon
                    size={18}
                    className="transition-colors duration-300"
                    style={{
                      color:
                        active === i ? s.color : "rgba(242,237,228,0.3)",
                    }}
                  />

                  <h3
                    className="font-['Playfair_Display'] font-bold transition-colors duration-300"
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                      color:
                        active === i
                          ? "var(--foreground)"
                          : "rgba(242,237,228,0.75)",
                    }}
                  >
                    {s.title}
                  </h3>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 pl-16 md:pl-0">
                  <p
                    className="font-['DM_Sans'] text-sm leading-relaxed max-w-xs transition-all duration-500"
                    style={{
                      color:
                        active === i
                          ? "rgba(242,237,228,0.75)"
                          : "rgba(242,237,228,0.5)",
                      maxHeight: active === i ? 80 : 40,
                      overflow: "hidden",
                    }}
                  >
                    {s.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="font-['DM_Mono'] text-[10px] tracking-wider px-3 py-1.5 border transition-all duration-300"
                        style={{
                          borderColor:
                            active === i
                              ? `${s.color}40`
                              : "rgba(242,237,228,0.08)",
                          color:
                            active === i ? s.color : "rgba(242,237,228,0.5)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
