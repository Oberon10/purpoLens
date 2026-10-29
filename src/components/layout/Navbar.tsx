'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ArrowUpRight, Sparkles, Shield } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Process', href: '#process' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 glass-panel border-b border-zinc-200/80 dark:border-white/10 shadow-card'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link
              href="/"
              className="flex items-center space-x-3 group cursor-pointer focus:outline-none"
            >
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(94,96,206,0.6)]">
                <Image
                  src="/images/purpo-logo.png"
                  alt="PURPO"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-[0.2em] uppercase text-zinc-900 dark:text-white group-hover:text-purpo-purple transition-colors">
                  PURPO
                </span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-medium">
                  Creative Agency • Lagos
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 glass-card px-4 py-1.5 rounded-full border border-zinc-200/80 dark:border-white/10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-xs uppercase tracking-wider text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 transition-all duration-200 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center glass-panel border border-zinc-200/80 dark:border-white/10 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white hover:border-purpo-purple transition-colors cursor-pointer"
                aria-label="Toggle Theme"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun size={17} className="text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon size={17} className="text-purpo-purple hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* Admin Dashboard shortcut */}
              <Link
                href="/admin"
                className="w-10 h-10 rounded-full flex items-center justify-center glass-panel border border-zinc-200/80 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-purpo-purple transition-colors"
                title="Admin Dashboard"
              >
                <Shield size={16} />
              </Link>

              {/* Book a Project CTA */}
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="group relative inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow text-white text-xs font-semibold tracking-wider uppercase shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Book a Project</span>
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center glass-panel text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/10"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-purpo-purple" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center glass-panel text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-white/10 focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 pt-24 px-6 pb-8 bg-white/95 dark:bg-black/95 backdrop-blur-2xl flex flex-col justify-between lg:hidden text-zinc-900 dark:text-white"
          >
            <div className="flex flex-col space-y-4 pt-4">
              <span className="text-[11px] uppercase tracking-widest text-purpo-purple font-semibold">
                Menu Navigation
              </span>
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-2xl font-display font-medium text-zinc-800 dark:text-white/90 hover:text-purpo-purple dark:hover:text-purpo-cyan transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-purpo-purple flex items-center space-x-2 pt-2"
              >
                <Shield size={16} />
                <span>Admin Portal (/admin)</span>
              </Link>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-white/10 flex flex-col space-y-4">
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="w-full text-center py-3.5 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow text-white font-medium text-sm shadow-glow"
              >
                Start Your Project
              </a>
              <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                27, Ijaoye Street, Jibowu, Yaba, Lagos • 08133802278
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
