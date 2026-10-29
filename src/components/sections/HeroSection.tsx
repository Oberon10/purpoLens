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
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Atmosphere Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purpo-purple/25 via-purpo-purple-glow/20 to-purpo-cyan/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-purpo-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-purpo-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Top Agency Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full glass-card border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-purpo-cyan animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-zinc-300 font-medium">
              Creative Digital Agency • Lagos, Nigeria
            </span>
            <span className="text-white/20">|</span>
            <span className="text-xs text-purpo-cyan font-semibold flex items-center space-x-1">
              <Sparkles size={12} className="inline mr-1" />
              Available for Global Commissions
            </span>
          </motion.div>

          {/* PURPO Brand Logo Reveal in Hero */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6 drop-shadow-[0_0_40px_rgba(94,96,206,0.65)]"
          >
            <Image
              src="/images/purpo-logo.png"
              alt="PURPO"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Brand Name Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] mb-6"
          >
            Transforming Stories Into{' '}
            <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Powerful
            </span>{' '}
            <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
              Digital Experiences
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-light mb-10"
          >
            We are <strong className="text-white font-medium">PURPO</strong> — a premium creative agency
            rooted in Yaba, Lagos. We produce cinema-grade commercials, viral social media content,
            and brand strategies that command global attention.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
          >
            <button
              onClick={() => handleScrollTo('work')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow hover:from-purpo-purple-hover hover:to-purpo-purple text-white font-semibold text-sm tracking-wider uppercase shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>View Portfolio</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => handleScrollTo('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-full glass-card border border-white/15 hover:border-purpo-purple hover:bg-white/5 text-white font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Contact Us</span>
            </button>

            {onOpenReel && (
              <button
                onClick={onOpenReel}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-4 rounded-full text-zinc-300 hover:text-purpo-cyan transition-colors group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-purpo-cyan group-hover:text-black transition-colors">
                  <Play size={13} className="ml-0.5 fill-current" />
                </span>
                <span className="text-xs uppercase tracking-wider font-medium">Watch 2026 Showreel</span>
              </button>
            )}
          </motion.div>

          {/* Key Agency Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-purpo-purple mb-1">
                <Film size={18} />
                <span className="font-display text-2xl sm:text-3xl font-bold text-white">150+</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Cinematic Films Shot</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-purpo-cyan mb-1">
                <TrendingUp size={18} />
                <span className="font-display text-2xl sm:text-3xl font-bold text-white">12M+</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Social Video Views</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-purpo-purple-light mb-1">
                <Award size={18} />
                <span className="font-display text-2xl sm:text-3xl font-bold text-white">99%</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Client Retention</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-400 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-display text-2xl sm:text-3xl font-bold text-white">Yaba</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Lagos Studio Base</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
