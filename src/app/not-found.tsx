import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F8F3] dark:bg-black text-zinc-900 dark:text-white flex items-center justify-center px-4 selection:bg-purpo-purple selection:text-white">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purpo-purple/10 dark:bg-white/5 border border-purpo-purple/30 flex items-center justify-center text-purpo-purple dark:text-purpo-cyan">
          <Compass size={32} />
        </div>
        <span className="text-xs uppercase tracking-widest text-purpo-purple dark:text-purpo-cyan font-bold block mb-2">
          404 Error • Scene Not Found
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black mb-4">
          Off Script
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
          The page or creative asset you are looking for does not exist or has been moved to another location.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow hover:from-purpo-purple-hover hover:to-purpo-purple text-white font-semibold text-xs uppercase tracking-wider shadow-glow hover:shadow-glow-lg transition-all"
        >
          <ArrowLeft size={14} />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}

