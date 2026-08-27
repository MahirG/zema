"use client";

import { motion, useReducedMotion } from "framer-motion";

const waveform = [12, 18, 25, 16, 34, 28, 45, 31, 52, 38, 58, 42, 68, 54, 76, 62, 82, 70, 88, 64, 79, 56, 84, 71, 92, 76, 86, 63, 74, 51, 66, 43, 59, 49, 72, 62, 83, 68, 91, 74, 85, 61, 77, 55, 69, 46, 57, 38, 52, 34, 45, 29, 39, 25, 34, 21, 29, 18, 25, 16, 22, 14, 18, 12];

export function Waveform(): React.JSX.Element {
  const reduced = useReducedMotion();
  return (
    <div className="hero-waveform" aria-hidden="true">
      {waveform.map((height, index) => (
        <motion.span key={`${height}-${index}`} initial={reduced ? false : { scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 0.32 + (height / 100) * 0.68 }} transition={{ delay: 0.42 + index * 0.008, duration: 0.48, ease: [0.22, 1, 0.36, 1] }} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}
