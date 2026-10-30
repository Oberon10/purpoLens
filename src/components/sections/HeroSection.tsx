'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Sparkles, Film, Award, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  onOpenReel?: () => void;
}

export default function HeroSection({ onOpenReel }: HeroSectionProps) {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const targetY = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden scroll-mt-24 bg-slate-50 dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300"
    >
      {/* 1. Background Cinema Image provided by user */}
      <div className="absolute inset-0 select-none overflow-hidden pointer-events-none">
        <Image
          src="/images/hero-cinema.png"
          alt="PURPO Cinema Production on Set"
          fill
          priority
          quality={95}
          className="object-cover object-right md:object-center transform scale-105 opacity-80 dark:opacity-100"
        />

        {/* 2. Adaptive Multi-directional Gradient Masks for High-Contrast Text & Seamless Edge Blending */}
        {/* Left-to-right gradient: ensures text on left/center is 100% legible in both light and dark modes */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-slate-50/85 to-slate-50/30 lg:from-slate-50/95 lg:via-slate-50/75 lg:to-transparent dark:from-black/95 dark:via-black/80 dark:to-black/35 dark:lg:from-black/92 dark:lg:via-black/70 dark:lg:to-black/25" />

        {/* Top gradient for fixed navbar clearance */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-50/90 via-slate-50/40 to-transparent dark:from-black/90 dark:via-black/40 dark:to-transparent" />

        {/* Bottom gradient: seamless blend into the following section */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />

        {/* Cinematic Purple & Cyan Ambient Light Glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purpo-purple/15 dark:bg-purpo-purple/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purpo-cyan/15 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* Main Content Area: Text on Top */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto">
        <div className="max-w-3xl">
          {/* Top Agency Badge & Live Production HUD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md border border-zinc-200/90 dark:border-white/15 text-zinc-900 dark:text-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-purpo-cyan animate-pulse" />
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-zinc-700 dark:text-zinc-200 font-semibold">
                Creative Digital Agency • Lagos
              </span>
              <span className="text-zinc-300 dark:text-white/20">|</span>
              <span className="text-[11px] sm:text-xs text-purpo-purple dark:text-purpo-cyan font-bold flex items-center">
                <Sparkles size={11} className="mr-1 inline" />
                Global Commissions
              </span>
            </div>

            {/* Live Camera Status HUD indicator */}
            <div className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-500/10 dark:bg-red-950/60 backdrop-blur-md border border-red-500/30 text-red-600 dark:text-red-400 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[11px] font-mono tracking-wider font-semibold">
                REC ● 4K RAW 24FPS
              </span>
            </div>
          </motion.div>

          {/* Headline on Top: Crisp, balanced, high-contrast in both Light & Dark modes */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] mb-5 text-zinc-950 dark:text-white"
          >
            Transforming Stories Into{' '}
            <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
              Powerful
            </span>{' '}
            <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
              Digital Experiences
            </span>
          </motion.h1>

          {/* Subheadline on Top: High contrast */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-zinc-700 dark:text-zinc-200 max-w-2xl leading-relaxed font-normal mb-8"
          >
            We are <strong className="text-zinc-950 dark:text-white font-semibold">PURPO</strong> — an award-caliber creative agency rooted in Yaba, Lagos. We produce cinema-grade commercials, viral social media campaigns, and brand strategies that command global attention.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
          >
            <button
              onClick={() => handleScrollTo('work')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow hover:from-purpo-purple-hover hover:to-purpo-purple text-white font-semibold text-xs uppercase tracking-wider shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>View Portfolio</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => handleScrollTo('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md border border-zinc-300 dark:border-white/25 hover:border-purpo-purple hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            >
              <span>Contact Us</span>
            </button>

            {onOpenReel && (
              <button
                onClick={onOpenReel}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full text-zinc-700 hover:text-purpo-purple dark:text-zinc-300 dark:hover:text-white transition-colors group cursor-pointer"
              >
                <span className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-white/15 flex items-center justify-center group-hover:bg-purpo-purple group-hover:text-white transition-colors">
                  <Play size={12} className="ml-0.5 fill-current" />
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold">2026 Showreel</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* 4 Key Statistics Cards: docked at bottom of the hero with high-contrast text in both modes */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-black/65 backdrop-blur-md border border-zinc-200/90 dark:border-white/10 text-center hover:border-purpo-purple/50 transition-colors shadow-card">
            <div className="flex items-center justify-center space-x-1.5 text-purpo-purple mb-1">
              <Film size={18} />
              <span className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">150+</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">Cinematic Films Shot</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-black/65 backdrop-blur-md border border-zinc-200/90 dark:border-white/10 text-center hover:border-purpo-cyan/50 transition-colors shadow-card">
            <div className="flex items-center justify-center space-x-1.5 text-purpo-cyan mb-1">
              <TrendingUp size={18} />
              <span className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">12M+</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">Social Video Views</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-black/65 backdrop-blur-md border border-zinc-200/90 dark:border-white/10 text-center hover:border-purpo-purple-light/50 transition-colors shadow-card">
            <div className="flex items-center justify-center space-x-1.5 text-purpo-purple-light mb-1">
              <Award size={18} />
              <span className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">99%</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">Client Retention</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-black/65 backdrop-blur-md border border-zinc-200/90 dark:border-white/10 text-center hover:border-emerald-500/50 transition-colors shadow-card">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              <span className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">Yaba</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">Lagos Studio Base</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
