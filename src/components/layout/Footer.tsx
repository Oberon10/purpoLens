'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Shield,
  Heart,
  Video,
} from 'lucide-react';
import { subscribeNewsletter } from '@/lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subMsg, setSubMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await subscribeNewsletter(email);
      setSubMsg(res.message);
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubMsg('Thank you for subscribing!');
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-black border-t border-white/10 pt-20 pb-12 overflow-hidden text-zinc-400">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-purpo-purple/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center space-x-3 group w-fit">
              <div className="relative w-12 h-12 drop-shadow-[0_0_20px_rgba(94,96,206,0.6)]">
                <Image
                  src="/images/purpo-logo.png"
                  alt="PURPO"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-[0.2em] uppercase text-white group-hover:text-purpo-purple transition-colors">
                  PURPO
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                  Creative Agency • Lagos
                </span>
              </div>
            </Link>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              PURPO is an award-caliber digital agency based in Lagos, Nigeria. We craft cinema-grade commercial films, viral social video campaigns, and high-impact brand strategies.
            </p>

            <div className="flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purpo-purple transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purpo-purple transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://vimeo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purpo-purple transition-colors"
                aria-label="Vimeo"
              >
                <Video size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purpo-purple transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purpo-purple transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-widest mb-5">
              Explore
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About PURPO
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-white transition-colors">
                  Featured 9 Videos
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Photography Gallery
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  Production Pipeline
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">
                  Client Reviews
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-purpo-purple hover:underline flex items-center space-x-1">
                  <Shield size={12} />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-widest mb-5">
              Capabilities
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="text-zinc-300">Videography (Commercial & Events)</li>
              <li className="text-zinc-300">Professional Video Editing & Sound</li>
              <li className="text-zinc-300">Content Creation (Reels & TikTok)</li>
              <li className="text-zinc-300">Social Media Management & Strategy</li>
              <li className="text-zinc-300">Brand Strategy & Consulting</li>
              <li className="text-zinc-300">Documentary Production</li>
              <li className="text-zinc-300">Color Grading & Motion Graphics</li>
            </ul>
          </div>

          {/* Newsletter & Studio Address (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-widest mb-5">
              Studio & Newsletter
            </h4>

            <div className="text-xs space-y-2 mb-4">
              <div className="flex items-start space-x-2 text-zinc-300">
                <MapPin size={14} className="text-purpo-cyan shrink-0 mt-0.5" />
                <span>27, Ijaoye Street, Jibowu, Yaba, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <Phone size={14} className="text-purpo-purple shrink-0" />
                <a href="tel:08133802278" className="hover:text-white">
                  08133802278
                </a>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              Subscribe to the PURPO Creative Dispatch for case studies, cinematography breakdowns, and creative trends.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-2xl bg-purpo-purple/20 border border-purpo-purple/40 text-purpo-purple text-xs">
                {subMsg}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:border-purpo-purple focus:outline-none pr-10"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-purpo-purple hover:bg-purpo-purple-light text-white flex items-center justify-center transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} PURPO Creative Agency. All rights reserved.</p>
          <p className="flex items-center space-x-1 text-zinc-500">
            <span>Crafted with cinema obsession in</span>
            <span className="text-zinc-300 font-medium">Yaba, Lagos, Nigeria</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
