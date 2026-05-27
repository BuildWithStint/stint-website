'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { MagneticBtn } from "./MagneticBtn";
import { NAV_LINKS } from "../constants";
const stintLogo = "/stint-logo.png";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10,10,11,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(242,237,228,0.06)" : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 flex items-center justify-between h-20">
        <a
          href="#"
          className="flex items-center"
          onClick={(e) => {
            e.preventDefault();
            // Check if user is holding Shift key for admin access
            if (e.shiftKey) {
              window.location.href = '/admin';
            }
          }}
        >
          <img 
            src={stintLogo} 
            alt="STINT Logo" 
            className="h-20 w-auto"
            style={{
              mixBlendMode: 'screen',
              filter: 'brightness(1.2) contrast(1.1)'
            }}
          />
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="text-xs font-['DM_Mono'] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
              >
                {l}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: "var(--accent)" }}
                />
              </a>
            </li>
          ))}
        </ul>

        <MagneticBtn
          href="#contact"
          className="hidden md:flex items-center gap-2 px-6 py-3 text-xs font-['DM_Mono'] tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-90"
          style={{ background: "var(--accent)", color: "#0A0A0B" }}
        >
          Hire Us <ArrowUpRight size={14} />
        </MagneticBtn>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden px-8 pb-8 pt-2 space-y-5 overflow-hidden"
          style={{ background: "rgba(10,10,11,0.98)" }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block font-['Playfair_Display'] text-3xl font-bold text-foreground border-b border-border pb-4"
            >
              {l}
            </a>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
