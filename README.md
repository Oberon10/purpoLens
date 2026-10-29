# PURPO — Creative Digital Agency & Cinematic Production Portfolio

A modern, responsive, high-converting portfolio website and CMS dashboard built for **PURPO**, a creative digital brand based in **Yaba, Lagos, Nigeria**.

![PURPO Logo](/public/images/purpo-logo.png)

## 🌟 Brand Information
- **Brand Name**: PURPO
- **Services**:
  - Videography (Commercial, Events, Documentary)
  - Professional Video Editing (Motion graphics, Sound design, DaVinci color grading)
  - Content Creation (Viral Reels, TikTok packages, Conversion shorts)
  - Social Media Management (Strategy, Scheduling, Content calendar)
  - Brand Strategy & Consulting (Brand positioning, Visual identity, Growth consulting)
- **Phone / WhatsApp**: `08133802278` (`+2348133802278`)
- **Studio Address**: 27, Ijaoye Street, Jibowu, Yaba, Lagos, Nigeria

---

## 🚀 Tech Stack
- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism, glows & Dark/Light mode tokens
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Database & Storage**: Supabase (PostgreSQL, Supabase Storage & Supabase Auth)
- **Deployment**: Vercel-ready with zero configuration

---

## 📱 Features & Highlights

1. **Cinematic Hero Section**:
   - Radiant purple & cyan brand ambiance
   - Bold headline: *"Transforming Stories Into Powerful Digital Experiences"*
   - PURPO 3D purple emblem branding
   - Direct showreel trigger and dual call-to-actions

2. **Split-Screen About Section**:
   - Yaba, Lagos studio headquarters credentials
   - Agency values (Visual Mastery, Conversion Focus, Turnkey Execution, Rapid Turnaround)

3. **Interactive Services Cards**:
   - 5 core service offerings with dynamic hover glow and deliverable breakdowns

4. **Featured Work (Video Portfolio Grid & Lightbox Player)**:
   - Exactly **9 portfolio video slots** in a responsive 3x3 grid
   - Real-time search bar & category filters
   - Custom fullscreen cinema lightbox player with sound controls and project details

5. **Editorial Photography Gallery**:
   - Masonry layout with category filtering (Events, Commercial, Lifestyle, Brand Shoots)
   - Fullscreen high-resolution lightbox preview

6. **Client Testimonials Carousel**:
   - Smooth auto-advancing carousel with client photos, companies, and 5-star ratings

7. **Production Pipeline Workflow**:
   - Strategy ↓ Planning ↓ Production ↓ Editing ↓ Publishing ↓ Growth

8. **Contact Section & Direct Inquiries**:
   - Direct phone hotline & location cards
   - Contact form submitting to Supabase `contact_messages` table

9. **Conversion & Utility Extras**:
   - Fixed WhatsApp floating button linked to `08133802278` with instant quick-chat
   - Dark / Light mode toggle
   - Back to top button with circular scroll progress indicator
   - Newsletter subscription form
   - Instagram feed showcase (`@purpolens`)
   - Initial branded loading splash screen

10. **Secure Admin Dashboard (`/admin`)**:
    - Video Management: Upload, edit, delete, reorder, and toggle featured (strictly enforces the max 9 featured videos limit)
    - Photography Management: Upload and categorize high-resolution images
    - Client Inquiries Inbox: View submissions with one-click WhatsApp & email reply buttons

---

## 🛠️ Getting Started Locally

### 1. Clone & Install
```bash
git clone https://github.com/Oberon10/purpoLens.git
cd purpoLens-portfolio
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials (optional for testing — mock demo data is provided automatically if keys are omitted):
```env
NEXT_PUBLIC_SITE_URL=https://purpo.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup

To enable Supabase for real-time video/image uploads and contact message storage:
1. Open your Supabase Dashboard at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor**.
3. Copy and run the SQL code inside [`supabase/schema.sql`](supabase/schema.sql).
4. This script will automatically create:
   - `videos` table
   - `gallery` table
   - `testimonials` table
   - `contact_messages` table
   - `newsletter_subscribers` table
   - `portfolio-videos` and `portfolio-images` public storage buckets
   - RLS security policies allowing public read and authenticated admin write access.

---

## 🔐 Admin Dashboard Access
- URL: `/admin` (or `/admin/login`)
- Default Demo Mode: Click **"Instant Demo Access"** on the login page or use `admin@purpo.com` / `purpo2026`.
- Live Mode: Authenticate using any email/password user created in your Supabase Auth dashboard.

---

## 🚢 Deploying to Vercel

1. Push your code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. In Vercel Environment Variables, add:
   - `NEXT_PUBLIC_SITE_URL`: your production Vercel URL
   - `NEXT_PUBLIC_SUPABASE_URL`: your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: your Supabase anonymous key
4. Click **Deploy**.
