'use client'

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);

  const springX = useSpring(cursorX, { stiffness: 120, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };

    const over = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[data-hover]")) {
        setHovered(true);
      }
    };

    const out = () => setHovered(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      <motion.div
        animate={{ scale: hovered ? 1.1 : 1, opacity: hovered ? 0.4 : 0.6 }}
        transition={{ scale: { duration: 0.25 }, opacity: { duration: 0.2 } }}
        className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: springX, y: springY, background: "#F2EDE4" }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
        style={{ x: dotX, y: dotY, background: "var(--accent)" }}
      />
    </>
  );
}
