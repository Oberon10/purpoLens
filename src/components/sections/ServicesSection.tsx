'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Scissors,
  Smartphone,
  Share2,
  Compass,
  ArrowUpRight,
  Layers,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  icon: any;
  tagline: string;
  description: string;
  deliverables: string[];
  gradient: string;
  accent: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'videography',
    title: 'Videography',
    icon: Video,
    tagline: 'Cinema-Grade Visual Storytelling',
    description:
      'Full-scale production for television commercials, high-profile corporate galas, music videos, and cinematic brand documentaries captured with industry-standard cinema cameras.',
    deliverables: ['Commercial Videos', 'VIP & Corporate Events', 'Documentary Production', 'Multi-Cam Setups'],
    gradient: 'from-purple-600/15 to-indigo-600/15',
    accent: 'text-purpo-purple',
  },
  {
    id: 'video-editing',
    title: 'Professional Video Editing',
    icon: Scissors,
    tagline: 'High-Impact Post-Production & Color',
    description:
      'Transforming raw footage into seamless, rhythmically hypnotic narratives with advanced color grading, match cuts, dynamic sound design, and custom 2D/3D motion graphics.',
    deliverables: ['Commercial Edits', 'Social Media Edits', 'Motion Graphics', 'Cinematic Color Grading'],
    gradient: 'from-indigo-600/15 to-blue-600/15',
    accent: 'text-indigo-500 dark:text-indigo-400',
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    icon: Smartphone,
    tagline: 'High-Retention Vertical Video',
    description:
      'Crafted specifically for the algorithmic fast lane. We design scroll-stopping Reels, TikToks, and YouTube Shorts that hook viewers within the first 2 seconds and convert attention into brand loyalty.',
    deliverables: ['Viral Instagram Reels', 'TikTok Video Packages', 'Short-Form Conversion Ads', 'Creative Scripting'],
    gradient: 'from-cyan-600/15 to-teal-600/15',
    accent: 'text-purpo-purple dark:text-purpo-cyan',
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management',
    icon: Share2,
    tagline: 'Strategic Distribution & Community Scaling',
    description:
      'Comprehensive social architecture. We handle content calendars, algorithmic scheduling, community engagement, and analytics reporting to position your brand at the cultural forefront.',
    deliverables: ['Comprehensive Strategy', 'Automated Scheduling', 'Monthly Content Calendar', 'Audience Growth Consulting'],
    gradient: 'from-teal-600/15 to-emerald-600/15',
    accent: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'brand-strategy',
    title: 'Brand Strategy & Consulting',
    icon: Compass,
    tagline: 'Unshakable Market Positioning',
    description:
      'Clarity before camera. We define your core brand narrative, target audience psychology, visual identity guidelines, and long-term creative roadmap for domestic and international expansion.',
    deliverables: ['Brand Positioning & Moat', 'Visual Identity Architecture', 'Creative Direction Audits', 'Growth & Funnel Consulting'],
    gradient: 'from-violet-600/15 to-purple-600/15',
    accent: 'text-purpo-purple-light',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-28 overflow-hidden">
      {/* Glow elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purpo-purple/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purpo-cyan/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border border-zinc-200/80 dark:border-white/10 text-xs font-semibold tracking-widest uppercase text-purpo-purple mb-4">
            <Layers size={13} />
            <span>Core Expertise</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            Bespoke Services For{' '}
            <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
              Visionary Brands
            </span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed font-normal dark:font-light">
            From concept to execution, we combine cinematic artistry with modern digital growth strategies.
          </p>
        </div>

        {/* Services Grid (3 on top row, 2 centered on bottom row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.slice(0, 3).map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative rounded-3xl glass-card border border-zinc-200/80 dark:border-white/10 p-8 flex flex-col justify-between hover:border-purpo-purple/50 transition-all duration-300 hover:-translate-y-1.5 shadow-card overflow-hidden"
              >
                {/* Subtle card ambient gradient */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${service.gradient} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl glass-panel border border-zinc-200/80 dark:border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 group-hover:border-purpo-purple">
                      <Icon className={`w-7 h-7 ${service.accent}`} />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-purpo-purple dark:group-hover:text-purpo-cyan transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-purpo-purple transition-colors">
                    {service.title}
                  </h3>
                  <div className="text-xs uppercase tracking-wider text-purpo-purple dark:text-purpo-cyan/90 font-semibold mb-4">
                    {service.tagline}
                  </div>

                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-3 border-t border-zinc-200/80 dark:border-white/10 pt-4">
                    Key Deliverables:
                  </div>
                  <ul className="space-y-2 mb-6">
                    {service.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-purpo-purple shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="inline-flex items-center space-x-2 text-xs uppercase font-bold text-zinc-900 dark:text-white group-hover:text-purpo-purple dark:group-hover:text-purpo-cyan transition-colors pt-2"
                  >
                    <span>Request Proposal</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Second Row: 2 Wide Cards centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-5xl mx-auto">
          {SERVICES.slice(3, 5).map((service, index) => {
            const Icon = service.icon;
            const actualIndex = index + 3;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="group relative rounded-3xl glass-card border border-zinc-200/80 dark:border-white/10 p-8 flex flex-col justify-between hover:border-purpo-purple/50 transition-all duration-300 hover:-translate-y-1.5 shadow-card overflow-hidden"
              >
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${service.gradient} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl glass-panel border border-zinc-200/80 dark:border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 group-hover:border-purpo-purple">
                      <Icon className={`w-7 h-7 ${service.accent}`} />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-purpo-purple dark:group-hover:text-purpo-cyan transition-colors">
                      0{actualIndex + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-purpo-purple transition-colors">
                    {service.title}
                  </h3>
                  <div className="text-xs uppercase tracking-wider text-purpo-purple dark:text-purpo-cyan/90 font-semibold mb-4">
                    {service.tagline}
                  </div>

                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-3 border-t border-zinc-200/80 dark:border-white/10 pt-4">
                    Key Deliverables:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {service.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-purpo-purple shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="inline-flex items-center space-x-2 text-xs uppercase font-bold text-zinc-900 dark:text-white group-hover:text-purpo-purple dark:group-hover:text-purpo-cyan transition-colors pt-2"
                  >
                    <span>Request Proposal</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
