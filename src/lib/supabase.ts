import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database, VideoItem, GalleryItem, TestimonialItem, ContactMessage } from '@/types/database';
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

// =================== VIDEOS SERVICE ===================
export async function getVideos(): Promise<VideoItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as VideoItem[];
      }
    } catch (err) {
      console.warn('Using local video data:', err);
    }
  }
  return localVideos;
}

export async function saveVideo(video: Omit<VideoItem, 'id' | 'created_at'> & { id?: string }): Promise<VideoItem> {
  const supabase = getSupabase();
  if (supabase) {
    if (video.id) {
      const { data, error } = await (supabase.from('videos') as any)
        .update(video)
        .eq('id', video.id)
        .select()
        .single();
      if (!error && data) return data as VideoItem;
    } else {
      const { data, error } = await (supabase.from('videos') as any)
        .insert([video])
        .select()
        .single();
      if (!error && data) return data as VideoItem;
    }
  }

  // Fallback local update
  if (video.id) {
    localVideos = localVideos.map((v) => (v.id === video.id ? ({ ...v, ...video } as VideoItem) : v));
    return localVideos.find((v) => v.id === video.id)!;
  } else {
    const newVideo: VideoItem = {
      ...video,
      id: `vid-${Date.now()}`,
      created_at: new Date().toISOString(),
    } as VideoItem;
    localVideos = [newVideo, ...localVideos];
    return newVideo;
  }
}

export async function deleteVideo(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await (supabase.from('videos') as any).delete().eq('id', id);
    if (!error) return true;
  }
  localVideos = localVideos.filter((v) => v.id !== id);
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
  const supabase = getSupabase();
  if (!supabase) {
    // Return a local object URL in demo mode
    return URL.createObjectURL(file);
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error('Failed to upload file:', err);
    return null;
  }
}
