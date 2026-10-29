'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show loader once per session or quick intro
    const hasLoaded = sessionStorage.getItem('purpo-loaded');
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem('purpo-loaded', 'true');
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
        >
          {/* Ambient background glow */}
          <div className="absolute w-96 h-96 rounded-full bg-purpo-purple/20 blur-[120px] pointer-events-none animate-pulse-slow" />
          <div className="absolute w-80 h-80 rounded-full bg-purpo-cyan/15 blur-[100px] pointer-events-none" />

          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex flex-col items-center z-10"
          >
            <div className="relative w-28 h-28 mb-6 drop-shadow-[0_0_35px_rgba(94,96,206,0.6)]">
              <Image
                src="/images/purpo-logo.png"
                alt="PURPO Creative Agency"
                fill
                className="object-contain"
                priority
              />
            </div>

            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-2xl font-bold tracking-[0.3em] uppercase bg-gradient-to-r from-white via-purpo-gray-200 to-purpo-purple bg-clip-text text-transparent"
            >
              PURPO
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xs uppercase tracking-[0.25em] text-purpo-muted mt-2 text-center"
            >
              Cinematic Videography & Creative Studio
            </motion.p>

            {/* Progress bar */}
            <div className="w-56 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
              />
            </div>

            <div className="text-[10px] text-zinc-500 mt-2 font-mono">
              {progress}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
