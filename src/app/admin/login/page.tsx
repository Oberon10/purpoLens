'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const supabase = getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          localStorage.setItem('purpo-admin-auth', 'true');
          router.push('/admin');
          return;
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Authentication failed');
        setLoading(false);
        return;
      }
    }

    // Demo Mode fallback or when credentials match demo admin
    if (
      (email === 'admin@purpo.com' && password === 'purpo2026') ||
      !isSupabaseConfigured()
    ) {
      localStorage.setItem('purpo-admin-auth', 'true');
      router.push('/admin');
    } else {
      setErrorMsg('Invalid credentials. You can also click "Access Demo Admin" below.');
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    localStorage.setItem('purpo-admin-auth', 'true');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#F7F8F3] dark:bg-black text-zinc-900 dark:text-white transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purpo-purple/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purpo-cyan/15 rounded-full blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card border border-zinc-200/80 dark:border-white/15 rounded-3xl p-8 sm:p-10 shadow-card relative z-10"
      >
        {/* Brand Logo & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block relative h-12 w-48 mb-4 drop-shadow-[0_0_20px_rgba(157,78,221,0.5)]">
            <Image
              src="/images/purpolens-logo.png"
              alt="PURPOLENS"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            PURPOLENS Studio CMS
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Restricted Admin Portal • Lagos, Nigeria
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@purpo.com"
                className="w-full px-4 py-3 pl-10 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-10 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow hover:from-purpo-purple-hover hover:to-purpo-purple text-white font-semibold text-xs uppercase tracking-wider shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Instant Demo Access Button */}
        <div className="mt-8 pt-6 border-t border-zinc-200/80 dark:border-white/10 text-center">
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-2.5 px-4 rounded-full glass-panel border border-purpo-purple/30 text-purpo-purple hover:bg-purpo-purple/10 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
          >
            <Sparkles size={14} />
            <span>Instant Demo Access (No Setup Required)</span>
          </button>
          <p className="text-[11px] text-zinc-500 mt-3">
            To configure Supabase live auth, run <code className="text-zinc-700 dark:text-zinc-400">supabase/schema.sql</code> and set your environment variables.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            ← Return to PURPO Portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
