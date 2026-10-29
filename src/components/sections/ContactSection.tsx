'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Mail, Send, CheckCircle2, MessageCircle, Clock, Sparkles } from 'lucide-react';
import { submitContactMessage } from '@/lib/supabase';
import { ServiceType } from '@/types/database';

const SERVICES: ServiceType[] = [
  'Videography',
  'Video Editing',
  'Content Creation',
  'Social Media Management',
  'Brand Strategy & Consulting',
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Videography' as ServiceType,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      const result = await submitContactMessage(formData);
      setFeedback(result.message);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Videography',
        message: '',
      });
    } catch (err) {
      setFeedback('An error occurred. Please message us directly via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 scroll-mt-24 overflow-hidden bg-zinc-100/60 dark:bg-black/90 transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purpo-purple/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purpo-cyan/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border border-zinc-200/80 dark:border-white/10 text-xs font-semibold tracking-widest uppercase text-purpo-purple mb-4">
            <Mail size={13} />
            <span>Initiate Collaboration</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            Let&apos;s Build Something{' '}
            <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
              Iconic Together
            </span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed font-normal dark:font-light">
            Whether launching a commercial film, revamping your social video strategy, or commissioning brand consulting in Lagos or worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 glass-card border border-zinc-200/80 dark:border-white/15 rounded-3xl p-8 sm:p-10 shadow-card"
          >
            <div className="inline-flex items-center space-x-2 text-purpo-purple dark:text-purpo-cyan text-xs uppercase tracking-widest font-semibold mb-3">
              <Sparkles size={13} />
              <span>Direct Studio Contact</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              PURPO Studio Headquarters
            </h3>

            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
              We welcome prospective clients and visionary collaborators to visit our Lagos studio or connect via direct hotline.
            </p>

            <div className="space-y-6">
              {/* Phone / WhatsApp */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center shrink-0 shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.004 0C5.372 0 .004 5.368.004 11.996c0 2.112.551 4.17 1.6 5.987L.004 24l6.208-1.628c1.75.954 3.72 1.456 5.792 1.456 6.632 0 12-5.368 12-11.996C24.004 5.368 18.636 0 12.004 0zm0 21.942c-1.872 0-3.704-.503-5.304-1.456l-.38-.226-3.94 1.033 1.052-3.84-.248-.395c-1.048-1.668-1.602-3.614-1.602-5.592 0-5.797 4.725-10.518 10.532-10.518 2.81 0 5.452 1.094 7.438 3.077 1.986 1.983 3.078 4.622 3.078 7.43-.001 5.798-4.726 10.518-10.534 10.518zm5.772-7.886c-.316-.158-1.87-.923-2.16-1.029-.29-.105-.502-.158-.712.158-.21.316-.816 1.029-1 1.239-.184.21-.368.237-.684.079-.316-.158-1.334-.492-2.541-1.568-.939-.838-1.573-1.874-1.757-2.19-.184-.316-.02-.487.138-.644.143-.142.316-.368.474-.552.158-.184.21-.316.316-.526.105-.21.053-.395-.026-.553-.079-.158-.711-1.713-.974-2.345-.257-.615-.518-.532-.711-.542-.184-.01-.395-.01-.606-.01-.21 0-.553.079-.842.395-.29.316-1.106 1.08-1.106 2.634s1.132 3.055 1.29 3.266c.158.21 2.226 3.4 5.394 4.767.754.325 1.343.519 1.802.665.757.241 1.446.207 1.99.126.608-.091 1.87-.764 2.133-1.501.263-.737.263-1.369.184-1.501-.079-.132-.29-.21-.606-.368z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-1">
                    Call / WhatsApp Hotline
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="tel:08133802278"
                      className="text-base font-bold text-zinc-900 dark:text-white hover:text-[#25D366] transition-colors"
                    >
                      08133802278
                    </a>
                    <a
                      href="https://wa.me/2348133802278?text=Hello%20PURPO%20Creative%20Agency!%20I'm%20interested%20in%20working%20with%20you."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm transition-transform hover:scale-105 active:scale-95"
                    >
                      <span>Chat WhatsApp</span>
                    </a>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Direct line to Creative Director • 24/7 Rapid Response
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl glass-panel border border-zinc-200/80 dark:border-white/10 flex items-center justify-center text-purpo-cyan shrink-0 shadow-sm">
                  <MapPin size={20} className="text-purpo-purple dark:text-purpo-cyan" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-1">
                    Studio Location
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug">
                    27, Ijaoye Street, Jibowu, Yaba, Lagos, Nigeria
                  </p>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Creative & Tech district of Lagos
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl glass-panel border border-zinc-200/80 dark:border-white/10 flex items-center justify-center text-purpo-purple-light shrink-0 shadow-sm">
                  <Clock size={20} className="text-purpo-purple" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-1">
                    Production Hours
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Mon — Sat: 8:00 AM — 8:00 PM WAT
                  </p>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center space-x-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Emergency film shoots available 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="mt-8 pt-6 border-t border-zinc-200/80 dark:border-white/10">
              <a
                href="https://wa.me/2348133802278?text=Hello%20PURPO,%20I'd%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp (08133802278)</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-card border border-zinc-200/80 dark:border-white/15 rounded-3xl p-8 sm:p-10 shadow-card"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-purpo-purple/20 border border-purpo-purple flex items-center justify-center text-purpo-purple mb-4 shadow-glow">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Message Dispatched!
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-md leading-relaxed mb-6">
                  {feedback}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full glass-panel border border-zinc-300 dark:border-white/10 text-xs uppercase font-semibold text-zinc-900 dark:text-white hover:border-purpo-purple transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                    Send a Project Inquiry
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Fill out the form below. Our producers will review and respond within 24 hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Adebayo Adeleke"
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. adebayo@brand.com"
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 08133802278"
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                    />
                  </div>

                  {/* Service Needed */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                      Service Needed *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-purpo-surface border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white shadow-sm transition-colors cursor-pointer"
                    >
                      {SERVICES.map((serv) => (
                        <option key={serv} value={serv} className="bg-white text-zinc-900 dark:bg-purpo-card dark:text-white">
                          {serv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                    Project Overview / Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your brand, campaign goals, target timeline, and budget expectation..."
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow hover:from-purpo-purple-hover hover:to-purpo-purple text-white font-semibold text-xs uppercase tracking-wider shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting to PURPO Team...</span>
                  ) : (
                    <>
                      <span>Send Project Message</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
