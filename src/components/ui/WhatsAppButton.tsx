'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '2348133802278';
  const defaultMessage = encodeURIComponent(
    "Hello PURPO Creative Agency! I'm interested in working with you on a videography / creative project."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col select-none">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 p-3.5 bg-white dark:bg-purpo-card border border-zinc-200 dark:border-purpo-cardBorder rounded-2xl shadow-card text-left max-w-xs text-zinc-900 dark:text-white"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Online • Rapid Reply</span>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                aria-label="Close tooltip"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Have a project or inquiry? Chat directly with the PURPO creative team on WhatsApp!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        {/* Glow halo */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md group-hover:bg-emerald-500/50 transition-all duration-300" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
          aria-label="Chat with PURPO on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white/20 stroke-white" />

          {/* Online badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
          </span>
        </a>
      </div>
    </div>
  );
}
