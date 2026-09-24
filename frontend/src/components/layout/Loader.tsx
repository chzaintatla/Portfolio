"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { EASE } from "@/animations/variants";

const WAVE = "M5 14 C 30 14, 35 4, 60 4 S 90 16, 115 16 S 150 4, 195 6";

/**
 * Runs before first paint: returning visitors (this session) and reduced-motion users never see the
 * intro, so there's no flash of the overlay. Rendered as an inline <script> in the site layout.
 */
export const INTRO_SCRIPT = `try{if(sessionStorage.getItem("sw_intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="skip"}sessionStorage.setItem("sw_intro","1")}catch(e){document.documentElement.dataset.intro="skip"}`;

/**
 * First-visit intro: the wave draws, a spark runs along it, the overlay lifts. It is server-rendered so
 * it covers the page from the first frame, never waits on data, and leaves after ~1.2s.
 */
export function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "skip") {
      // Pre-paint script already hid it; drop it from the tree too.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => setShow(false), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          className="intro-overlay fixed inset-0 z-[120] flex items-center justify-center bg-midnight"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="relative h-28 w-28 overflow-hidden rounded-[1.75rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-mark.png" alt="" className="h-full w-full object-contain" />
              {/* the spark: a light streak sweeping across the mark */}
              <span className="intro-spark absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <svg viewBox="0 0 200 20" className="mt-5 w-40">
              <path d={WAVE} fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="intro-wave" />
            </svg>
          </motion.div>
          <style>{`
            html[data-intro="skip"] .intro-overlay { display: none; }
            .intro-wave { stroke-dashoffset: 1; animation: intro-draw .8s cubic-bezier(.22,1,.36,1) forwards; }
            @keyframes intro-draw { to { stroke-dashoffset: 0; } }
            .intro-spark { transform: skewX(-20deg); animation: intro-sweep .9s .2s ease-out forwards; }
            @keyframes intro-sweep { to { left: 130%; } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
