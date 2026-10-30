'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  User,
  Clock,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { VideoItem } from '@/types/database';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

interface ParsedMedia {
  kind: 'youtube' | 'vimeo' | 'direct';
  src: string;
}

export function parseVideoUrl(rawUrl: string): ParsedMedia {
  if (!rawUrl) return { kind: 'direct', src: '' };
  const url = rawUrl.trim();

  // 1. YouTube Matchers
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch =
    url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/) ||
    url.match(/^([\w-]{11})$/);

  if (ytMatch && ytMatch[1]) {
    return {
      kind: 'youtube',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    };
  }

  // 2. Vimeo Matchers
  // Matches: vimeo.com/ID or player.vimeo.com/video/ID
  const vimeoMatch = url.match(/vimeo(?:\.com\/|.*\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      kind: 'vimeo',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&dnt=1`,
    };
  }

  // 3. Direct video (MP4, WebM, local /uploads/videos/...)
  return {
    kind: 'direct',
    src: url,
  };
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const parsedMedia = useMemo(() => {
    return video ? parseVideoUrl(video.video_url) : { kind: 'direct' as const, src: '' };
  }, [video]);

  useEffect(() => {
    setHasError(false);
    setIsPlaying(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && parsedMedia.kind === 'direct') {
        e.preventDefault();
        togglePlay();
      }
    };
    if (video) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose, parsedMedia]);

  if (!video) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
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

  const retryPlayback = () => {
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#F7F8F3] dark:bg-purpo-card border border-zinc-200 dark:border-white/15 rounded-3xl shadow-glow-lg z-10 flex flex-col text-zinc-900 dark:text-white"
        >
          {/* Top Control Bar */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-black/30 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purpo-purple animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
                PURPOLENS Cinema Player
              </span>
              <span className="text-zinc-300 dark:text-white/20">|</span>
              <span className="text-xs text-purpo-purple dark:text-purpo-cyan font-mono font-bold">
                {video.category}
              </span>
              {video.duration && (
                <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-mono text-zinc-500">
                  <Clock size={11} />
                  <span>{video.duration}</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-full glass-card border border-zinc-200 dark:border-white/10 text-xs text-zinc-600 hover:text-purpo-purple dark:text-zinc-300 transition-colors"
                title="Open video in new tab"
              >
                <ExternalLink size={12} />
                <span>Open Link</span>
              </a>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full glass-card border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white hover:border-purpo-purple transition-all duration-200 cursor-pointer"
                aria-label="Close video player"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Video Player Container */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center group overflow-hidden">
            {parsedMedia.kind === 'youtube' || parsedMedia.kind === 'vimeo' ? (
              <iframe
                src={parsedMedia.src}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : hasError ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-zinc-300 max-w-md">
                <AlertCircle size={40} className="text-rose-500 mb-3" />
                <h4 className="font-bold text-white text-base mb-1">Video Stream Notice</h4>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  The video stream could not be loaded directly by the browser player. You can open the original source link or reload.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={retryPlayback}
                    className="px-4 py-2 rounded-full bg-purpo-purple text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-glow"
                  >
                    <RefreshCw size={12} />
                    <span>Retry Player</span>
                  </button>
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full glass-card text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
                  >
                    <ExternalLink size={12} />
                    <span>Direct Play</span>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={parsedMedia.src}
                  poster={video.thumbnail_url}
                  autoPlay
                  playsInline
                  controls
                  preload="auto"
                  className="w-full h-full object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => setIsBuffering(false)}
                  onError={() => setHasError(true)}
                >
                  <source src={parsedMedia.src} type="video/mp4" />
                  Your browser does not support HTML5 video playback.
                </video>

                {/* Floating Quick Controls Overlay on hover */}
                <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 text-white hover:text-purpo-cyan transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 text-white hover:text-purpo-cyan transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <button
                    onClick={handleFullscreen}
                    className="p-1.5 text-white hover:text-purpo-cyan transition-colors cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Project Details Footer */}
          <div className="p-6 sm:p-8 bg-white/70 dark:bg-purpo-surface/90 border-t border-zinc-200 dark:border-white/10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purpo-purple/15 text-purpo-purple border border-purpo-purple/30 font-bold">
                    {video.category}
                  </span>
                  {video.client_name && (
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center space-x-1 font-medium">
                      <User size={12} className="text-purpo-purple" />
                      <span>{video.client_name}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {video.title}
                </h3>

                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed font-normal">
                  {video.description || 'Cinema quality production delivered by PURPOLENS Creative Studio.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-center">
                <a
                  href={`https://wa.me/2348133802278?text=Hello%20PURPO,%20I%20just%20watched%20${encodeURIComponent(
                    video.title
                  )}%20and%20would%20like%20to%20discuss%20a%20similar%20project.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center space-x-2"
                >
                  <span>Book Similar Production</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
