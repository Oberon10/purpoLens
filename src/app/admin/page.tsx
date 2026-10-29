'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Image as ImageIcon,
  MessageSquare,
  Star,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  LogOut,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  Film,
  Sparkles,
  Phone,
  Mail,
  Home,
  Database,
  Layers,
} from 'lucide-react';
import {
  getVideos,
  saveVideo,
  deleteVideo,
  getGallery,
  saveGalleryItem,
  deleteGalleryItem,
  getContactMessages,
  getTestimonials,
  isSupabaseConfigured,
  uploadMediaFile,
} from '@/lib/supabase';
import {
  VideoItem,
  GalleryItem,
  ContactMessage,
  TestimonialItem,
  VideoCategory,
  GalleryCategory,
} from '@/types/database';

type AdminTab = 'overview' | 'videos' | 'gallery' | 'messages' | 'testimonials';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isReady, setIsReady] = useState(false);

  // Data states
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Video Form Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<VideoItem> | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Image Form Modal State
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);

  // Authentication check
  useEffect(() => {
    const isAuth = localStorage.getItem('purpo-admin-auth');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }
    loadData();
    setIsReady(true);
  }, [router]);

  const loadData = async () => {
    try {
      const [v, g, m, t] = await Promise.all([
        getVideos(),
        getGallery(),
        getContactMessages(),
        getTestimonials(),
      ]);
      setVideos(v);
      setGallery(g);
      setMessages(m);
      setTestimonials(t);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('purpo-admin-auth');
    router.push('/admin/login');
  };

  // Helper notification
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Video Actions
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo?.title || !editingVideo?.category) {
      showToast('Please fill in title and category', 'error');
      return;
    }

    setUploading(true);
    let finalVideoUrl = editingVideo.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    let finalThumbUrl = editingVideo.thumbnail_url || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1600&q=80';

    if (videoFile) {
      const url = await uploadMediaFile(videoFile, 'portfolio-videos');
      if (url) finalVideoUrl = url;
    }
    if (thumbFile) {
      const url = await uploadMediaFile(thumbFile, 'portfolio-images');
      if (url) finalThumbUrl = url;
    }

    // Check 9 featured limit
    const currentFeaturedCount = videos.filter((v) => v.featured && v.id !== editingVideo.id).length;
    const isFeatured = editingVideo.featured ?? true;
    if (isFeatured && currentFeaturedCount >= 9) {
      showToast('Maximum 9 featured videos allowed. Unfeature another video first.', 'error');
      setUploading(false);
      return;
    }

    try {
      const saved = await saveVideo({
        ...editingVideo,
        video_url: finalVideoUrl,
        thumbnail_url: finalThumbUrl,
        category: (editingVideo.category as VideoCategory) || 'Commercial',
        featured: isFeatured,
      } as any);

      await loadData();
      setShowVideoModal(false);
      setEditingVideo(null);
      setVideoFile(null);
      setThumbFile(null);
      showToast('Video successfully saved!');
    } catch (err) {
      showToast('Failed to save video', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    await deleteVideo(id);
    await loadData();
    showToast('Video deleted');
  };

  const toggleFeaturedVideo = async (video: VideoItem) => {
    const featuredCount = videos.filter((v) => v.featured).length;
    if (!video.featured && featuredCount >= 9) {
      showToast('Only maximum 9 featured videos allowed per portfolio specification.', 'error');
      return;
    }
    await saveVideo({ ...video, featured: !video.featured });
    await loadData();
    showToast(`Video ${!video.featured ? 'marked as featured' : 'unfeatured'}`);
  };

  const moveVideoOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const newVideos = [...videos];
    const [moved] = newVideos.splice(index, 1);
    newVideos.splice(targetIndex, 0, moved);

    // Save updated order
    setVideos(newVideos);
    for (let i = 0; i < newVideos.length; i++) {
      await saveVideo({ ...newVideos[i], order_index: i + 1 });
    }
    showToast('Video order updated');
  };

  // Gallery Actions
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery?.title || !editingGallery?.category) {
      showToast('Please fill in title and category', 'error');
      return;
    }

    setUploading(true);
    let finalImageUrl = editingGallery.image_url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80';

    if (galleryFile) {
      const url = await uploadMediaFile(galleryFile, 'portfolio-images');
      if (url) finalImageUrl = url;
    }

    try {
      await saveGalleryItem({
        ...editingGallery,
        image_url: finalImageUrl,
        category: (editingGallery.category as GalleryCategory) || 'Commercial',
        featured: editingGallery.featured ?? true,
      } as any);

      await loadData();
      setShowGalleryModal(false);
      setEditingGallery(null);
      setGalleryFile(null);
      showToast('Photo added to gallery!');
    } catch {
      showToast('Failed to save photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    await deleteGalleryItem(id);
    await loadData();
    showToast('Image removed from gallery');
  };

  if (!isReady) return null;

  const featuredVideoCount = videos.filter((v) => v.featured).length;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Admin Bar */}
      <header className="glass-panel border-b border-white/10 py-4 px-6 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="relative w-9 h-9 drop-shadow-[0_0_15px_rgba(94,96,206,0.6)]">
            <Image src="/images/purpo-logo.png" alt="PURPO" fill className="object-contain" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-black tracking-widest text-lg uppercase text-white">
                PURPO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purpo-purple/20 text-purpo-purple border border-purpo-purple/30">
                CMS Admin
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Creative Studio Content Management • Lagos, NG
            </p>
          </div>
        </div>

        {/* Database Status indicator */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full glass-card border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-zinc-300">
              {isSupabaseConfigured() ? 'Supabase Live Connected' : 'Local Demo Storage Active'}
            </span>
          </div>

          <Link
            href="/"
            className="hidden sm:flex items-center space-x-1.5 text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-full glass-card border border-white/10 hover:border-purpo-purple transition-colors"
          >
            <Home size={13} />
            <span>View Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-full glass-card border border-red-500/20 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-card border flex items-center space-x-2 text-xs font-medium ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                : 'bg-red-950/90 text-red-300 border-red-500/30'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle size={15} />
            ) : (
              <AlertCircle size={15} />
            )}
            <span>{statusMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'overview'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeTab === 'videos'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video size={14} />
            <span>Videos ({videos.length})</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {featuredVideoCount}/9 Featured
            </span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeTab === 'gallery'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon size={14} />
            <span>Photography ({gallery.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeTab === 'messages'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare size={14} />
            <span>Client Inquiries ({messages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeTab === 'testimonials'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Star size={14} />
            <span>Testimonials ({testimonials.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl glass-card border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-semibold text-zinc-400">Total Videos</span>
                  <div className="w-10 h-10 rounded-2xl bg-purpo-purple/20 text-purpo-purple flex items-center justify-center">
                    <Video size={18} />
                  </div>
                </div>
                <div className="font-display text-3xl font-extrabold text-white">{videos.length}</div>
                <div className="text-xs text-zinc-500 mt-1">Managed via Supabase</div>
              </div>

              <div className="p-6 rounded-3xl glass-card border border-purpo-purple/30 bg-purpo-purple/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-semibold text-purpo-purple">Featured Slot Status</span>
                  <div className="w-10 h-10 rounded-2xl bg-purpo-purple/20 text-purpo-purple flex items-center justify-center">
                    <Film size={18} />
                  </div>
                </div>
                <div className="font-display text-3xl font-extrabold text-white">
                  {featuredVideoCount} / 9
                </div>
                <div className="text-xs text-purpo-purple mt-1">
                  {featuredVideoCount === 9 ? 'Full 9/9 Portfolio Grid Active' : `${9 - featuredVideoCount} featured slots remaining`}
                </div>
              </div>

              <div className="p-6 rounded-3xl glass-card border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-semibold text-zinc-400">Gallery Photos</span>
                  <div className="w-10 h-10 rounded-2xl bg-purpo-cyan/20 text-purpo-cyan flex items-center justify-center">
                    <ImageIcon size={18} />
                  </div>
                </div>
                <div className="font-display text-3xl font-extrabold text-white">{gallery.length}</div>
                <div className="text-xs text-zinc-500 mt-1">Events, Commercial, Brand</div>
              </div>

              <div className="p-6 rounded-3xl glass-card border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-semibold text-zinc-400">Client Inquiries</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageSquare size={18} />
                  </div>
                </div>
                <div className="font-display text-3xl font-extrabold text-white">{messages.length}</div>
                <div className="text-xs text-zinc-500 mt-1">From Lagos & International</div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  Quick Actions
                </h3>
                <p className="text-xs text-zinc-400 mb-6">
                  Add content directly into the live PURPO portfolio website.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setEditingVideo({ category: 'Commercial', featured: true });
                      setShowVideoModal(true);
                    }}
                    className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-purpo-purple text-left transition-colors flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purpo-purple/20 text-purpo-purple flex items-center justify-center group-hover:bg-purpo-purple group-hover:text-white transition-colors">
                      <Plus size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Upload New Video</div>
                      <div className="text-[11px] text-zinc-500">Add to 9-slot portfolio</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setEditingGallery({ category: 'Commercial', featured: true });
                      setShowGalleryModal(true);
                    }}
                    className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-purpo-cyan text-left transition-colors flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purpo-cyan/20 text-purpo-cyan flex items-center justify-center group-hover:bg-purpo-cyan group-hover:text-black transition-colors">
                      <Plus size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Add Photo to Gallery</div>
                      <div className="text-[11px] text-zinc-500">Masonry grid display</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Agency Information Card */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  PURPO Brand Coordinates
                </h3>
                <p className="text-xs text-zinc-400 mb-6">
                  Verified studio details displayed across customer touchpoints.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500">Brand Name</span>
                    <span className="text-white font-semibold">PURPO</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500">Hotline</span>
                    <span className="text-white font-semibold">08133802278</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500">Studio Address</span>
                    <span className="text-white text-right max-w-xs">
                      27, Ijaoye Street, Jibowu, Yaba, Lagos, Nigeria
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500">Storage Buckets</span>
                    <span className="text-purpo-cyan font-mono">portfolio-videos, portfolio-images</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VIDEOS MANAGEMENT ================= */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-white">
                  Video Management System
                </h3>
                <p className="text-xs text-zinc-400">
                  Manage commercial reels. Maximum exactly 9 featured videos active on the homepage grid ({featuredVideoCount}/9 currently featured).
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingVideo({ category: 'Commercial', featured: true });
                  setShowVideoModal(true);
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-purpo-purple hover:bg-purpo-purple-light text-white text-xs font-semibold uppercase tracking-wider shadow-glow transition-all"
              >
                <Plus size={16} />
                <span>Upload Video</span>
              </button>
            </div>

            {/* Video List */}
            <div className="space-y-3">
              {videos.map((video, idx) => (
                <div
                  key={video.id}
                  className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    {/* Order controls */}
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => moveVideoOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveVideoOrder(idx, 'down')}
                        disabled={idx === videos.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {/* Thumbnail preview */}
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-white/10">
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                          {video.category}
                        </span>
                        {video.featured ? (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purpo-purple/20 text-purpo-purple border border-purpo-purple/30">
                            ★ Featured ({idx < 9 ? `Slot 0${idx + 1}` : 'Active'})
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-500">Unfeatured</span>
                        )}
                        {video.client_name && (
                          <span className="text-xs text-zinc-400">• {video.client_name}</span>
                        )}
                      </div>
                      <h4 className="font-display font-semibold text-white text-sm">
                        {video.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => toggleFeaturedVideo(video)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        video.featured
                          ? 'bg-purpo-purple/20 text-purpo-purple border border-purpo-purple/30'
                          : 'glass-panel text-zinc-400 hover:text-white'
                      }`}
                    >
                      {video.featured ? 'Unfeature' : 'Feature'}
                    </button>

                    <button
                      onClick={() => {
                        setEditingVideo(video);
                        setShowVideoModal(true);
                      }}
                      className="p-2 rounded-lg glass-panel hover:bg-white/10 text-zinc-300 hover:text-white"
                      title="Edit Video"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 rounded-lg glass-panel hover:bg-red-500/20 text-red-400"
                      title="Delete Video"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: GALLERY PHOTOS ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-white">
                  Photography Gallery
                </h3>
                <p className="text-xs text-zinc-400">
                  Upload and manage high-resolution stills for the masonry portfolio.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingGallery({ category: 'Commercial', featured: true });
                  setShowGalleryModal(true);
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-purpo-cyan hover:bg-purpo-cyan-light text-black text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Plus size={16} />
                <span>Upload Photo</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden glass-card border border-white/10"
                >
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/20 text-white w-fit">
                      {item.category}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white truncate mb-2">
                        {item.title}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingGallery(item);
                            setShowGalleryModal(true);
                          }}
                          className="p-1.5 rounded-md bg-white/20 text-white hover:bg-white/40"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          className="p-1.5 rounded-md bg-red-500/30 text-red-300 hover:bg-red-500/50"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: CLIENT INQUIRIES ================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-2xl text-white">
                Client Inquiries & Project Requests
              </h3>
              <p className="text-xs text-zinc-400">
                Inquiries submitted through the homepage contact form. Directly reply via WhatsApp or Email.
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="p-12 text-center glass-card rounded-3xl border border-white/10 text-zinc-400 text-sm">
                No inquiries submitted yet. Testing the contact form on the home page will populate messages here.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-display font-bold text-lg text-white">
                          {msg.name}
                        </h4>
                        <span className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-full bg-purpo-purple/20 text-purpo-purple border border-purpo-purple/30">
                          {msg.service}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-zinc-400">
                        <span className="flex items-center space-x-1 text-zinc-300">
                          <Mail size={13} className="text-purpo-cyan" />
                          <span>{msg.email}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-zinc-300">
                          <Phone size={13} className="text-purpo-purple" />
                          <span>{msg.phone}</span>
                        </span>
                      </div>

                      <p className="text-sm text-zinc-300 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed mt-2">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                          msg.name
                        )},%20this%20is%20PURPO%20Creative%20Agency%20responding%20to%20your%20inquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5"
                      >
                        <Phone size={13} />
                        <span>WhatsApp Reply</span>
                      </a>
                      <a
                        href={`mailto:${msg.email}?subject=PURPO%20Creative%20Agency%20-%20Project%20Inquiry`}
                        className="px-4 py-2 rounded-xl glass-panel hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 border border-white/10"
                      >
                        <Mail size={13} />
                        <span>Email Reply</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: TESTIMONIALS ================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-2xl text-white">
                Client Testimonials
              </h3>
              <p className="text-xs text-zinc-400">
                Endorsements from brands and founders featured in the homepage carousel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((test) => (
                <div key={test.id} className="glass-card p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-1 text-amber-400 mb-3">
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 italic mb-4">
                    &ldquo;{test.review}&rdquo;
                  </p>
                  <div className="flex items-center space-x-3 border-t border-white/10 pt-3">
                    {test.photo_url && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-purpo-purple">
                        <Image src={test.photo_url} alt={test.name} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <h5 className="font-semibold text-white text-xs">{test.name}</h5>
                      <span className="text-[11px] text-purpo-cyan">{test.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= VIDEO MODAL FORM ================= */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowVideoModal(false)}
            />
            <div className="relative glass-panel border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full z-10 max-h-[90vh] overflow-y-auto">
              <h3 className="font-display font-bold text-xl text-white mb-4">
                {editingVideo?.id ? 'Edit Video Details' : 'Upload Video to Portfolio'}
              </h3>

              <form onSubmit={handleSaveVideo} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVideo?.title || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, title: e.target.value })
                    }
                    placeholder="e.g. The Lagos Renaissance | Commercial Film"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purpo-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={editingVideo?.category || 'Commercial'}
                      onChange={(e) =>
                        setEditingVideo({
                          ...editingVideo,
                          category: e.target.value as VideoCategory,
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-purpo-surface border border-white/10 text-sm text-white focus:outline-none focus:border-purpo-purple"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Music Video">Music Video</option>
                      <option value="Documentary">Documentary</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Event">Event</option>
                      <option value="Brand Story">Brand Story</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={editingVideo?.client_name || ''}
                      onChange={(e) =>
                        setEditingVideo({ ...editingVideo, client_name: e.target.value })
                      }
                      placeholder="e.g. Heritage Luxury"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purpo-purple"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                    Video URL or Upload File (Supabase Storage)
                  </label>
                  <input
                    type="text"
                    value={editingVideo?.video_url || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, video_url: e.target.value })
                    }
                    placeholder="https://...mp4 or YouTube / Vimeo link"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purpo-purple mb-2"
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-purpo-purple/20 file:text-purpo-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                    Thumbnail Image URL or Upload Image
                  </label>
                  <input
                    type="text"
                    value={editingVideo?.thumbnail_url || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, thumbnail_url: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purpo-purple mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                    className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-purpo-purple/20 file:text-purpo-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingVideo?.description || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, description: e.target.value })
                    }
                    placeholder="Behind the scenes details, camera equipment, concept..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purpo-purple resize-none"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={editingVideo?.featured ?? true}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-purpo-purple focus:ring-purpo-purple bg-zinc-900 border-zinc-700"
                  />
                  <label htmlFor="featuredCheckbox" className="text-xs text-zinc-300">
                    Mark as Featured Video (Maximum 9 displayed on homepage)
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowVideoModal(false)}
                    className="px-4 py-2 rounded-full text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2.5 rounded-full bg-purpo-purple hover:bg-purpo-purple-light text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                  >
                    {uploading ? 'Processing...' : 'Save Video'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= GALLERY MODAL FORM ================= */}
      <AnimatePresence>
        {showGalleryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowGalleryModal(false)}
            />
            <div className="relative glass-panel border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full z-10">
              <h3 className="font-display font-bold text-xl text-white mb-4">
                {editingGallery?.id ? 'Edit Photography Item' : 'Add Image to Gallery'}
              </h3>

              <form onSubmit={handleSaveGallery} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                    Image Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingGallery?.title || ''}
                    onChange={(e) =>
                      setEditingGallery({ ...editingGallery, title: e.target.value })
                    }
                    placeholder="e.g. Midnight Runway Haute Couture"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purpo-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingGallery?.category || 'Commercial'}
                    onChange={(e) =>
                      setEditingGallery({
                        ...editingGallery,
                        category: e.target.value as GalleryCategory,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-purpo-surface border border-white/10 text-sm text-white focus:outline-none focus:border-purpo-purple"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Events">Events</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Brand Shoots">Brand Shoots</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                    Image URL or Upload from Device
                  </label>
                  <input
                    type="text"
                    value={editingGallery?.image_url || ''}
                    onChange={(e) =>
                      setEditingGallery({ ...editingGallery, image_url: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purpo-purple mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                    className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-purpo-cyan/20 file:text-purpo-cyan"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(false)}
                    className="px-4 py-2 rounded-full text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2.5 rounded-full bg-purpo-cyan hover:bg-purpo-cyan-light text-black text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Save Image'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
