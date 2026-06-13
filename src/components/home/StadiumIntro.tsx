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
          {/* Night sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#03081c] via-[#0a1a3f] to-[#14336b]" />

          {/* Far stand (curved upper tier) */}
          <motion.div
            style={{ opacity: crowdOpacity }}
            className="absolute top-0 left-0 right-0 h-[34%] overflow-hidden rounded-b-[50%] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute inset-0 stadium-seats" />
            <div className="absolute inset-0 stadium-crowd" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
            {/* Roof */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-black/70" />
            <div className="absolute top-3 left-0 right-0 h-6 bg-gradient-to-b from-black/40 to-transparent" />
          </motion.div>

          {/* Left side stand (perspective) */}
          <motion.div
            style={{ opacity: crowdOpacity }}
            className="absolute top-[14%] left-0 h-[55%] w-[28%] [clip-path:polygon(0%_0%,100%_15%,55%_100%,0%_100%)] shadow-[10px_0_40px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 stadium-seats" />
            <div className="absolute inset-0 stadium-crowd" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
          </motion.div>

          {/* Right side stand (perspective) */}
          <motion.div
            style={{ opacity: crowdOpacity }}
            className="absolute top-[14%] right-0 h-[55%] w-[28%] [clip-path:polygon(0%_15%,100%_0%,100%_100%,45%_100%)] shadow-[-10px_0_40px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 stadium-seats" />
            <div className="absolute inset-0 stadium-crowd" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/60" />
          </motion.div>

          {/* Floodlight pylons */}
          <motion.div style={{ opacity: floodlightOpacity }} className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[6%] left-[6%] h-32 w-1.5 bg-white/30" />
            <div className="absolute top-[5%] left-[6%] h-16 w-28 -translate-x-1/2 rounded-full bg-white/40 blur-2xl" />
            <div className="absolute top-[5%] left-[6%] -translate-x-1/2 [clip-path:polygon(50%_0%,0%_100%,100%_100%)] h-[60vh] w-64 bg-gradient-to-b from-white/15 to-transparent" />

            <div className="absolute top-[6%] right-[6%] h-32 w-1.5 bg-white/30" />
            <div className="absolute top-[5%] right-[6%] h-16 w-28 translate-x-1/2 rounded-full bg-white/40 blur-2xl" />
            <div className="absolute top-[5%] right-[6%] translate-x-1/2 [clip-path:polygon(50%_0%,0%_100%,100%_100%)] h-[60vh] w-64 bg-gradient-to-b from-white/15 to-transparent" />
          </motion.div>

          {/* Pitch */}
          <motion.div
            style={{ y: pitchTranslateY }}
            className="absolute bottom-0 left-0 right-0 h-2/3 pitch-realistic [clip-path:polygon(8%_0%,92%_0%,100%_100%,0%_100%)] shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
          >
            {/* Touchline */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-white/80" />
            {/* Halfway line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-white/90" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] sm:w-[40%] h-[1px] bg-white/0" />
            {/* Centre circle */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 h-24 w-24 sm:h-36 sm:w-36 rounded-full border-2 border-white/70" />
            {/* Penalty box */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 sm:w-[28rem] h-24 sm:h-40 border-2 border-t-0 border-white/70" />
            {/* 6-yard box */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-52 h-10 sm:h-16 border-2 border-t-0 border-white/70" />
            {/* Penalty arc */}
            <div className="absolute top-24 sm:top-40 left-1/2 -translate-x-1/2 h-12 w-24 sm:h-16 sm:w-32 rounded-b-full border-2 border-t-0 border-white/70" />
            {/* Corner arcs */}
            <div className="absolute top-0 left-[8%] h-6 w-6 -translate-x-3 -translate-y-3 rounded-full border-2 border-white/70" />
            <div className="absolute top-0 right-[8%] h-6 w-6 translate-x-3 -translate-y-3 rounded-full border-2 border-white/70" />
            {/* Mown stripes overlay handled by .pitch-realistic */}
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
