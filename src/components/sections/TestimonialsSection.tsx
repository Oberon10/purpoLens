'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, MessageSquare } from 'lucide-react';
import { TestimonialItem } from '@/types/database';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  if (!current) return null;

  return (
    <section id="testimonials" className="relative py-28 overflow-hidden bg-black/60">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-purpo-purple/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border border-white/10 text-xs font-semibold tracking-widest uppercase text-purpo-cyan mb-4">
            <MessageSquare size={13} />
            <span>Client Endorsements</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Trusted By Visionaries &{' '}
            <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            Read how our cinematic storytelling and strategic content production have generated measurable impact for top brands.
          </p>
        </div>

        {/* Carousel Card Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="max-w-4xl mx-auto"
        >
          <div className="relative glass-card border border-white/15 rounded-3xl p-8 sm:p-14 shadow-card overflow-hidden">
            <Quote className="absolute top-8 right-8 w-20 h-20 text-white/5 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                {/* 5-Star Rating */}
                <div className="flex items-center space-x-1 mb-6 text-amber-400">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg sm:text-2xl text-zinc-200 font-light leading-relaxed mb-8 italic max-w-2xl">
                  &ldquo;{current.review}&rdquo;
                </p>

                {/* Client Avatar & Info */}
                <div className="flex items-center space-x-4">
                  {current.photo_url && (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purpo-purple shadow-glow">
                      <Image
                        src={current.photo_url}
                        alt={current.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="text-left">
                    <h4 className="font-display font-bold text-white text-base">
                      {current.name}
                    </h4>
                    <p className="text-xs uppercase tracking-wider text-purpo-cyan font-medium">
                      {current.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? 'w-8 bg-purpo-purple'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full glass-panel border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-purpo-purple transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full glass-panel border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-purpo-purple transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
