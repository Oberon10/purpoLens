'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';

const INSTA_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    likes: '1,420',
    comments: '88',
    caption: 'Behind the RED cinema rig on set in Ikoyi. #PURPO #CinemaLagos',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    likes: '2,890',
    comments: '143',
    caption: 'High fashion editorial runway cut for Lagos Fashion Week.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    likes: '954',
    comments: '62',
    caption: 'Midnight neon color grading in DaVinci Resolve. Atmospheric tones.',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    likes: '3,120',
    comments: '210',
    caption: 'Street photography session in the bustling creative heart of Yaba.',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    likes: '1,780',
    comments: '95',
    caption: 'High-speed 240fps athletic commercial shoot.',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    likes: '2,350',
    comments: '118',
    caption: 'Capturing cultural icons at the ArtX Lagos opening gala.',
  },
];

export default function InstagramSection() {
  return (
    <section className="relative py-24 overflow-hidden border-t border-zinc-200/80 dark:border-white/5 bg-zinc-100/40 dark:bg-black/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-purpo-purple text-xs uppercase tracking-widest font-semibold mb-2">
              <Instagram size={14} />
              <span>@purpolens On Instagram</span>
            </div>
            <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
              Behind the Scenes & Live Drops
            </h3>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full glass-card border border-zinc-200/80 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:border-purpo-purple hover:text-purpo-purple transition-all duration-300 w-fit"
          >
            <span>Follow @purpolens</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* 6-item Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTA_POSTS.map((post) => (
            <motion.a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="group relative aspect-square rounded-2xl overflow-hidden glass-card border border-zinc-200/80 dark:border-white/10 block shadow-sm"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay with metrics */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
                <Instagram size={22} className="text-purpo-cyan mb-2" />
                <div className="flex items-center space-x-3 text-white text-xs font-semibold mb-2">
                  <span className="flex items-center space-x-1">
                    <Heart size={12} className="fill-red-500 text-red-500" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle size={12} className="fill-white" />
                    <span>{post.comments}</span>
                  </span>
                </div>
                <p className="text-[10px] text-zinc-300 line-clamp-2 leading-tight">
                  {post.caption}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
