'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '2348133802278';
  const defaultMessage = encodeURIComponent(
    "Hello PURPO Creative Agency! I'm interested in working with you on a videography / creative project."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col select-none">
      {/* Tooltip Popup */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl text-left max-w-xs text-zinc-900 dark:text-white"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Online • Rapid Reply
                </span>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-0.5"
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

      {/* Main WhatsApp Floating Button */}
      <div className="relative group flex items-center">
        {/* Hover Pill Label */}
        <span className="hidden sm:inline-block mr-3 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white text-xs font-semibold border border-zinc-200 dark:border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Chat on WhatsApp
        </span>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Chat with PURPO on WhatsApp"
        >
          {/* Official WhatsApp Logo SVG */}
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 sm:w-9 sm:h-9 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12.004 0C5.372 0 .004 5.368.004 11.996c0 2.112.551 4.17 1.6 5.987L.004 24l6.208-1.628c1.75.954 3.72 1.456 5.792 1.456 6.632 0 12-5.368 12-11.996C24.004 5.368 18.636 0 12.004 0zm0 21.942c-1.872 0-3.704-.503-5.304-1.456l-.38-.226-3.94 1.033 1.052-3.84-.248-.395c-1.048-1.668-1.602-3.614-1.602-5.592 0-5.797 4.725-10.518 10.532-10.518 2.81 0 5.452 1.094 7.438 3.077 1.986 1.983 3.078 4.622 3.078 7.43-.001 5.798-4.726 10.518-10.534 10.518zm5.772-7.886c-.316-.158-1.87-.923-2.16-1.029-.29-.105-.502-.158-.712.158-.21.316-.816 1.029-1 1.239-.184.21-.368.237-.684.079-.316-.158-1.334-.492-2.541-1.568-.939-.838-1.573-1.874-1.757-2.19-.184-.316-.02-.487.138-.644.143-.142.316-.368.474-.552.158-.184.21-.316.316-.526.105-.21.053-.395-.026-.553-.079-.158-.711-1.713-.974-2.345-.257-.615-.518-.532-.711-.542-.184-.01-.395-.01-.606-.01-.21 0-.553.079-.842.395-.29.316-1.106 1.08-1.106 2.634s1.132 3.055 1.29 3.266c.158.21 2.226 3.4 5.394 4.767.754.325 1.343.519 1.802.665.757.241 1.446.207 1.99.126.608-.091 1.87-.764 2.133-1.501.263-.737.263-1.369.184-1.501-.079-.132-.29-.21-.606-.368z" />
          </svg>

          {/* Active Online Indicator Dot */}
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-[#25D366] rounded-full animate-pulse" />
          </span>
        </a>
      </div>
    </div>
  );
}
