import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import JsonLd from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://purpo.vercel.app"),
  title: {
    default: "PURPO | Premium Creative Agency & Cinematic Production | Lagos, Nigeria",
    template: "%s | PURPO Creative Agency",
  },
  description:
    "PURPO is an award-caliber digital agency in Lagos, Nigeria specializing in high-end Videography, Professional Video Editing, Viral Content Creation, Social Media Management, and Brand Strategy.",
  keywords: [
    "Videographer in Lagos",
    "Video Editor Nigeria",
    "Content Creator Lagos",
    "Brand Strategy Consultant",
    "Social Media Management Lagos",
    "Cinematic Videography Lagos",
    "Commercial Video Production Nigeria",
    "PURPO",
    "PURPO Studios",
    "Yaba creative agency",
  ],
  authors: [{ name: "PURPO Creative Agency", url: "https://purpo.vercel.app" }],
  creator: "PURPO",
  publisher: "PURPO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://purpo.vercel.app",
    siteName: "PURPO Creative Agency",
    title: "PURPO | Transforming Stories Into Powerful Digital Experiences",
    description:
      "World-class Videography, Editing, Content Creation, and Brand Strategy based in Yaba, Lagos, Nigeria.",
    images: [
      {
        url: "/images/purpolens-logo.png",
        width: 1200,
        height: 630,
        alt: "PURPO Creative Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PURPO | Transforming Stories Into Powerful Digital Experiences",
    description:
      "World-class Videography, Editing, Content Creation, and Brand Strategy based in Yaba, Lagos, Nigeria.",
    images: ["/images/purpolens-logo.png"],
    creator: "@purpolens",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-slate-50 text-zinc-900 dark:bg-black dark:text-white min-h-screen selection:bg-purpo-purple selection:text-white transition-colors duration-300`}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
