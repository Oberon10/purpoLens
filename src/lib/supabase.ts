import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database, VideoItem, GalleryItem, TestimonialItem, ContactMessage, BookingRequest, BookingStatus } from '@/types/database';
import { INITIAL_VIDEOS, INITIAL_GALLERY, INITIAL_TESTIMONIALS } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    supabaseUrl.startsWith('https://')
  );
};

let supabaseInstance: any = null;

export const getSupabase = (): any => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};

// Fallback in-memory storage for demo mode when Supabase is not yet configured
let localVideos: VideoItem[] = [...INITIAL_VIDEOS];
let localGallery: GalleryItem[] = [...INITIAL_GALLERY];
let localTestimonials: TestimonialItem[] = [...INITIAL_TESTIMONIALS];
let localContactMessages: ContactMessage[] = [];
let localBookings: BookingRequest[] = [
  {
    id: 'book-101',
    client_name: 'Folake Adeyemi',
    client_email: 'folake@heritagebrands.ng',
    client_phone: '08023456789',
    service: 'Videography',
    event_date: '2026-11-15',
    location: 'Eko Hotel & Suites, Victoria Island, Lagos',
    estimated_budget: '₦2,500,000 - ₦5,000,000',
    message: 'We are hosting our annual Heritage Luxury Gala and require a 4-camera cinema setup with 4K RAW coverage, drone establishing shots, and same-day social highlights edit.',
    status: 'pending',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'book-102',
    client_name: 'David Adeleke',
    client_email: 'david@afrobeatrecords.com',
    client_phone: '08123456780',
    service: 'Video Editing',
    event_date: '2026-11-20',
    location: 'Lekki Phase 1, Lagos',
    estimated_budget: '₦1,000,000 - ₦2,500,000',
    message: 'Music video post-production for upcoming single. Need DaVinci Resolve color grading, rhythmic match cuts, and motion typography.',
    status: 'accepted',
    is_read: true,
    admin_notes: 'Confirmed deposit received. Studio calendar reserved.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

// =================== VIDEOS SERVICE ===================
export async function getVideos(): Promise<VideoItem[]> {
  // 1. Check local client storage for any newly uploaded videos
  let clientSavedVideos: VideoItem[] = [];
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('purpo_local_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          clientSavedVideos = parsed;
        }
      }
    } catch {}
  }

  // 2. Query Supabase
  let dbVideos: VideoItem[] = [];
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        dbVideos = data as VideoItem[];
      }
    } catch (err) {
      console.warn('Using local video data:', err);
    }
  }

  // 3. Query /api/videos server endpoint if available
  if (typeof window !== 'undefined' && dbVideos.length === 0) {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.videos) && json.videos.length > 0) {
          dbVideos = json.videos;
        }
      }
    } catch {}
  }

  // 4. Merge all sources: client custom uploads first, then DB videos, then curated initial videos
  const map = new Map<string, VideoItem>();

  for (const v of clientSavedVideos) {
    if (v && v.id) map.set(v.id, v);
  }

  for (const v of dbVideos) {
    if (v && v.id) {
      // Fix any legacy blocked commondatastorage link
      if (v.video_url?.includes('commondatastorage.googleapis.com')) {
        v.video_url = 'https://vjs.zencdn.net/v/oceans.mp4';
      }
      map.set(v.id, v);
    }
  }

  for (const initial of INITIAL_VIDEOS) {
    if (!map.has(initial.id)) {
      map.set(initial.id, initial);
    }
  }

  const result = Array.from(map.values());
  localVideos = result;
  return result;
}

