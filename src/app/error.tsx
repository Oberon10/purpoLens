'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F8F3] dark:bg-black text-zinc-900 dark:text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
          <AlertCircle size={32} />
        </div>
        <span className="text-xs uppercase tracking-widest text-red-500 font-bold block mb-2">
          Application Notice
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-black mb-4">
          Something went wrong
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
          An unexpected glitch occurred while loading this view. Please try reloading or return home.
        </p>
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-purpo-purple text-white font-semibold text-xs uppercase tracking-wider shadow-glow hover:bg-purpo-purple-hover transition-all"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-zinc-300 dark:border-white/20 text-zinc-700 dark:text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
          >
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

