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
  LogOut,
  CheckCircle,
  AlertCircle,
  Film,
  Phone,
  Mail,
  Home,
  Sun,
  Moon,
  CalendarCheck,
  Calendar,
  Compass,
  Wallet,
  Clock4,
  Search,
  Filter,
  Check,
  X,
  MessageCircle,
  FileText,
  Bell,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import {
  getVideos,
  saveVideo,
  deleteVideo,
  getGallery,
  saveGalleryItem,
  deleteGalleryItem,
  getContactMessages,
  getTestimonials,
  getBookings,
  updateBookingStatus,
  markBookingAsRead,
  deleteBooking,
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
  BookingRequest,
  BookingStatus,
} from '@/types/database';

type AdminTab = 'overview' | 'bookings' | 'videos' | 'gallery' | 'messages' | 'testimonials';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isReady, setIsReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Bookings Filter and Search
  const [bookingFilter, setBookingFilter] = useState<'all' | BookingStatus>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [adminNotesModal, setAdminNotesModal] = useState<{ id: string; notes: string; client_name: string } | null>(null);

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
    setRefreshing(true);
    try {
      const [b, v, g, m, t] = await Promise.all([
        getBookings(),
        getVideos(),
        getGallery(),
        getContactMessages(),
        getTestimonials(),
      ]);
      setBookings(b);
      setVideos(v);
      setGallery(g);
      setMessages(m);
      setTestimonials(t);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setRefreshing(false);
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

  // ================= BOOKING ACTIONS =================
  const isUnreadBooking = (b: BookingRequest) => b.is_read === false || (b.read !== undefined && !b.read);

  const handleBookingStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus, read: true, is_read: true } : b))
      );
      showToast(`Booking status updated to ${newStatus}`);
    } catch (err) {
      showToast('Failed to update booking status', 'error');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markBookingAsRead(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, read: true, is_read: true } : b))
      );
      showToast('Booking marked as read');
    } catch (err) {
      showToast('Failed to mark booking as read', 'error');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking request permanently?')) return;
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      showToast('Booking deleted');
    } catch (err) {
      showToast('Failed to delete booking', 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!adminNotesModal) return;
    try {
      await updateBookingStatus(adminNotesModal.id, undefined as any, adminNotesModal.notes);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === adminNotesModal.id ? { ...b, admin_notes: adminNotesModal.notes } : b
        )
      );
      setAdminNotesModal(null);
      showToast('Producer notes saved');
    } catch (err) {
      showToast('Failed to save notes', 'error');
    }
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
      await saveVideo({
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
    } catch {
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

  const unreadBookingsCount = bookings.filter((b) => isUnreadBooking(b)).length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const featuredVideoCount = videos.filter((v) => v.featured).length;

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'all' || b.status === bookingFilter;
    const query = bookingSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      b.client_name?.toLowerCase().includes(query) ||
      b.client_email?.toLowerCase().includes(query) ||
      b.client_phone?.toLowerCase().includes(query) ||
      b.service?.toLowerCase().includes(query) ||
      b.location?.toLowerCase().includes(query) ||
      b.message?.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F8F3] text-zinc-900 dark:bg-black dark:text-white flex flex-col transition-colors">
      {/* Top Admin Bar */}
      <header className="glass-panel border-b border-zinc-200/80 dark:border-white/10 py-3.5 px-6 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="relative w-8 h-8 drop-shadow-[0_0_15px_rgba(94,96,206,0.6)]">
            <Image src="/images/purpolens-logo.png" alt="PURPO" fill className="object-contain" priority />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-black tracking-widest text-lg uppercase text-zinc-900 dark:text-white">
                PURPO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purpo-purple/15 text-purpo-purple border border-purpo-purple/30">
                CMS & Booking Management
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Creative Studio Operations • Direct Email Sync: purpolensmediahouse@gmail.com
            </p>
          </div>
        </div>

        {/* Database Status indicator & Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={refreshing}
            className="hidden md:flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-full glass-card border border-zinc-200/80 dark:border-white/10 hover:border-purpo-purple text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-purpo-purple' : ''} />
            <span>Sync</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full glass-card border border-zinc-200/80 dark:border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-purpo-purple'
              }`}
            />
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              {isSupabaseConfigured() ? 'Supabase Live Connected' : 'Local + Cloud Persistence Active'}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center glass-panel border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-purpo-purple transition-colors cursor-pointer"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-purpo-purple" />
            )}
          </button>

          <Link
            href="/"
            className="hidden sm:flex items-center space-x-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:text-purpo-purple dark:hover:text-white px-3 py-1.5 rounded-full glass-card border border-zinc-200/80 dark:border-white/10 hover:border-purpo-purple transition-colors"
          >
            <Home size={13} />
            <span>View Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-full glass-card border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer font-medium"
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
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-card border flex items-center space-x-2 text-xs font-semibold ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30'
                : 'bg-red-50 dark:bg-red-950/90 text-red-700 dark:text-red-300 border-red-300 dark:border-red-500/30'
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
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 border-b border-zinc-200/80 dark:border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            Overview
          </button>

          {/* Bookings Tab with Pulsing Unread Badge */}
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <CalendarCheck size={14} />
            <span>Bookings ({bookings.length})</span>
            {unreadBookingsCount > 0 ? (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
                <Bell size={10} />
                <span>{unreadBookingsCount} NEW</span>
              </span>
            ) : (
              <span className="text-[10px] bg-white/20 dark:bg-white/20 px-1.5 py-0.2 rounded-full">
                {bookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <Video size={14} />
            <span>Videos ({videos.length})</span>
            <span className="text-[10px] bg-white/20 dark:bg-white/20 px-1.5 py-0.2 rounded-full">
              {featuredVideoCount}/9 Featured
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <ImageIcon size={14} />
            <span>Photography ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <MessageSquare size={14} />
            <span>Client Inquiries ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 cursor-pointer ${
              activeTab === 'testimonials'
                ? 'bg-purpo-purple text-white shadow-glow'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
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
              {/* Highlight Card: Bookings */}
              <div
                onClick={() => setActiveTab('bookings')}
                className="p-6 rounded-3xl glass-card border border-purpo-purple/50 bg-purpo-purple/10 hover:border-purpo-purple transition-all cursor-pointer group shadow-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-extrabold text-purpo-purple">
                    Total Bookings
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-purpo-purple/20 text-purpo-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalendarCheck size={18} />
                  </div>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="font-display text-4xl font-extrabold text-zinc-900 dark:text-white">
                    {bookings.length}
                  </div>
                  {unreadBookingsCount > 0 && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                      {unreadBookingsCount} Unread
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 flex items-center justify-between">
                  <span>{pendingBookingsCount} Pending Review</span>
                  <span className="text-purpo-purple font-semibold group-hover:underline">Manage →</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl glass-card border border-zinc-200/80 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400">Total Videos</span>
                  <div className="w-10 h-10 rounded-2xl bg-purpo-purple/15 text-purpo-purple flex items-center justify-center">
                    <Video size={18} />
                  </div>
                </div>
                <div className="font-display text-3xl font-extrabold text-zinc-900 dark:text-white">{videos.length}</div>
                <div className="text-xs text-zinc-500 mt-1">{featuredVideoCount}/9 Featured Slots</div>
              </div>

              <div className="p-6 rounded-3xl glass-card border border-zinc-200/80 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400">Gallery Photos</span>
                  <div className="w-10 h-10 rounded-2xl bg-purpo-cyan/20 text-purpo-purple dark:text-purpo-cyan flex items-center justify-center">
                    <ImageIcon size={18} />
                  </div>
                </div>
                <div className="font-display text-3xl font-extrabold text-zinc-900 dark:text-white">{gallery.length}</div>
                <div className="text-xs text-zinc-500 mt-1">Events, Commercial, Brand</div>
              </div>

              <div className="p-6 rounded-3xl glass-card border border-zinc-200/80 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400">Client Inquiries</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <MessageSquare size={18} />
                  </div>
                </div>
                <div className="font-display text-3xl font-extrabold text-zinc-900 dark:text-white">{messages.length}</div>
                <div className="text-xs text-zinc-500 mt-1">General Studio Inquiries</div>
              </div>
            </div>

            {/* Recent Bookings Spotlight */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                    Latest Booking Requests
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Direct incoming production shoots and commercial reservations.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-purpo-purple hover:underline cursor-pointer"
                >
                  View All Bookings ({bookings.length}) →
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No bookings received yet. Submissions from the website booking form will appear here instantly.
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center space-x-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full mt-1 sm:mt-0 shrink-0 ${
                            isUnreadBooking(b) ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                          }`}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">
                              {b.client_name}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purpo-purple/15 text-purpo-purple">
                              {b.service}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                b.status === 'accepted'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : b.status === 'declined'
                                  ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                                  : b.status === 'completed'
                                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-500 flex items-center space-x-3 mt-0.5">
                            <span>{b.client_email}</span>
                            <span>•</span>
                            <span>{b.client_phone}</span>
                            {b.event_date && (
                              <>
                                <span>•</span>
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                  Shoot Date: {b.event_date}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button
                          onClick={() => {
                            setActiveTab('bookings');
                            setBookingSearch(b.client_name);
                          }}
                          className="px-3 py-1.5 rounded-xl glass-panel text-xs font-bold text-purpo-purple hover:border-purpo-purple transition-colors cursor-pointer"
                        >
                          Review Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions & Studio Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-white/10">
                <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white mb-2">
                  Quick Actions
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                  Add content directly into the live PURPO portfolio website.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setEditingVideo({ category: 'Commercial', featured: true });
                      setShowVideoModal(true);
                    }}
                    className="p-4 rounded-2xl glass-panel border border-zinc-200/80 dark:border-white/10 hover:border-purpo-purple text-left transition-colors flex items-center space-x-3 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purpo-purple/15 text-purpo-purple flex items-center justify-center group-hover:bg-purpo-purple group-hover:text-white transition-colors">
                      <Plus size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white">Upload New Video</div>
                      <div className="text-[11px] text-zinc-500">Add to 9-slot portfolio</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setEditingGallery({ category: 'Commercial', featured: true });
                      setShowGalleryModal(true);
                    }}
                    className="p-4 rounded-2xl glass-panel border border-zinc-200/80 dark:border-white/10 hover:border-purpo-purple text-left transition-colors flex items-center space-x-3 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purpo-purple/15 text-purpo-purple flex items-center justify-center group-hover:bg-purpo-purple group-hover:text-white transition-colors">
                      <Plus size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white">Add Photo to Gallery</div>
                      <div className="text-[11px] text-zinc-500">Masonry grid display</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Agency Coordinates Card */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-white/10">
                <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white mb-2">
                  Studio Operational Channels
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                  Verified studio details connected to notifications.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-zinc-200/70 dark:border-white/5">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">Notification Email</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                      purpolensmediahouse@gmail.com
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-200/70 dark:border-white/5">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">WhatsApp Booking Line</span>
                    <span className="text-zinc-900 dark:text-white font-bold">08133802278</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-200/70 dark:border-white/5">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">Studio Address</span>
                    <span className="text-zinc-900 dark:text-white text-right max-w-xs font-semibold">
                      27, Ijaoye Street, Jibowu, Yaba, Lagos, Nigeria
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: BOOKINGS MANAGEMENT ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-white flex items-center space-x-2">
                  <span>Client Booking Requests</span>
                  {unreadBookingsCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold animate-pulse">
                      {unreadBookingsCount} Unread
                    </span>
                  )}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Review production requests, accept or decline shoot dates, add private producer notes, and respond instantly via Email or WhatsApp.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={loadData}
                  className="px-4 py-2 rounded-xl glass-panel text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-purpo-purple flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                  <span>Refresh Bookings</span>
                </button>
              </div>
            </div>

            {/* Filter Pills and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-zinc-200/80 dark:border-white/10">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center space-x-1 mr-1">
                  <Filter size={12} />
                  <span>Status:</span>
                </span>
                {(['all', 'pending', 'accepted', 'declined', 'completed'] as const).map((st) => {
                  const count =
                    st === 'all'
                      ? bookings.length
                      : bookings.filter((b) => b.status === st).length;
                  return (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        bookingFilter === st
                          ? 'bg-purpo-purple text-white shadow-glow'
                          : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[260px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search by client, service, phone..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple shadow-sm"
                />
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="p-16 text-center glass-card rounded-3xl border border-zinc-200/80 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-sm">
                No bookings match your current filter. When clients submit the booking form on the website, they will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => {
                  const isPending = b.status === 'pending';
                  const isAccepted = b.status === 'accepted';
                  const isDeclined = b.status === 'declined';
                  const isCompleted = b.status === 'completed';

                  // Email template
                  const emailSubject = encodeURIComponent(
                    `PURPO Creative Studio - Booking Confirmation #${b.id.slice(0, 8).toUpperCase()}`
                  );
                  const emailBody = encodeURIComponent(
                    `Hello ${b.client_name},\n\nThank you for choosing PURPO for your ${b.service} production.\n\nWe have received your booking request for ${b.event_date ? b.event_date : 'your upcoming project'}.\n\nOur team has reviewed your details and we are thrilled to collaborate with you.\n\nNext Steps:\n- Location: ${b.location || 'Studio / To be confirmed'}\n- Budget Tier: ${b.budget || 'Custom'}\n\nPlease let us know if you have any questions or additional references.\n\nWarm regards,\nPURPO Creative Media House\nLagos, Nigeria\nHotline: 08133802278`
                  );

                  // WhatsApp message
                  const waPhone = b.client_phone.replace(/[^0-9]/g, '');
                  const waMessage = encodeURIComponent(
                    `Hello ${b.client_name}! This is PURPO Creative Studio responding to your booking request for ${b.service} (Ref #${b.id.slice(0, 8).toUpperCase()}). We'd love to finalize your shoot details.`
                  );

                  return (
                    <div
                      key={b.id}
                      className={`glass-card p-6 sm:p-7 rounded-3xl border transition-all ${
                        isUnreadBooking(b)
                          ? 'border-purpo-purple/60 bg-purpo-purple/5 shadow-glow'
                          : 'border-zinc-200/80 dark:border-white/10'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        {/* Booking Details */}
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {isUnreadBooking(b) && (
                              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                                <span>UNREAD</span>
                              </span>
                            )}

                            <span className="font-mono text-xs font-bold text-zinc-500 px-2 py-0.5 rounded bg-zinc-200/70 dark:bg-white/10">
                              REF #{b.id.slice(0, 8).toUpperCase()}
                            </span>

                            <span className="text-xs uppercase font-extrabold px-3 py-0.5 rounded-full bg-purpo-purple/15 text-purpo-purple border border-purpo-purple/30">
                              {b.service}
                            </span>

                            {/* Status Badge */}
                            <span
                              className={`text-xs uppercase font-extrabold px-3 py-0.5 rounded-full flex items-center space-x-1 ${
                                isAccepted
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  : isDeclined
                                  ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                                  : isCompleted
                                  ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              <Clock4 size={11} />
                              <span>{b.status}</span>
                            </span>

                            <span className="text-xs text-zinc-400 ml-auto font-mono">
                              {new Date(b.created_at).toLocaleString()}
                            </span>
                          </div>

                          {/* Client Name & Contacts */}
                          <div>
                            <h4 className="font-display font-extrabold text-xl text-zinc-900 dark:text-white">
                              {b.client_name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                              <a
                                href={`mailto:${b.client_email}`}
                                className="flex items-center space-x-1 hover:text-purpo-purple transition-colors font-medium"
                              >
                                <Mail size={13} className="text-purpo-purple" />
                                <span>{b.client_email}</span>
                              </a>
                              <a
                                href={`tel:${b.client_phone}`}
                                className="flex items-center space-x-1 hover:text-purpo-purple transition-colors font-medium"
                              >
                                <Phone size={13} className="text-purpo-purple" />
                                <span>{b.client_phone}</span>
                              </a>
                            </div>
                          </div>

                          {/* Event Meta: Date, Location, Budget */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div className="p-3 rounded-2xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 text-xs">
                              <div className="flex items-center space-x-1.5 text-zinc-500 mb-0.5">
                                <Calendar size={13} className="text-purpo-purple" />
                                <span className="uppercase text-[10px] font-bold">Target Shoot Date</span>
                              </div>
                              <div className="font-bold text-zinc-900 dark:text-white">
                                {b.event_date || 'Flexible / Unspecified'}
                              </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 text-xs">
                              <div className="flex items-center space-x-1.5 text-zinc-500 mb-0.5">
                                <Compass size={13} className="text-purpo-purple" />
                                <span className="uppercase text-[10px] font-bold">Shoot Location / Venue</span>
                              </div>
                              <div className="font-bold text-zinc-900 dark:text-white truncate">
                                {b.location || 'Studio / To Discuss'}
                              </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 text-xs">
                              <div className="flex items-center space-x-1.5 text-zinc-500 mb-0.5">
                                <Wallet size={13} className="text-purpo-purple" />
                                <span className="uppercase text-[10px] font-bold">Client Budget Tier</span>
                              </div>
                              <div className="font-bold text-emerald-600 dark:text-emerald-400">
                                {b.budget || 'Custom Quote'}
                              </div>
                            </div>
                          </div>

                          {/* Message / Brief */}
                          <div className="pt-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                              Creative Brief / Project Scope:
                            </span>
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-white/5 p-4 rounded-2xl border border-zinc-200/70 dark:border-white/5 leading-relaxed font-normal whitespace-pre-line">
                              {b.message}
                            </p>
                          </div>

                          {/* Producer Notes */}
                          {b.admin_notes && (
                            <div className="p-3 rounded-2xl bg-purpo-purple/10 border border-purpo-purple/20 text-xs">
                              <span className="font-bold text-purpo-purple block mb-0.5">
                                Producer Notes:
                              </span>
                              <span className="text-zinc-800 dark:text-zinc-300 font-normal">
                                {b.admin_notes}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Panel */}
                        <div className="flex flex-col gap-2 shrink-0 w-full lg:w-48 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-zinc-200/80 dark:border-white/10 lg:pl-6">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                            Status Controls
                          </span>

                          {/* Accept Button */}
                          <button
                            onClick={() => handleBookingStatusChange(b.id, 'accepted')}
                            disabled={isAccepted}
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                              isAccepted
                                ? 'bg-emerald-600 text-white opacity-80 cursor-default'
                                : 'bg-emerald-600/15 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white border border-emerald-500/30'
                            }`}
                          >
                            <Check size={14} />
                            <span>{isAccepted ? 'Accepted' : 'Accept Booking'}</span>
                          </button>

                          {/* Decline Button */}
                          <button
                            onClick={() => handleBookingStatusChange(b.id, 'declined')}
                            disabled={isDeclined}
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                              isDeclined
                                ? 'bg-red-600 text-white opacity-80 cursor-default'
                                : 'bg-red-600/10 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white border border-red-500/30'
                            }`}
                          >
                            <X size={14} />
                            <span>{isDeclined ? 'Declined' : 'Decline'}</span>
                          </button>

                          {/* Complete Button */}
                          <button
                            onClick={() => handleBookingStatusChange(b.id, 'completed')}
                            disabled={isCompleted}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-blue-600 text-white opacity-80 cursor-default'
                                : 'glass-panel text-zinc-700 dark:text-zinc-300 hover:border-purpo-purple'
                            }`}
                          >
                            <CheckCircle size={13} />
                            <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
                          </button>

                          {isUnreadBooking(b) && (
                            <button
                              onClick={() => handleMarkAsRead(b.id)}
                              className="w-full py-2 px-3 rounded-xl glass-panel text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
                            >
                              Mark as Read
                            </button>
                          )}

                          <div className="h-px bg-zinc-200 dark:bg-white/10 my-1" />

                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                            Client Response
                          </span>

                          {/* Direct WhatsApp Response */}
                          <a
                            href={`https://wa.me/${waPhone}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp Reply</span>
                          </a>

                          {/* Direct Email Response */}
                          <a
                            href={`mailto:${b.client_email}?subject=${emailSubject}&body=${emailBody}`}
                            className="w-full py-2.5 px-3 rounded-xl glass-panel hover:bg-purpo-purple hover:text-white text-zinc-800 dark:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 border border-zinc-200 dark:border-white/10 transition-colors"
                          >
                            <Mail size={14} />
                            <span>Email Client</span>
                          </a>

                          {/* Add Producer Notes */}
                          <button
                            onClick={() =>
                              setAdminNotesModal({
                                id: b.id,
                                notes: b.admin_notes || '',
                                client_name: b.client_name,
                              })
                            }
                            className="w-full py-2 px-3 rounded-xl glass-panel text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-purpo-purple flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <FileText size={13} />
                            <span>{b.admin_notes ? 'Edit Notes' : 'Add Notes'}</span>
                          </button>

                          {/* Delete Booking */}
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="w-full py-2 px-3 rounded-xl text-xs text-red-500 hover:bg-red-500/10 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>Delete Record</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: VIDEOS MANAGEMENT ================= */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
                  Video Management System
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Manage commercial reels. Maximum exactly 9 featured videos active on the homepage grid ({featuredVideoCount}/9 currently featured).
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingVideo({ category: 'Commercial', featured: true });
                  setShowVideoModal(true);
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-purpo-purple hover:bg-purpo-purple-light text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all cursor-pointer"
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
                  className="glass-card p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    {/* Order controls */}
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => moveVideoOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveVideoOrder(idx, 'down')}
                        disabled={idx === videos.length - 1}
                        className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {/* Thumbnail preview */}
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-zinc-200 dark:border-white/10">
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
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                          {video.category}
                        </span>
                        {video.featured ? (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purpo-purple/15 text-purpo-purple border border-purpo-purple/30">
                            ★ Featured ({idx < 9 ? `Slot 0${idx + 1}` : 'Active'})
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-medium">Unfeatured</span>
                        )}
                        {video.client_name && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">• {video.client_name}</span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-zinc-900 dark:text-white text-sm">
                        {video.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 max-w-xl">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => toggleFeaturedVideo(video)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        video.featured
                          ? 'bg-purpo-purple/15 text-purpo-purple border border-purpo-purple/30'
                          : 'glass-panel text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      {video.featured ? 'Unfeature' : 'Feature'}
                    </button>

                    <button
                      onClick={() => {
                        setEditingVideo(video);
                        setShowVideoModal(true);
                      }}
                      className="p-2 rounded-lg glass-panel hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white cursor-pointer"
                      title="Edit Video"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 rounded-lg glass-panel hover:bg-red-500/20 text-red-500 cursor-pointer"
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

        {/* ================= TAB 4: GALLERY PHOTOS ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
                  Photography Gallery
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Upload and manage high-resolution stills for the masonry portfolio.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingGallery({ category: 'Commercial', featured: true });
                  setShowGalleryModal(true);
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-purpo-purple hover:bg-purpo-purple-light text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-glow"
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
                  className="group relative aspect-square rounded-2xl overflow-hidden glass-card border border-zinc-200/80 dark:border-white/10 shadow-sm"
                >
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/20 text-white w-fit">
                      {item.category}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white truncate mb-2">
                        {item.title}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingGallery(item);
                            setShowGalleryModal(true);
                          }}
                          className="p-1.5 rounded-md bg-white/20 text-white hover:bg-white/40 cursor-pointer"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          className="p-1.5 rounded-md bg-red-500/50 text-white hover:bg-red-500/70 cursor-pointer"
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

        {/* ================= TAB 5: CLIENT INQUIRIES ================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
                General Studio Inquiries
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Inquiries submitted through the general contact form. Reply directly via WhatsApp or Email.
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="p-12 text-center glass-card rounded-3xl border border-zinc-200/80 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-sm">
                No general inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="glass-card p-6 rounded-2xl border border-zinc-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                          {msg.name}
                        </h4>
                        <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-purpo-purple/15 text-purpo-purple border border-purpo-purple/30">
                          {msg.service}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="flex items-center space-x-1 font-medium">
                          <Mail size={13} className="text-purpo-purple" />
                          <span>{msg.email}</span>
                        </span>
                        <span className="flex items-center space-x-1 font-medium">
                          <Phone size={13} className="text-purpo-purple" />
                          <span>{msg.phone}</span>
                        </span>
                      </div>

                      <p className="text-sm text-zinc-800 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 p-4 rounded-xl border border-zinc-200/70 dark:border-white/5 leading-relaxed mt-2 font-normal">
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
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <Phone size={13} />
                        <span>WhatsApp Reply</span>
                      </a>
                      <a
                        href={`mailto:${msg.email}?subject=PURPO%20Creative%20Agency%20-%20Project%20Inquiry`}
                        className="px-4 py-2 rounded-xl glass-panel hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 border border-zinc-200/80 dark:border-white/10"
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

        {/* ================= TAB 6: TESTIMONIALS ================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
                Client Testimonials
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Endorsements from brands and founders featured in the homepage carousel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((test) => (
                <div key={test.id} className="glass-card p-6 rounded-2xl border border-zinc-200/80 dark:border-white/10">
                  <div className="flex items-center space-x-1 text-amber-400 mb-3">
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 italic mb-4 leading-relaxed font-normal">
                    &ldquo;{test.review}&rdquo;
                  </p>
                  <div className="flex items-center space-x-3 border-t border-zinc-200/80 dark:border-white/10 pt-3">
                    {test.photo_url && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-purpo-purple">
                        <Image src={test.photo_url} alt={test.name} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <h5 className="font-bold text-zinc-900 dark:text-white text-xs">{test.name}</h5>
                      <span className="text-[11px] text-purpo-purple font-semibold">{test.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= ADMIN NOTES MODAL ================= */}
      <AnimatePresence>
        {adminNotesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setAdminNotesModal(null)}
            />
            <div className="relative bg-white dark:bg-purpo-card border border-zinc-200 dark:border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 text-zinc-900 dark:text-white shadow-card">
              <h3 className="font-display font-bold text-xl mb-1">
                Producer Notes: {adminNotesModal.client_name}
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Internal team notes on crew assignments, negotiated rates, equipment list, or scheduling updates.
              </p>

              <textarea
                rows={5}
                value={adminNotesModal.notes}
                onChange={(e) =>
                  setAdminNotesModal({ ...adminNotesModal, notes: e.target.value })
                }
                placeholder="e.g. Assigned Lead DP Adebayo. 2x Sony FX3 + Ronin RS3 Pro. Deposit received ₦500k."
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple resize-none shadow-sm mb-4"
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAdminNotesModal(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-6 py-2.5 rounded-full bg-purpo-purple hover:bg-purpo-purple-light text-white text-xs font-bold uppercase tracking-wider shadow-glow cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= VIDEO MODAL FORM ================= */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setShowVideoModal(false)}
            />
            <div className="relative bg-white dark:bg-purpo-card border border-zinc-200 dark:border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full z-10 max-h-[90vh] overflow-y-auto text-zinc-900 dark:text-white shadow-card">
              <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white mb-4">
                {editingVideo?.id ? 'Edit Video Details' : 'Upload Video to Portfolio'}
              </h3>

              <form onSubmit={handleSaveVideo} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
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
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-purpo-surface border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple shadow-sm"
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
                    <label className="block text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={editingVideo?.client_name || ''}
                      onChange={(e) =>
                        setEditingVideo({ ...editingVideo, client_name: e.target.value })
                      }
                      placeholder="e.g. Heritage Luxury"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Video URL or Upload File (Supabase Storage)
                  </label>
                  <input
                    type="text"
                    value={editingVideo?.video_url || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, video_url: e.target.value })
                    }
                    placeholder="https://...mp4 or YouTube / Vimeo link"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple mb-2 shadow-sm"
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="text-xs text-zinc-600 dark:text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-purpo-purple/15 file:text-purpo-purple file:font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Thumbnail Image URL or Upload Image
                  </label>
                  <input
                    type="text"
                    value={editingVideo?.thumbnail_url || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, thumbnail_url: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple mb-2 shadow-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                    className="text-xs text-zinc-600 dark:text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-purpo-purple/15 file:text-purpo-purple file:font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingVideo?.description || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, description: e.target.value })
                    }
                    placeholder="Behind the scenes details, camera equipment, concept..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple resize-none shadow-sm"
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
                    className="w-4 h-4 rounded text-purpo-purple focus:ring-purpo-purple bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="featuredCheckbox" className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    Mark as Featured Video (Maximum 9 displayed on homepage)
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowVideoModal(false)}
                    className="px-4 py-2 rounded-full text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2.5 rounded-full bg-purpo-purple hover:bg-purpo-purple-light text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-glow"
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
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setShowGalleryModal(false)}
            />
            <div className="relative bg-white dark:bg-purpo-card border border-zinc-200 dark:border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full z-10 text-zinc-900 dark:text-white shadow-card">
              <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white mb-4">
                {editingGallery?.id ? 'Edit Photography Item' : 'Add Image to Gallery'}
              </h3>

              <form onSubmit={handleSaveGallery} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
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
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-purpo-surface border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple shadow-sm"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Events">Events</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Brand Shoots">Brand Shoots</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Image URL or Upload from Device
                  </label>
                  <input
                    type="text"
                    value={editingGallery?.image_url || ''}
                    onChange={(e) =>
                      setEditingGallery({ ...editingGallery, image_url: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purpo-purple mb-2 shadow-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                    className="text-xs text-zinc-600 dark:text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-purpo-purple/15 file:text-purpo-purple file:font-semibold"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(false)}
                    className="px-4 py-2 rounded-full text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2.5 rounded-full bg-purpo-purple hover:bg-purpo-purple-light text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-glow"
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