export async function saveVideo(video: Omit<VideoItem, 'id' | 'created_at'> & { id?: string }): Promise<VideoItem> {
  const newId = video.id || `vid-${Date.now()}`;
  const videoPayload: VideoItem = {
    ...video,
    id: newId,
    created_at: new Date().toISOString(),
  } as VideoItem;

  // 1. Persist to server via /api/videos
  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoPayload),
      });
    } catch (err) {
      console.warn('Failed to save to /api/videos:', err);
    }
  }

  // 2. Persist to Supabase if available
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (video.id && !video.id.startsWith('vid-')) {
        await (supabase.from('videos') as any).update(video).eq('id', video.id);
      } else {
        await (supabase.from('videos') as any).insert([video]);
      }
    } catch (err) {
      console.warn('Supabase saveVideo warning:', err);
    }
  }

  // 3. Persist to local in-memory array & localStorage
  if (video.id) {
    localVideos = localVideos.map((v) => (v.id === video.id ? { ...v, ...videoPayload } : v));
  } else {
    localVideos = [videoPayload, ...localVideos.filter((v) => v.id !== newId)];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('purpo_local_videos', JSON.stringify(localVideos));
    } catch {}
  }

  return videoPayload;
}

export async function deleteVideo(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      await fetch(`/api/videos?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {}
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await (supabase.from('videos') as any).delete().eq('id', id);
    } catch {}
  }

  localVideos = localVideos.filter((v) => v.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('purpo_local_videos', JSON.stringify(localVideos));
    } catch {}
  }
  return true;
}

// =================== GALLERY SERVICE ===================
export async function getGallery(): Promise<GalleryItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as GalleryItem[];
      }
    } catch (err) {
      console.warn('Using local gallery data:', err);
    }
  }
  return localGallery;
}

export async function saveGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'> & { id?: string }): Promise<GalleryItem> {
  const supabase = getSupabase();
  if (supabase) {
    if (item.id) {
      const { data, error } = await (supabase.from('gallery') as any)
        .update(item)
        .eq('id', item.id)
        .select()
        .single();
      if (!error && data) return data as GalleryItem;
    } else {
      const { data, error } = await (supabase.from('gallery') as any)
        .insert([item])
        .select()
        .single();
      if (!error && data) return data as GalleryItem;
    }
  }

  if (item.id) {
    localGallery = localGallery.map((g) => (g.id === item.id ? ({ ...g, ...item } as GalleryItem) : g));
    return localGallery.find((g) => g.id === item.id)!;
  } else {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      created_at: new Date().toISOString(),
    } as GalleryItem;
    localGallery = [newItem, ...localGallery];
    return newItem;
  }
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await (supabase.from('gallery') as any).delete().eq('id', id);
    if (!error) return true;
  }
  localGallery = localGallery.filter((g) => g.id !== id);
  return true;
}

// =================== TESTIMONIALS SERVICE ===================
export async function getTestimonials(): Promise<TestimonialItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as TestimonialItem[];
      }
    } catch (err) {
      console.warn('Using local testimonials data:', err);
    }
  }
  return localTestimonials;
}

// =================== CONTACT MESSAGES SERVICE ===================
export async function submitContactMessage(message: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          ...message,
          status: 'unread',
        } as any,
      ]);
      if (error) {
        console.error('Supabase contact submission error:', error);
        throw error;
      }
      return { success: true, message: 'Your message has been sent successfully! Our creative director will contact you promptly.' };
    } catch (err: any) {
      // Fallback
    }
  }

  const newMsg: ContactMessage = {
    ...message,
    id: `msg-${Date.now()}`,
    status: 'unread',
    created_at: new Date().toISOString(),
  };
  localContactMessages.unshift(newMsg);
  return { success: true, message: 'Your message has been received! We will respond within 24 hours.' };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as ContactMessage[];
    } catch (err) {
      console.warn('Using local messages:', err);
    }
  }
  return localContactMessages;
}

// =================== BOOKINGS SERVICE ===================
export async function createBooking(
  booking: Omit<BookingRequest, 'id' | 'created_at' | 'status' | 'is_read'> & Partial<BookingRequest>
): Promise<{ success: boolean; data: BookingRequest; message: string }> {
  const supabase = getSupabase();
  const newBookingPayload: Omit<BookingRequest, 'id' | 'created_at'> = {
    client_name: booking.client_name,
    client_email: booking.client_email,
    client_phone: booking.client_phone,
    service: booking.service,
    event_date: booking.event_date || undefined,
    location: booking.location || '',
    estimated_budget: booking.estimated_budget || '',
    message: booking.message,
    status: (booking.status as BookingStatus) || 'pending',
    is_read: false,
    admin_notes: '',
  };

  if (supabase) {
    try {
      const { data, error } = await (supabase.from('bookings') as any)
        .insert([newBookingPayload])
        .select()
        .single();
      if (!error && data) {
        return {
          success: true,
          data: data as BookingRequest,
          message: 'Booking request submitted successfully! A confirmation notice has been sent to our production desk.',
        };
      }
    } catch (err) {
      console.warn('Using local booking store:', err);
    }
  }

  // Local persistent fallback
  const created: BookingRequest = {
    ...newBookingPayload,
    id: `book-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  localBookings.unshift(created);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('purpo_local_bookings', JSON.stringify(localBookings));
    } catch {}
  }

  return {
    success: true,
    data: created,
    message: 'Booking request submitted successfully! Our producer will review and confirm your shoot date within 24 hours.',
  };
}

