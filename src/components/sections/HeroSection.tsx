'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Sparkles, Film, Award, TrendingUp, Camera, Aperture } from 'lucide-react';

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
    <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 overflow-hidden scroll-mt-24">
      {/* Atmospheric Blended Background Image with multi-direction gradient feathering */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 opacity-15 dark:opacity-25 mix-blend-luminosity dark:mix-blend-screen">
          <Image
            src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1920&q=80"
            alt="Cinematic production lighting"
            fill
            priority
            className="object-cover object-center filter saturate-150"
          />
        </div>
        {/* Seamless feathering gradients to blend into light & dark background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/95 via-slate-50/60 to-slate-50 dark:from-black/95 dark:via-black/70 dark:to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-transparent to-slate-50/80 dark:from-black/80 dark:via-transparent dark:to-black/80" />
      </div>

      {/* Ambient Colored Atmosphere Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-tr from-purpo-purple/20 via-purpo-purple-glow/15 to-purpo-cyan/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-purpo-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-purpo-cyan/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto">
        {/* Main Content Grid: Left Column Text & CTAs / Right Column Blended Cinema Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-16">
          
          {/* Left Column (7 cols): Editorial Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Top Agency Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 px-3.5 py-1.5 rounded-full glass-card border border-zinc-200/80 dark:border-white/10 mb-6 shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purpo-cyan animate-pulse" />
                <span className="text-[11px] sm:text-xs uppercase tracking-widest text-zinc-700 dark:text-zinc-300 font-semibold">
                  Creative Digital Agency • Lagos
                </span>
              </div>
              <span className="hidden sm:inline text-zinc-300 dark:text-white/20">|</span>
              <span className="text-[11px] sm:text-xs text-purpo-purple dark:text-purpo-cyan font-bold flex items-center">
                <Sparkles size={11} className="mr-1" />
                Available Worldwide
              </span>
            </motion.div>

            {/* Headline: Refined font size from oversized text-8xl down to elegant text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.12] mb-5 text-zinc-900 dark:text-white"
            >
              Transforming Stories Into{' '}
              <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
                Powerful
              </span>{' '}
              <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
                Digital Experiences
              </span>
            </motion.h1>

            {/* Subheadline: Refined size and line-height */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed font-normal mb-8"
            >
              We are <strong className="text-zinc-900 dark:text-white font-semibold">PURPO</strong> — a premier creative agency rooted in Yaba, Lagos. We produce cinema-grade commercials, viral social media campaigns, and visual strategies that command global attention.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              <button
                onClick={() => handleScrollTo('work')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow hover:from-purpo-purple-hover hover:to-purpo-purple text-white font-semibold text-xs uppercase tracking-wider shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>View Portfolio</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => handleScrollTo('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full glass-card border border-zinc-300 dark:border-white/15 hover:border-purpo-purple hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-900 dark:text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Contact Us</span>
              </button>

              {onOpenReel && (
                <button
                  onClick={onOpenReel}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-full text-zinc-700 hover:text-purpo-purple dark:text-zinc-300 dark:hover:text-purpo-cyan transition-colors group cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center group-hover:bg-purpo-purple group-hover:text-white dark:group-hover:bg-purpo-cyan dark:group-hover:text-black transition-colors">
                    <Play size={12} className="ml-0.5 fill-current" />
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold">2026 Showreel</span>
                </button>
              )}
            </motion.div>
          </div>

          {/* Right Column (5 cols): Professional Blended Cinema Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative w-full max-w-lg mx-auto lg:max-w-none"
          >
            {/* Ambient Backlight Halo behind image card */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-purpo-purple/40 via-purpo-purple-glow/30 to-purpo-cyan/30 rounded-3xl blur-2xl opacity-75 dark:opacity-60 pointer-events-none" />

            {/* The Blended Image Container */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200/90 dark:border-white/15 shadow-2xl bg-zinc-950">
              
              {/* Image Frame with Aspect Ratio */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
                  alt="PURPO Cinema Rig & Production in Lagos"
                  fill
                  priority
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Professional Multi-stop Gradient Masks for Seamless Blending */}
                {/* 1. Dark bottom vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
                {/* 2. Top subtle gradient for HUD readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
                {/* 3. Subtle purple/cyan cinematic tint */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purpo-purple/20 via-transparent to-purpo-cyan/15 mix-blend-overlay pointer-events-none" />

                {/* Cinema Viewfinder HUD: Top Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white/90 text-[11px] font-mono tracking-wider z-10 pointer-events-none">
                  {/* REC Indicator with pulsing red dot */}
                  <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-bold tracking-widest text-red-400">REC</span>
                    <span className="text-white/60">|</span>
                    <span>24.00 FPS</span>
                  </div>

                  {/* Camera Specs */}
                  <div className="hidden sm:flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <Aperture size={12} className="text-purpo-cyan" />
                    <span>8K RAW • T2.0</span>
                  </div>
                </div>

                {/* Center Viewfinder Reticle Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-purpo-cyan rounded-full" />
                  </div>
                </div>

                {/* Bottom Overlay Info Panel */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="p-3.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 text-white shadow-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purpo-purple to-purpo-cyan flex items-center justify-center shrink-0 shadow-md">
                        <Camera size={18} className="text-white" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-display font-bold text-xs sm:text-sm tracking-wide text-white">
                            RED Cinema Rig
                          </span>
                          <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-purpo-purple/40 text-purpo-purple-light font-semibold">
                            Master 8K
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-300 font-medium">
                          On Set in Ikoyi & Yaba Studio • Lagos
                        </span>
                      </div>
                    </div>

                    {/* Animated Audio Meter */}
                    <div className="hidden sm:flex items-end space-x-1 h-5 px-2 py-0.5 bg-white/5 rounded">
                      <span className="w-1 bg-purpo-cyan h-3 animate-pulse" />
                      <span className="w-1 bg-purpo-purple-light h-4 animate-pulse [animation-delay:150ms]" />
                      <span className="w-1 bg-emerald-400 h-2 animate-pulse [animation-delay:300ms]" />
                      <span className="w-1 bg-purpo-purple-glow h-5 animate-pulse [animation-delay:450ms]" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Floating Glass Pill Badge (overlapping bottom edge) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-4 -left-3 sm:-left-4 glass-card px-3.5 py-2 rounded-2xl border border-zinc-200/90 dark:border-white/15 shadow-xl flex items-center space-x-2 text-xs font-semibold text-zinc-900 dark:text-white"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] sm:text-xs">Live Productions Active</span>
            </motion.div>
          </motion.div>

        </div>

        {/* Key Agency Statistics: 4 Column Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 w-full"
        >
          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 text-center hover:border-purpo-purple/40 transition-colors">
            <div className="flex items-center justify-center space-x-1.5 text-purpo-purple mb-1">
              <Film size={18} />
              <span className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">150+</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Cinematic Films Shot</p>
          </div>

          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 text-center hover:border-purpo-cyan/40 transition-colors">
            <div className="flex items-center justify-center space-x-1.5 text-purpo-cyan mb-1">
              <TrendingUp size={18} />
              <span className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">12M+</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Social Video Views</p>
          </div>

          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 text-center hover:border-purpo-purple-light/40 transition-colors">
            <div className="flex items-center justify-center space-x-1.5 text-purpo-purple-light mb-1">
              <Award size={18} />
              <span className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">99%</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Client Retention</p>
          </div>

          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 text-center hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-500 dark:text-emerald-400 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              <span className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Yaba</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Lagos Studio Base</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
