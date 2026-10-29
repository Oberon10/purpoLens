import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export const metadata: Metadata = {
  title: 'Admin Dashboard | PURPO Creative Studio CMS',
  description: 'Manage PURPO videos, photography gallery, testimonials, and client inquiries.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-black text-white selection:bg-purpo-purple selection:text-white">
        {children}
      </div>
    </ThemeProvider>
  );
}
