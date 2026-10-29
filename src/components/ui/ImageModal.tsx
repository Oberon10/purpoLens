'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { GalleryItem } from '@/types/database';

interface ImageModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export default function ImageModal({ item, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl max-h-[90vh] w-full bg-white dark:bg-purpo-card border border-zinc-200 dark:border-white/15 rounded-3xl overflow-hidden shadow-card z-10 flex flex-col text-zinc-900 dark:text-white"
        >
          {/* Top Bar */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50">
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purpo-purple/15 text-purpo-purple border border-purpo-purple/30 font-semibold">
                {item.category}
              </span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {item.title}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full glass-card border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:border-purpo-purple transition-colors cursor-pointer"
              aria-label="Close image modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Large Image Preview */}
          <div className="relative flex-1 min-h-[350px] sm:min-h-[550px] bg-black flex items-center justify-center p-4">
            <div className="relative w-full h-[65vh]">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-purpo-surface flex items-center justify-between">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              PURPO High-Res Photography Portfolio • Captured in Lagos, Nigeria
            </div>
            <a
              href={item.image_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center space-x-1.5 text-xs text-purpo-purple hover:text-purpo-cyan font-bold transition-colors"
            >
              <ZoomIn size={14} />
              <span>View Full Resolution</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
