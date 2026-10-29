'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Search, Filter, Film, ArrowRight } from 'lucide-react';
import { VideoItem, VideoCategory } from '@/types/database';
import VideoModal from '@/components/ui/VideoModal';

interface PortfolioSectionProps {
  videos: VideoItem[];
}

const CATEGORIES: ('All' | VideoCategory)[] = [
  'All',
  'Commercial',
  'Music Video',
  'Documentary',
  'Social Media',
  'Event',
  'Brand Story',
];

export default function PortfolioSection({ videos }: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | VideoCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Filter & search
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === 'All' || video.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        video.title.toLowerCase().includes(query) ||
        (video.description && video.description.toLowerCase().includes(query)) ||
        (video.client_name && video.client_name.toLowerCase().includes(query)) ||
        video.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  // Ensure exactly 9 featured video slots are displayed as required by specifications
  const displayedVideos = filteredVideos.slice(0, 9);

  return (
    <section id="work" className="relative py-28 overflow-hidden bg-zinc-100/40 dark:bg-black/80 transition-colors">
      {/* Background glow ambiance */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purpo-purple/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-purpo-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border border-zinc-200/80 dark:border-white/10 text-xs font-semibold tracking-widest uppercase text-purpo-purple mb-4">
              <Film size={13} />
              <span>Selected Portfolio</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
              Featured Work &{' '}
              <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
                Cinematic Reels
              </span>
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-normal dark:font-light">
              Explore 9 signature productions delivered for leading brands, artists, and creators in Lagos and internationally.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or clients..."
              className="w-full px-4 py-2.5 pl-10 rounded-full bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-xs text-zinc-900 dark:text-white placeholder-zinc-500 shadow-sm transition-colors"
            />
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          <div className="flex items-center space-x-1.5 pr-2 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
            <Filter size={13} />
            <span>Filter:</span>
          </div>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purpo-purple to-purpo-purple-glow text-white shadow-glow'
                    : 'glass-card border border-zinc-200/80 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-purpo-purple/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 9 Video Slots Grid: Exactly 3x3 layout on large screens */}
        {displayedVideos.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border border-zinc-200/80 dark:border-white/10">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">No videos found matching your search criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-purpo-purple text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                className="group relative rounded-3xl overflow-hidden glass-card border border-zinc-200/80 dark:border-white/10 hover:border-purpo-purple/50 transition-all duration-300 hover:-translate-y-2 shadow-card flex flex-col justify-between"
              >
                {/* Thumbnail Area with Aspect Ratio & Lazy Loading */}
                <div
                  onClick={() => setActiveVideo(video)}
                  className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer"
                >
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors" />

                  {/* Play Button Trigger Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg group-hover:scale-115 group-hover:bg-purpo-purple transition-all duration-300">
                      <Play size={20} className="ml-1 fill-white" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full glass-panel border border-white/20 text-white">
                      {video.category}
                    </span>
                    {video.duration && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 text-zinc-300 border border-white/10">
                        {video.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Video Info Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {video.client_name && (
                      <div className="text-[11px] uppercase tracking-wider text-purpo-purple dark:text-purpo-cyan font-semibold mb-1.5">
                        Client: {video.client_name}
                      </div>
                    )}
                    <h3
                      onClick={() => setActiveVideo(video)}
                      className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-purpo-purple transition-colors cursor-pointer line-clamp-1"
                    >
                      {video.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 font-normal dark:font-light">
                      {video.description}
                    </p>
                  </div>

                  {/* Play Video Trigger Button */}
                  <div className="border-t border-zinc-200/80 dark:border-white/10 pt-4 flex items-center justify-between">
                    <button
                      onClick={() => setActiveVideo(video)}
                      className="inline-flex items-center space-x-2 text-xs uppercase font-bold text-purpo-purple group-hover:text-purpo-purple-glow transition-colors cursor-pointer"
                    >
                      <Play size={12} className="fill-current" />
                      <span>Play Video</span>
                    </button>
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                      Slot 0{index + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Section Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Need a custom format, aerial drone cinematography, or multi-city production?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center space-x-2 text-xs uppercase font-bold tracking-wider text-zinc-900 dark:text-white hover:text-purpo-purple dark:hover:text-purpo-cyan transition-colors"
          >
            <span>Discuss your custom production requirements</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Lightbox / Modal Player */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