export async function getBookings(): Promise<BookingRequest[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as BookingRequest[];
      }
    } catch (err) {
      console.warn('Using local bookings:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('purpo_local_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localBookings = parsed;
        }
      }
    } catch {}
  }
  return localBookings;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  admin_notes?: string
): Promise<boolean> {
  const supabase = getSupabase();
  const updatePayload: any = { status };
  if (admin_notes !== undefined) updatePayload.admin_notes = admin_notes;

  if (supabase) {
    try {
      const { error } = await (supabase.from('bookings') as any)
        .update(updatePayload)
        .eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase updateBookingStatus error, falling back to local:', err);
    }
  }

  localBookings = localBookings.map((b) =>
    b.id === id ? { ...b, ...updatePayload } : b
  );
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('purpo_local_bookings', JSON.stringify(localBookings));
    } catch {}
  }
  return true;
}

export async function markBookingAsRead(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await (supabase.from('bookings') as any)
        .update({ is_read: true })
        .eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase markBookingAsRead error, falling back to local:', err);
    }
  }

  localBookings = localBookings.map((b) =>
    b.id === id ? { ...b, is_read: true } : b
  );
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('purpo_local_bookings', JSON.stringify(localBookings));
    } catch {}
  }
  return true;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await (supabase.from('bookings') as any).delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase deleteBooking error, falling back to local:', err);
    }
  }

  localBookings = localBookings.filter((b) => b.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('purpo_local_bookings', JSON.stringify(localBookings));
    } catch {}
  }
  return true;
}

// =================== NEWSLETTER SERVICE ===================
export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
      if (error) {
        if (error.code === '23505') {
          return { success: true, message: 'You are already subscribed to the PURPO Creative Bulletin.' };
        }
        throw error;
      }
      return { success: true, message: 'Thank you for subscribing to PURPO Creative updates!' };
    } catch (err: any) {
      // Fallback
    }
  }
  return { success: true, message: 'Thank you for subscribing to PURPO Creative updates!' };
}

// =================== STORAGE UPLOADER ===================
export async function uploadMediaFile(
  file: File,
  bucket: 'portfolio-videos' | 'portfolio-images'
): Promise<string | null> {
  // 1. First, attempt upload via server-side /api/upload endpoint
  // This guarantees files are saved to public/uploads/videos or images and accessible
  if (typeof window !== 'undefined') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.url) {
          return json.url;
        }
      }
    } catch (apiErr) {
      console.warn('Server API upload failed, attempting client fallback:', apiErr);
    }
  }

  // 2. Direct Supabase Storage attempt
  const supabase = getSupabase();
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (!uploadError) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      }
    } catch (err) {
      console.warn('Direct Supabase storage upload error:', err);
    }
  }

  // 3. Fallback object URL for immediate browser session
  if (typeof window !== 'undefined') {
    return URL.createObjectURL(file);
  }
  return null;
}
