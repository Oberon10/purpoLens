'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Tag, User, Sparkles } from 'lucide-react';
import { VideoItem } from '@/types/database';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (video) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const isDirectVideo =
    video.video_url.endsWith('.mp4') ||
    video.video_url.endsWith('.webm') ||
    video.video_url.includes('sample') ||
    video.video_url.includes('storage.googleapis.com') ||
    video.video_url.includes('supabase.co');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto glass-panel border border-white/15 rounded-3xl shadow-glow-lg z-10 flex flex-col"
        >
          {/* Top Control Bar */}
          <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purpo-purple animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
                PURPO Cinema Player
              </span>
              <span className="text-white/20">|</span>
              <span className="text-xs text-purpo-cyan font-mono">{video.category}</span>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-purpo-purple transition-all duration-200"
              aria-label="Close video player"
            >
              <X size={18} />
            </button>
          </div>

          {/* Video Player Container */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center group overflow-hidden">
            {isDirectVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={video.video_url}
                  poster={video.thumbnail_url}
                  autoPlay
                  playsInline
                  controls
                  className="w-full h-full object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Floating Quick Controls Overlay on hover */}
                <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 text-white hover:text-purpo-cyan transition-colors"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 text-white hover:text-purpo-cyan transition-colors"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <button
                    onClick={handleFullscreen}
                    className="p-1.5 text-white hover:text-purpo-cyan transition-colors"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </>
            ) : (
              <iframe
                src={video.video_url}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </div>

          {/* Project Details Footer */}
          <div className="p-6 sm:p-8 bg-purpo-surface/90 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purpo-purple/20 text-purpo-purple border border-purpo-purple/30 font-semibold">
                    {video.category}
                  </span>
                  {video.client_name && (
                    <span className="text-xs text-zinc-400 flex items-center space-x-1">
                      <User size={13} className="inline text-zinc-500" />
                      <span>Client: <strong className="text-zinc-200">{video.client_name}</strong></span>
                    </span>
                  )}
                  {video.duration && (
                    <span className="text-xs text-zinc-500 font-mono">
                      • {video.duration}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  {video.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Commission CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow hover:from-purpo-purple-hover hover:to-purpo-purple text-white font-semibold text-xs uppercase tracking-wider shadow-glow text-center"
                >
                  Commission Similar Project
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
