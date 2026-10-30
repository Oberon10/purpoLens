'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MapPin,
  Mail,
  Send,
  CheckCircle2,
  MessageCircle,
  Clock,
  Sparkles,
  Calendar,
  Compass,
  Wallet,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';
import { submitContactMessage, createBooking } from '@/lib/supabase';
import { ServiceType } from '@/types/database';

const SERVICES: ServiceType[] = [
  'Videography',
  'Video Editing',
  'Content Creation',
  'Social Media Management',
  'Brand Strategy & Consulting',
];

const BUDGET_OPTIONS = [
  'Under ₦300,000',
  '₦300,000 - ₦700,000',
  '₦700,000 - ₦1,500,000',
  '₦1,500,000 - ₦3,000,000',
  '₦3,000,000+ (Premium / Commercial)',
  'Flexible / Open to Quote',
];

export default function ContactSection() {
  const [formType, setFormType] = useState<'booking' | 'inquiry'>('booking');

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service: 'Videography' as ServiceType,
    event_date: '',
    location: '',
    budget: '₦700,000 - ₦1,500,000',
    message: '',
  });

  // Inquiry Form State
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Videography' as ServiceType,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<{
    id: string;
    client_name: string;
    service: string;
    event_date?: string;
  } | null>(null);
  const [submittedInquiry, setSubmittedInquiry] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Minimum date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleInquiryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  // Submit Booking Request
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!bookingData.client_name || !bookingData.client_email || !bookingData.client_phone || !bookingData.message) {
      setErrorMessage('Please fill in your name, email, phone number, and brief description.');
      return;
    }

    setLoading(true);
    try {
      // 1. Submit to API endpoint (triggers database insertion + email dispatch to purpolensmediahouse@gmail.com)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit booking');
      }

      // Also ensure client-side fallback storage has it
      if (json.booking) {
        await createBooking(bookingData);
      }

      setSubmittedBooking({
        id: json.booking?.id || `PL-${Date.now().toString().slice(-6)}`,
        client_name: bookingData.client_name,
        service: bookingData.service,
        event_date: bookingData.event_date,
      });

      setFeedback(
        'Your booking request has been submitted successfully and delivered to the PURPO Creative Studio team. A confirmation email has been dispatched to purpolensmediahouse@gmail.com and our producers will contact you shortly.'
      );

      // Reset form
      setBookingData({
        client_name: '',
        client_email: '',
        client_phone: '',
        service: 'Videography',
        event_date: '',
        location: '',
        budget: '₦700,000 - ₦1,500,000',
        message: '',
      });
    } catch (err: any) {
      console.warn('Booking API error, falling back to local store:', err);
      try {
        const localSaved = await createBooking(bookingData);
        setSubmittedBooking({
          id: (localSaved as any).data?.id || (localSaved as any).id || `PL-${Date.now().toString().slice(-6)}`,
          client_name: bookingData.client_name,
          service: bookingData.service,
          event_date: bookingData.event_date,
        });
        setFeedback(
          'Your booking has been registered with the PURPO studio dashboard. You can also confirm immediately via WhatsApp below.'
        );
      } catch (localErr) {
        setErrorMessage('Unable to register booking right now. Please reach us immediately via WhatsApp at 08133802278.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit General Inquiry
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!inquiryData.name || !inquiryData.email || !inquiryData.message) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      const result = await submitContactMessage(inquiryData);
      setFeedback(result.message || 'Your inquiry was sent successfully. We will get back to you shortly.');
      setSubmittedInquiry(true);
      setInquiryData({
        name: '',
        email: '',
        phone: '',
        service: 'Videography',
        message: '',
      });
    } catch (err) {
      setErrorMessage('An error occurred. Please message us directly via WhatsApp at 08133802278.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-24 scroll-mt-6 overflow-hidden bg-[#eeefe8]/60 dark:bg-black/90 transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purpo-purple/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purpo-cyan/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border border-zinc-200/80 dark:border-white/10 text-xs font-semibold tracking-widest uppercase text-purpo-purple mb-4">
            <Sparkles size={13} />
            <span>Bookings & Studio Inquiries</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            Book a Shoot or{' '}
            <span className="bg-gradient-to-r from-purpo-purple via-purpo-purple-light to-purpo-cyan bg-clip-text text-transparent">
              Collaborate With Us
            </span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed font-normal dark:font-light">
            Reserve your production dates with PURPO. We handle commercial cinematography, brand photography, high-end post-production, and full social media campaigns in Lagos and worldwide.
          </p>

          {/* Form Switcher Pills */}
          <div className="inline-flex p-1.5 rounded-2xl glass-card border border-zinc-200/80 dark:border-white/10 mt-8 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setFormType('booking');
                setErrorMessage('');
              }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                formType === 'booking'
                  ? 'bg-purpo-purple text-white shadow-glow'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <CalendarCheck size={14} />
              <span>Book a Production / Shoot</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormType('inquiry');
                setErrorMessage('');
              }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                formType === 'inquiry'
                  ? 'bg-purpo-purple text-white shadow-glow'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Mail size={14} />
              <span>General Inquiry</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Studio Coordinates & Live Availability */}
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

            <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              PURPO Studio Lagos
            </h3>

            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
              Every booking submitted is reviewed immediately by our executive producer. Emergency shoot dates and international commercial projects can also be locked in directly over the hotline.
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
                      href="https://wa.me/2348133802278?text=Hello%20PURPO%20Creative%20Agency!%20I'm%20interested%20in%20booking%20a%20session."
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

              {/* Email Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl glass-panel border border-zinc-200/80 dark:border-white/10 flex items-center justify-center text-purpo-purple shrink-0 shadow-sm">
                  <Mail size={20} className="text-purpo-purple dark:text-purpo-cyan" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-1">
                    Direct Studio Email
                  </div>
                  <a
                    href="mailto:purpolensmediahouse@gmail.com"
                    className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-purpo-purple transition-colors block"
                  >
                    purpolensmediahouse@gmail.com
                  </a>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Monitored directly by Studio Management
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
                href="https://wa.me/2348133802278?text=Hello%20PURPO,%20I'd%20like%20to%20discuss%20a%20booking%20or%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                <MessageCircle size={16} />
                <span>Instant WhatsApp Booking (08133802278)</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive Booking & Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-card border border-zinc-200/80 dark:border-white/15 rounded-3xl p-8 sm:p-10 shadow-card"
          >
            <AnimatePresence mode="wait">
              {/* SUCCESS RECEIPT FOR BOOKING */}
              {submittedBooking ? (
                <motion.div
                  key="booking-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-8 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500 flex items-center justify-center text-emerald-500 mb-4 shadow-glow">
                    <CheckCircle2 size={34} />
                  </div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purpo-purple/15 text-purpo-purple text-xs font-mono font-bold tracking-wider mb-2">
                    <span>REF #{submittedBooking.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    Booking Request Registered!
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-lg leading-relaxed mb-6 font-normal">
                    {feedback}
                  </p>

                  {/* Summary Box */}
                  <div className="w-full max-w-md p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-left text-xs space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Client:</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{submittedBooking.client_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Service:</span>
                      <span className="font-bold text-purpo-purple">{submittedBooking.service}</span>
                    </div>
                    {submittedBooking.event_date && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Requested Date:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{submittedBooking.event_date}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Studio Notification:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Sent to purpolensmediahouse@gmail.com</span>
                    </div>
                  </div>

                  {/* Call to action buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                    <a
                      href={`https://wa.me/2348133802278?text=Hello%20PURPO,%20I%20just%20submitted%20booking%20ref%20%23${submittedBooking.id.slice(0, 8).toUpperCase()}%20for%20${encodeURIComponent(submittedBooking.service)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm transition-all"
                    >
                      <MessageCircle size={14} />
                      <span>Follow Up on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSubmittedBooking(null)}
                      className="w-full sm:w-auto py-3 px-5 rounded-xl glass-panel border border-zinc-300 dark:border-white/10 text-xs uppercase font-semibold text-zinc-900 dark:text-white hover:border-purpo-purple transition-colors cursor-pointer"
                    >
                      New Booking
                    </button>
                  </div>
                </motion.div>
              ) : submittedInquiry ? (
                /* SUCCESS RECEIPT FOR GENERAL INQUIRY */
                <motion.div
                  key="inquiry-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-purpo-purple/20 border border-purpo-purple flex items-center justify-center text-purpo-purple mb-4 shadow-glow">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    Message Dispatched!
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-md leading-relaxed mb-6 font-normal">
                    {feedback}
                  </p>
                  <button
                    onClick={() => setSubmittedInquiry(false)}
                    className="px-6 py-2.5 rounded-full glass-panel border border-zinc-300 dark:border-white/10 text-xs uppercase font-semibold text-zinc-900 dark:text-white hover:border-purpo-purple transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </motion.div>
              ) : formType === 'booking' ? (
                /* ================= BOOKING FORM ================= */
                <form key="booking-form" onSubmit={handleBookingSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                      Reserve Your Production
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Submit your session details. You will immediately receive a booking confirmation and our producers will follow up with scheduling and crew coordination.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="client_name"
                        required
                        value={bookingData.client_name}
                        onChange={handleBookingChange}
                        placeholder="e.g. Adebayo Adeleke"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="client_email"
                        required
                        value={bookingData.client_email}
                        onChange={handleBookingChange}
                        placeholder="e.g. client@brand.com"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="client_phone"
                        required
                        value={bookingData.client_phone}
                        onChange={handleBookingChange}
                        placeholder="e.g. 08133802278"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                        Service Requested *
                      </label>
                      <select
                        name="service"
                        value={bookingData.service}
                        onChange={handleBookingChange}
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

                  {/* Event Date & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5 flex items-center space-x-1.5">
                        <Calendar size={13} className="text-purpo-purple" />
                        <span>Target Event / Shoot Date</span>
                      </label>
                      <input
                        type="date"
                        name="event_date"
                        min={minDateString}
                        value={bookingData.event_date}
                        onChange={handleBookingChange}
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white shadow-sm transition-colors cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5 flex items-center space-x-1.5">
                        <Compass size={13} className="text-purpo-purple" />
                        <span>Shoot Location / Venue</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={bookingData.location}
                        onChange={handleBookingChange}
                        placeholder="e.g. Victoria Island, Lagos / Studio"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5 flex items-center space-x-1.5">
                      <Wallet size={13} className="text-purpo-purple" />
                      <span>Estimated Budget Range</span>
                    </label>
                    <select
                      name="budget"
                      value={bookingData.budget}
                      onChange={handleBookingChange}
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-purpo-surface border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white shadow-sm transition-colors cursor-pointer"
                    >
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white text-zinc-900 dark:bg-purpo-card dark:text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message / Brief */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                      Project Scope & Creative Brief *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={bookingData.message}
                      onChange={handleBookingChange}
                      placeholder="Describe your vision, deliverables needed (e.g. 60s brand commercial, 10 reels, raw footage), key milestones, and reference styles..."
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-purpo-purple via-purpo-purple-glow to-purpo-cyan hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span>Submitting Booking Request...</span>
                    ) : (
                      <>
                        <span>Submit Booking to PURPO Media</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-zinc-500">
                    Direct notification dispatched to <span className="font-semibold text-zinc-700 dark:text-zinc-300">purpolensmediahouse@gmail.com</span> upon submission.
                  </p>
                </form>
              ) : (
                /* ================= GENERAL INQUIRY FORM ================= */
                <form key="inquiry-form" onSubmit={handleInquirySubmit} className="space-y-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                      Send a Quick Inquiry
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Have a general question or partnership proposal? Fill out the form below.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={inquiryData.name}
                        onChange={handleInquiryChange}
                        placeholder="e.g. Adebayo Adeleke"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={inquiryData.email}
                        onChange={handleInquiryChange}
                        placeholder="e.g. adebayo@brand.com"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={inquiryData.phone}
                        onChange={handleInquiryChange}
                        placeholder="e.g. 08133802278"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                        Service of Interest *
                      </label>
                      <select
                        name="service"
                        value={inquiryData.service}
                        onChange={handleInquiryChange}
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

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                      Inquiry Details *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={inquiryData.message}
                      onChange={handleInquiryChange}
                      placeholder="Tell us what you'd like to achieve, timelines, or ask any question..."
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 focus:border-purpo-purple focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-purpo-purple to-purpo-purple-glow hover:from-purpo-purple-hover hover:to-purpo-purple text-white font-semibold text-xs uppercase tracking-wider shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
