'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, Compass, Eye, Target, Zap, MapPin } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-28 overflow-hidden bg-black/60">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purpo-purple/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-purpo-cyan/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border border-white/10 text-xs font-semibold tracking-widest uppercase text-purpo-cyan mb-4">
            <Compass size={13} />
            <span>Who We Are</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Pioneering Cinematic Culture &{' '}
            <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
              Visual Excellence
            </span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
            Headquartered at 27 Ijaoye Street in Jibowu, Yaba — Lagos’s epicenter of creative and technological innovation — PURPO is a hybrid production studio and strategic brand consultancy.
          </p>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Area with Layered Agency Assets */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto w-full aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-white/15 shadow-card group">
              <Image
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
                alt="PURPO Cinematography Production Rig"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Floating Overlay Badge: Location */}
              <div className="absolute bottom-6 left-6 right-6 p-5 glass-panel rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-purpo-cyan text-xs font-semibold uppercase tracking-wider mb-1">
                    <MapPin size={13} />
                    <span>Lagos Creative Hub</span>
                  </div>
                  <p className="text-sm font-medium text-white">
                    27, Ijaoye St, Jibowu, Yaba, Lagos
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purpo-purple/30 border border-purpo-purple flex items-center justify-center text-white text-xs font-bold font-mono">
                  NG
                </div>
              </div>
            </div>

            {/* Overlapping Floating Metric Card */}
            <div className="hidden sm:block absolute -top-6 -right-6 glass-panel p-5 rounded-2xl border border-purpo-purple/30 shadow-glow max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purpo-purple to-purpo-cyan flex items-center justify-center text-white">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="font-display font-bold text-lg text-white">Cinema Quality</div>
                  <div className="text-xs text-zinc-400">RED • Sony FX • 8K Delivery</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content & Mission Area */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col justify-center space-y-8"
          >
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                Our Mission & Creative Philosophy
              </h3>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base mb-6">
                At PURPO, we believe that in an overcrowded digital landscape, ordinary content disappears. We combine the emotive storytelling of independent cinema with the razor-sharp commercial strategy of modern social commerce.
              </p>
              <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                Whether directing high-impact commercial campaigns for multinational enterprises or scaling viral vertical content for emerging founders, our mission remains constant: <strong className="text-white">turn your message into an unforgettable cultural moment.</strong>
              </p>
            </div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl glass-card border border-white/5">
                <div className="flex items-center space-x-2 text-purpo-purple mb-2">
                  <Eye size={18} />
                  <span className="font-display font-semibold text-white text-sm">Visual Mastery</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Precision lighting, bespoke color science, and dynamic camera choreography.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/5">
                <div className="flex items-center space-x-2 text-purpo-cyan mb-2">
                  <Target size={18} />
                  <span className="font-display font-semibold text-white text-sm">Conversion Focus</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every frame, transition, and caption is engineered to capture and convert attention.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/5">
                <div className="flex items-center space-x-2 text-purpo-purple-light mb-2">
                  <CheckCircle2 size={18} />
                  <span className="font-display font-semibold text-white text-sm">Turnkey Execution</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  From initial script and storyboard to sound design, grading, and social launch.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/5">
                <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                  <Zap size={18} />
                  <span className="font-display font-semibold text-white text-sm">Fast Turnaround</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Agile production pipelines tailored for rapid modern campaign deployment.
                </p>
              </div>
            </div>

            {/* Direct Contact Teaser */}
            <div className="pt-4 flex items-center space-x-4">
              <a
                href="#services"
                className="text-xs uppercase tracking-wider font-semibold text-purpo-purple hover:text-purpo-cyan flex items-center space-x-1.5 transition-colors"
              >
                <span>Explore Services</span>
                <span>→</span>
              </a>
              <span className="text-white/20">•</span>
              <a
                href="#contact"
                className="text-xs uppercase tracking-wider font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Book a Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
