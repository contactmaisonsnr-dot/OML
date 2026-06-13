"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const RINGS = [0, 1, 2, 3, 4, 5, 6, 7];

export default function StadiumIntro({
  heroTitle,
  heroSubtitle,
}: {
  heroTitle: string;
  heroSubtitle: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Tunnel phase: 0 -> 0.55, Pitch reveal phase: 0.45 -> 1
  const tunnelOpacity = useTransform(scrollYProgress, [0, 0.45, 0.6], [1, 1, 0]);
  const tunnelLightScale = useTransform(scrollYProgress, [0, 0.55], [0.3, 6]);
  const tunnelLightOpacity = useTransform(scrollYProgress, [0, 0.3, 0.55], [0.4, 0.9, 1]);

  const introTextOpacity = useTransform(scrollYProgress, [0, 0.08, 0.25, 0.35], [0, 1, 1, 0]);
  const introTextScale = useTransform(scrollYProgress, [0, 0.35], [0.85, 1.4]);

  const pitchOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const pitchTranslateY = useTransform(scrollYProgress, [0.45, 0.75], ["40%", "0%"]);
  const crowdOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const floodlightOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);

  const finalTextOpacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1]);
  const finalTextY = useTransform(scrollYProgress, [0.7, 0.9], [40, 0]);

  return (
    <section ref={containerRef} className="relative h-[400vh] -mt-20 bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Tunnel */}
        <motion.div
          style={{ opacity: tunnelOpacity, perspective: 600 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Tunnel walls */}
          <div className="absolute inset-0 [background:repeating-linear-gradient(110deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_2px,transparent_2px,transparent_60px)]" />
          <div className="absolute inset-0 [background:repeating-linear-gradient(70deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_2px,transparent_2px,transparent_60px)]" />

          {RINGS.map((i) => (
            <div
              key={i}
              className="absolute border-2 border-white/10 rounded-sm"
              style={{
                width: `${20 + i * 11}%`,
                height: `${20 + i * 11}%`,
                boxShadow: "inset 0 0 60px rgba(20,51,107,0.5)",
              }}
            />
          ))}

          {/* Glowing pitch light at the end of the tunnel */}
          <motion.div
            style={{ scale: tunnelLightScale, opacity: tunnelLightOpacity }}
            className="absolute h-24 w-40 rounded-full bg-gradient-to-b from-green-300 via-green-500 to-green-700 blur-md"
          />

          {/* Intro text */}
          <motion.div
            style={{ opacity: introTextOpacity, scale: introTextScale }}
            className="absolute text-center px-6"
          >
            <p className="text-oml-gold text-sm sm:text-base tracking-[0.3em] uppercase mb-3">
              Bienvenue au stade
            </p>
            <h1 className="text-white text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">
              {heroTitle}
            </h1>
          </motion.div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60 text-xs uppercase tracking-widest animate-bounce">
            <span>Faites défiler</span>
            <span className="text-2xl mt-1">⌄</span>
          </div>
        </motion.div>

        {/* Stadium / Pitch reveal */}
        <motion.div
          style={{ opacity: pitchOpacity }}
          className="absolute inset-0"
        >
          {/* Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3f] via-[#14336b] to-[#1a5e2a]" />

          {/* Floodlights */}
          <motion.div style={{ opacity: floodlightOpacity }} className="absolute inset-0">
            <div className="absolute top-6 left-[8%] h-40 w-2 bg-white/20" />
            <div className="absolute top-6 left-[8%] h-24 w-24 -translate-x-1/2 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute top-6 right-[8%] h-40 w-2 bg-white/20" />
            <div className="absolute top-6 right-[8%] h-24 w-24 translate-x-1/2 rounded-full bg-white/30 blur-2xl" />
          </motion.div>

          {/* Crowd */}
          <motion.div
            style={{ opacity: crowdOpacity }}
            className="absolute top-0 left-0 right-0 h-1/3 [background-image:radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1.5px)] [background-size:14px_14px] opacity-40"
          />

          {/* Pitch */}
          <motion.div
            style={{ y: pitchTranslateY }}
            className="absolute bottom-0 left-0 right-0 h-2/3 bg-pitch"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-white/70" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 h-28 w-28 rounded-full border-2 border-white/60" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-white/80" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-20 border-2 border-t-0 border-white/60" />
          </motion.div>

          {/* Final text */}
          <motion.div
            style={{ opacity: finalTextOpacity, y: finalTextY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <h2 className="text-white text-3xl sm:text-5xl font-extrabold drop-shadow-lg mb-4">
              {heroTitle}
            </h2>
            <p className="text-white/80 text-base sm:text-xl max-w-xl">
              {heroSubtitle}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
