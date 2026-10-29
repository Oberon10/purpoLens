'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, Maximize2, Sparkles, Filter } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/types/database';
import ImageModal from '@/components/ui/ImageModal';

interface GallerySectionProps {
  items: GalleryItem[];
}

const GALLERY_CATEGORIES: ('All' | GalleryCategory)[] = [
  'All',
  'Events',
  'Commercial',
  'Lifestyle',
  'Brand Shoots',
];

export default function GallerySection({ items }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | GalleryCategory>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <section id="gallery" className="relative py-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-purpo-purple/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purpo-cyan/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border border-white/10 text-xs font-semibold tracking-widest uppercase text-purpo-cyan mb-4">
              <Camera size={13} />
              <span>Editorial & Brand Photography</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Stills & Visual{' '}
              <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
                Atmosphere
              </span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-light">
              High-definition editorial imagery, event documentation, and high-fashion brand shoots shot on medium-format and full-frame optics.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-purpo-cyan to-purpo-cyan-light text-black font-bold shadow-glow-cyan'
                      : 'glass-card border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry / Responsive Staggered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px]">
          {filteredItems.map((item, index) => {
            // Creative staggered layout variation
            const isSpanTwo = index % 5 === 0 || index % 7 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
                onClick={() => setActiveItem(item)}
                className={`group relative rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-purpo-purple/50 transition-all duration-300 cursor-pointer shadow-card ${
                  isSpanTwo ? 'sm:col-span-2 row-span-2' : 'col-span-1 row-span-1'
                }`}
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-108"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Hover trigger icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <Maximize2 size={15} />
                </div>

                {/* Caption / Category at bottom */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-purpo-purple/30 border border-purpo-purple/40 text-purpo-purple-light inline-block mb-1.5">
                    {item.category}
                  </span>
                  <h4 className="font-display font-semibold text-white text-sm sm:text-base line-clamp-1 group-hover:text-purpo-cyan transition-colors">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Image Preview Lightbox */}
      <ImageModal item={activeItem} onClose={() => setActiveItem(null)} />
    </section>
  );
}
