'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  FileText,
  Video,
  Scissors,
  Send,
  TrendingUp,
  Workflow,
  CheckCircle,
} from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Strategy',
    icon: Compass,
    tagline: 'Discovery, Positioning & Goal Alignment',
    description:
      'We deconstruct your brand story, core offering, target demographics, and commercial objectives. We establish key performance indicators and narrative tone before a single camera is assembled.',
    deliverables: ['Creative Brief', 'Audience Profile', 'Moodboards', 'KPI Framework'],
  },
  {
    step: '02',
    title: 'Planning',
    icon: FileText,
    tagline: 'Pre-Production & Precision Scripting',
    description:
      'Every masterpiece is won in pre-production. We craft comprehensive scripts, shot lists, storyboard blueprints, talent casting, location scouting around Lagos and beyond, and lighting schematics.',
    deliverables: ['Director Storyboards', 'Location Permits', 'Shot Lists & Call Sheets', 'Equipment Rigging Plan'],
  },
  {
    step: '03',
    title: 'Production',
    icon: Video,
    tagline: 'Principal Photography & Cinema Capture',
    description:
      'Our team executes on set with cinema camera packages (RED, Sony Cine), anamorphic lenses, specialized gimbal rigs, dynamic wireless audio capture, and master-level ambient lighting.',
    deliverables: ['Cinema Raw 4K/8K Footage', 'Dual Wireless Audio', 'High-Speed B-Roll', 'Set Photography'],
  },
  {
    step: '04',
    title: 'Editing',
    icon: Scissors,
    tagline: 'Post-Production, Color Science & Sound Design',
    description:
      'Footage enters our digital lab. We craft rhythmic cuts, apply bespoke film-grade color grading tailored to skin tones, layer visceral SFX and foley, and animate high-end motion graphic titles.',
    deliverables: ['Master Commercial Cut', 'Social Media 9:16 Cuts', 'DaVinci Color Grade', 'Immersive Audio Mix'],
  },
  {
    step: '05',
    title: 'Publishing',
    icon: Send,
    tagline: 'Launch Execution & Multi-Platform Delivery',
    description:
      'We deliver optimized assets across all required aspect ratios (16:9, 9:16, 1:1, 4:5), accompany them with algorithmic caption copy and hashtag architectures, and support day-one rollout.',
    deliverables: ['Multi-Ratio Exports', 'Algorithmic Copy & Tags', 'Custom Thumbnail Covers', 'Launch Coordination'],
  },
  {
    step: '06',
    title: 'Growth',
    icon: TrendingUp,
    tagline: 'Analytics, Iteration & Brand Scaling',
    description:
      'Post-launch, we analyze viewer retention metrics, engagement spikes, and conversion rates. We use these empirical insights to refine future content drops and amplify your market footprint.',
    deliverables: ['Performance Analytics Report', 'A/B Testing Insights', 'Re-cut Opportunities', 'Next Cycle Strategy'],
  },
];

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="relative py-28 scroll-mt-24 overflow-hidden bg-[#eeefe8]/50 dark:bg-black/40 transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purpo-purple/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border border-zinc-200/80 dark:border-white/10 text-xs font-semibold tracking-widest uppercase text-purpo-purple dark:text-purpo-cyan mb-4">
            <Workflow size={13} />
            <span>How We Work</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            The PURPO{' '}
            <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
              Production Pipeline
            </span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed font-normal dark:font-light">
            Strategy ↓ Planning ↓ Production ↓ Editing ↓ Publishing ↓ Growth
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-3xl p-7 glass-card border transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'border-purpo-purple bg-white dark:bg-purpo-card/90 shadow-glow'
                    : 'border-zinc-200/80 dark:border-white/10 hover:border-purpo-purple/40'
                }`}
              >
                {/* Glow pill */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purpo-purple/20 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-mono font-extrabold text-zinc-900 dark:text-white/90">
                    {step.step}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-gradient-to-tr from-purpo-purple to-purpo-cyan text-white'
                        : 'glass-panel text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/10'
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <div className="text-xs uppercase tracking-wider text-purpo-purple dark:text-purpo-cyan font-semibold mb-3">
                  {step.tagline}
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mb-5">
                  {step.description}
                </p>

                <div className="border-t border-zinc-200/80 dark:border-white/10 pt-4">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider block mb-2">
                    Key Outputs:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {step.deliverables.map((item, dIdx) => (
                      <span
                        key={dIdx}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 flex items-center space-x-1"
                      >
                        <CheckCircle size={10} className="text-purpo-purple dark:text-purpo-cyan" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Workflow Bottom Callout */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl glass-panel border border-zinc-200/80 dark:border-white/15 max-w-4xl mx-auto w-full">
            <div className="text-left">
              <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-white mb-1">
                Have an ambitious production timeline in mind?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                We can mobilize full cinema crews across Lagos and internationally within 48-72 hours.
              </p>
            </div>
            <a
              href="#contact"
              className="px-6 py-3 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-purpo-purple dark:hover:bg-purpo-cyan hover:text-white dark:hover:text-black font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-md whitespace-nowrap cursor-pointer"
            >
              Consult With Our Producer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
