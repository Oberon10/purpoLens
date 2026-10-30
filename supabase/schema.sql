-- =========================================================================
-- PURPO PORTFOLIO DATABASE SCHEMA & POLICIES
-- Brand: PURPO (Lagos, Nigeria)
-- Compatible with Supabase PostgreSQL & Supabase Storage
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Commercial', 'Music Video', 'Documentary', 'Social Media', 'Event', 'Brand Story')),
    thumbnail_url TEXT NOT NULL,
    video_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    client_name TEXT,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Events', 'Commercial', 'Lifestyle', 'Brand Shoots')),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    photo_url TEXT,
    review TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BOOKINGS TABLE (PURPOLENS Client Bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    service TEXT NOT NULL,
    event_date DATE,
    location TEXT,
    estimated_budget TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
    is_read BOOLEAN DEFAULT false,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- POLICIES: PUBLIC ACCESS
-- Anyone can view videos, gallery, and testimonials
CREATE POLICY "Allow public read access on videos" ON public.videos
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on gallery" ON public.gallery
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on testimonials" ON public.testimonials
    FOR SELECT USING (true);

-- Anyone can submit a contact message, booking request, or subscribe to newsletter
CREATE POLICY "Allow public insert on contact_messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on newsletter_subscribers" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- POLICIES: AUTHENTICATED & DASHBOARD ACCESS
-- Allows video and gallery updates from the studio admin dashboard
CREATE POLICY "Allow admin insert on videos" ON public.videos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update on videos" ON public.videos
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete on videos" ON public.videos
    FOR DELETE USING (true);

CREATE POLICY "Allow admin insert on gallery" ON public.gallery
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update on gallery" ON public.gallery
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete on gallery" ON public.gallery
    FOR DELETE USING (true);

CREATE POLICY "Allow full access for authenticated admins on testimonials" ON public.testimonials
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access for authenticated admins on contact_messages" ON public.contact_messages
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access for authenticated admins on bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access for authenticated admins on newsletter_subscribers" ON public.newsletter_subscribers
    FOR ALL USING (auth.role() = 'authenticated');

-- STORAGE BUCKETS (portfolio-videos & portfolio-images)
-- Note: Insert buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-videos', 'portfolio-videos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
CREATE POLICY "Public Read Access on portfolio-videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-videos');

CREATE POLICY "Authenticated Admin Upload on portfolio-videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Admin Delete on portfolio-videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Public Read Access on portfolio-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated Admin Upload on portfolio-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Admin Delete on portfolio-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

