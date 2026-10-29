export type VideoCategory =
  | 'Commercial'
  | 'Music Video'
  | 'Documentary'
  | 'Social Media'
  | 'Event'
  | 'Brand Story';

export type GalleryCategory =
  | 'Events'
  | 'Commercial'
  | 'Lifestyle'
  | 'Brand Shoots';

export type ServiceType =
  | 'Videography'
  | 'Video Editing'
  | 'Content Creation'
  | 'Social Media Management'
  | 'Brand Strategy & Consulting';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  thumbnail_url: string;
  video_url: string;
  featured: boolean;
  order_index?: number;
  client_name?: string;
  duration?: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: GalleryCategory;
  featured: boolean;
  created_at: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  photo_url: string;
  review: string;
  rating?: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: ServiceType | string;
  message: string;
  created_at: string;
  status?: 'unread' | 'read' | 'replied';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      videos: {
        Row: VideoItem;
        Insert: Omit<VideoItem, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<VideoItem>;
      };
      gallery: {
        Row: GalleryItem;
        Insert: Omit<GalleryItem, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<GalleryItem>;
      };
      testimonials: {
        Row: TestimonialItem;
        Insert: Omit<TestimonialItem, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<TestimonialItem>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<ContactMessage>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<NewsletterSubscriber, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<NewsletterSubscriber>;
      };
    };
  };
};
