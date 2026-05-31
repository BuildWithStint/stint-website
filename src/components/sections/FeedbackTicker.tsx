'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, X } from 'lucide-react';
import { feedbackAPI } from '../../services/api';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  company?: string;
  position?: string;
  isVisible: boolean;
}

const PREVIEW_LIMIT = 180; // characters shown on card before "Read more"

export function FeedbackTicker() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const isInteractingRef = useRef(false);
  const dragStateRef = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: 0 });
  const resumeTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const response = await feedbackAPI.getFeedbacks();
        if (response.success && response.feedbacks.length > 0) {
          setFeedbacks(response.feedbacks);
        }
      } catch (error) {
        console.error('Failed to load feedbacks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeedbacks();
  }, []);

  // Smooth continuous auto-scroll.
  // NOTE: `scrollLeft` is stored as an integer by every browser, so naive
  // `wrap.scrollLeft += 0.35` rounds back to 0 each frame and the ticker stalls
  // on devices that hit 60fps (especially iOS / throttled mobile). We keep a
  // fractional accumulator in JS and only push whole pixels into scrollLeft.
  useEffect(() => {
    if (feedbacks.length === 0) return;
    const wrap = wrapperRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const speed = 0.45; // px per ~16ms frame
    let last = performance.now();
    let pos = wrap.scrollLeft;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!isPausedRef.current && !isInteractingRef.current && !selected) {
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          pos += speed * (dt / 16.6667);
          if (pos >= halfWidth) pos -= halfWidth;
          wrap.scrollLeft = pos;
        }
      } else {
        // Keep the accumulator in sync if the user dragged / wheeled.
        pos = wrap.scrollLeft;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [feedbacks.length, selected]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (selected || shareOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [selected, shareOpen]);

  // Esc to close
  useEffect(() => {
    if (!selected && !shareOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelected(null);
        setShareOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, shareOpen]);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 1500);
  }, []);

  const onMouseEnter = () => { isPausedRef.current = true; };
  const onMouseLeave = () => {
    isPausedRef.current = false;
    dragStateRef.current.isDown = false;
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      wrap.scrollLeft += e.deltaY;
    }
    isInteractingRef.current = true;
    scheduleResume();
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    dragStateRef.current.isDown = true;
    dragStateRef.current.startX = e.pageX - wrap.offsetLeft;
    dragStateRef.current.scrollLeft = wrap.scrollLeft;
    dragStateRef.current.moved = 0;
    isInteractingRef.current = true;
  };
  const onMouseUp = () => {
    dragStateRef.current.isDown = false;
    scheduleResume();
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown) return;
    const wrap = wrapperRef.current;
    if (!wrap) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    const walk = x - dragStateRef.current.startX;
    dragStateRef.current.moved = Math.abs(walk);
    wrap.scrollLeft = dragStateRef.current.scrollLeft - walk;
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    dragStateRef.current.isDown = true;
    dragStateRef.current.startX = e.touches[0].pageX - wrap.offsetLeft;
    dragStateRef.current.scrollLeft = wrap.scrollLeft;
    dragStateRef.current.moved = 0;
    isInteractingRef.current = true;
    isPausedRef.current = true;
  };
  const onTouchEnd = () => {
    dragStateRef.current.isDown = false;
    isPausedRef.current = false;
    scheduleResume();
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown) return;
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const x = e.touches[0].pageX - wrap.offsetLeft;
    const walk = x - dragStateRef.current.startX;
    dragStateRef.current.moved = Math.abs(walk);
    wrap.scrollLeft = dragStateRef.current.scrollLeft - walk;
  };

  const renderStars = (rating: number, size = 12) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'fill-accent text-accent' : 'text-foreground/15'}
        />
      ))}
    </div>
  );

  const handleCardClick = (f: Feedback) => {
    // Suppress click if user actually dragged
    if (dragStateRef.current.moved > 5) return;
    setSelected(f);
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </section>
    );
  }

  if (feedbacks.length === 0) return null;

  const items = [...feedbacks, ...feedbacks];

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <section className="py-36 relative overflow-hidden" style={{ background: "var(--card)" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,151,61,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Heading */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 mb-20 relative flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <span
            className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-4 block"
            style={{ color: "var(--accent)" }}
          >
            Kind Words
          </span>
          <h2
            className="font-['Playfair_Display'] font-black leading-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            Trusted by teams.
            <br />
            Backed by results.
          </h2>
        </div>

        <button
          onClick={() => setShareOpen(true)}
          className="group relative inline-flex items-center gap-3 px-7 py-3.5 font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase overflow-hidden self-start md:self-auto"
          style={{
            border: "1px solid var(--accent)",
            color: "var(--accent)",
          }}
          data-hover
        >
          <span
            className="absolute inset-0 bg-[var(--accent)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
            aria-hidden
          />
          <span className="relative z-10 transition-colors duration-500 group-hover:text-[#0A0A0B]">
            Share your feedback
          </span>
          <span
            className="relative z-10 transition-colors duration-500 group-hover:text-[#0A0A0B]"
            aria-hidden
          >
            →
          </span>
        </button>
      </div>

      {/* Scrollable Ticker */}
      <div className="relative">
        <div
          className="absolute top-0 bottom-0 left-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--card), transparent)" }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--card), transparent)" }}
        />

        <div
          ref={wrapperRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMoveCapture={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={onTouchMove}
          className="feedback-scroll overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", touchAction: "pan-y" }}
        >
          <style>{`
            .feedback-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
          `}</style>
          <div
            ref={trackRef}
            className="flex gap-6 px-8 md:px-16 py-6"
            style={{ width: "max-content" }}
          >
            {items.map((feedback, idx) => {
              const isLong = feedback.review.length > PREVIEW_LIMIT;
              const preview = isLong
                ? feedback.review.slice(0, PREVIEW_LIMIT).trimEnd() + '…'
                : feedback.review;

              return (
                <motion.article
                  key={`${feedback._id}-${idx}`}
                  layoutId={`feedback-${feedback._id}-${idx}`}
                  onClick={() => handleCardClick(feedback)}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative w-[340px] sm:w-[400px] md:w-[440px] shrink-0 flex flex-col justify-between p-10 group cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(242,237,228,0.025) 0%, rgba(242,237,228,0.005) 100%)",
                    border: "1px solid rgba(242,237,228,0.08)",
                    minHeight: "300px",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,151,61,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(242,237,228,0.08)";
                  }}
                  data-hover
                >
                  <Quote
                    size={36}
                    className="absolute top-6 right-6"
                    style={{ color: "var(--accent)", opacity: 0.12 }}
                  />

                  <div
                    className="absolute top-0 left-0 h-px w-12 transition-all duration-500 group-hover:w-24"
                    style={{ background: "var(--accent)" }}
                  />

                  <div className="mb-6 relative z-10">{renderStars(feedback.rating)}</div>

                  <p
                    className="font-['Playfair_Display'] italic text-[15px] leading-relaxed relative z-10 flex-1"
                    style={{ color: "rgba(242,237,228,0.75)" }}
                  >
                    &ldquo;{preview}&rdquo;
                  </p>

                  {isLong && (
                    <span
                      className="font-['DM_Mono'] text-[9px] tracking-[0.25em] uppercase mt-4 inline-block relative z-10 transition-colors duration-300 group-hover:text-foreground"
                      style={{ color: "var(--accent)" }}
                    >
                      Read more →
                    </span>
                  )}

                  <div
                    className="h-px w-full my-7"
                    style={{ background: "rgba(242,237,228,0.08)" }}
                  />

                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-['DM_Mono'] text-[11px] tracking-wider"
                      style={{
                        background: "rgba(200,151,61,0.08)",
                        border: "1px solid rgba(200,151,61,0.25)",
                        color: "var(--accent)",
                      }}
                    >
                      {initials(feedback.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-['Playfair_Display'] font-bold text-base text-foreground truncate">
                        {feedback.name}
                      </p>
                      <p
                        className="font-['DM_Mono'] text-[9px] tracking-[0.2em] uppercase mt-1 truncate"
                        style={{ color: "rgba(242,237,228,0.4)" }}
                      >
                        {feedback.position}
                        {feedback.company && ` · ${feedback.company}`}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-8 md:px-16 mt-10 flex items-center gap-3">
          <div className="h-px w-12" style={{ background: "rgba(200,151,61,0.4)" }} />
          <span
            className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(242,237,228,0.35)" }}
          >
            Drag, scroll, or click a card to read more
          </span>
        </div>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(10,10,11,0.85)", backdropFilter: "blur(8px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col"
              style={{
                background:
                  "linear-gradient(180deg, rgba(242,237,228,0.04) 0%, rgba(242,237,228,0.01) 100%)",
                border: "1px solid rgba(200,151,61,0.3)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="absolute top-0 left-0 h-px w-24"
                style={{ background: "var(--accent)" }}
              />
              <Quote
                size={64}
                className="absolute top-8 right-10 pointer-events-none"
                style={{ color: "var(--accent)", opacity: 0.1 }}
              />

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border transition-all hover:bg-foreground/5"
                style={{
                  borderColor: "rgba(242,237,228,0.15)",
                  color: "rgba(242,237,228,0.6)",
                }}
                data-hover
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="px-10 md:px-12 pt-12 pb-6 shrink-0">
                <div className="mb-5">{renderStars(selected.rating, 14)}</div>
                <span
                  className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase block"
                  style={{ color: "var(--accent)" }}
                >
                  Client Review
                </span>
              </div>

              {/* Scrollable review */}
              <div
                className="px-10 md:px-12 overflow-y-auto flex-1 modal-scroll"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(200,151,61,0.4) transparent" }}
              >
                <style>{`
                  .modal-scroll::-webkit-scrollbar { width: 6px; }
                  .modal-scroll::-webkit-scrollbar-track { background: transparent; }
                  .modal-scroll::-webkit-scrollbar-thumb {
                    background: rgba(200,151,61,0.3);
                    border-radius: 3px;
                  }
                  .modal-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(200,151,61,0.55);
                  }
                `}</style>
                <p
                  className="font-['Playfair_Display'] italic leading-relaxed"
                  style={{
                    color: "rgba(242,237,228,0.85)",
                    fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
                  }}
                >
                  &ldquo;{selected.review}&rdquo;
                </p>
              </div>

              {/* Footer / profile */}
              <div
                className="px-10 md:px-12 py-8 mt-6 flex items-center gap-5 shrink-0"
                style={{ borderTop: "1px solid rgba(242,237,228,0.08)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-['DM_Mono'] text-sm tracking-wider"
                  style={{
                    background: "rgba(200,151,61,0.08)",
                    border: "1px solid rgba(200,151,61,0.3)",
                    color: "var(--accent)",
                  }}
                >
                  {initials(selected.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-['Playfair_Display'] font-bold text-lg text-foreground">
                    {selected.name}
                  </p>
                  <p
                    className="font-['DM_Mono'] text-[10px] tracking-[0.25em] uppercase mt-1"
                    style={{ color: "rgba(242,237,228,0.45)" }}
                  >
                    {selected.position}
                    {selected.company && ` · ${selected.company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareFeedbackModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </section>
  );
}

function ShareFeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reset = () => {
    setName(''); setEmail(''); setCompany(''); setPosition('');
    setRating(5); setHoverRating(0); setReview('');
    setError(null); setSuccess(null); setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
    setTimeout(reset, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !review.trim()) {
      setError('Please fill in name, email, and your review.');
      return;
    }
    if (review.trim().length < 10) {
      setError('Review should be at least 10 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await feedbackAPI.submitFeedback({
        name: name.trim(),
        email: email.trim(),
        rating,
        review: review.trim(),
        company: company.trim() || undefined,
        position: position.trim() || undefined,
      });
      if (res?.success) {
        setSuccess(res.message || 'Thank you. Your feedback has been received.');
      } else {
        setError(res?.error || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(242,237,228,0.03)',
    border: '1px solid rgba(242,237,228,0.12)',
    color: 'rgba(242,237,228,0.95)',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto modal-scroll"
            style={{
              background:
                'linear-gradient(180deg, rgba(242,237,228,0.04) 0%, rgba(242,237,228,0.01) 100%)',
              border: '1px solid rgba(200,151,61,0.3)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            }}
          >
            <div
              className="absolute top-0 left-0 h-px w-24"
              style={{ background: 'var(--accent)' }}
            />

            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border transition-all hover:bg-foreground/5 z-10"
              style={{
                borderColor: 'rgba(242,237,228,0.15)',
                color: 'rgba(242,237,228,0.6)',
              }}
              data-hover
            >
              <X size={16} />
            </button>

            <div className="px-8 md:px-12 pt-12 pb-10">
              <span
                className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-4 block"
                style={{ color: 'var(--accent)' }}
              >
                Share Your Feedback
              </span>
              <h3
                className="font-['Playfair_Display'] font-black leading-tight mb-2"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
              >
                Tell us about your experience.
              </h3>
              <p
                className="font-['DM_Sans'] text-sm mb-8"
                style={{ color: 'rgba(242,237,228,0.55)' }}
              >
                Submissions are reviewed before publishing.
              </p>

              {success ? (
                <div
                  className="p-6 font-['DM_Sans'] text-sm"
                  style={{
                    background: 'rgba(200,151,61,0.06)',
                    border: '1px solid rgba(200,151,61,0.3)',
                    color: 'rgba(242,237,228,0.9)',
                  }}
                >
                  {success}
                  <div className="mt-6">
                    <button
                      onClick={handleClose}
                      className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase px-6 py-2.5"
                      style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
                      data-hover
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldLabel label="Name *">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={100}
                        className="w-full px-4 py-3 font-['DM_Sans'] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                        style={inputStyle}
                      />
                    </FieldLabel>
                    <FieldLabel label="Email *">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        maxLength={200}
                        className="w-full px-4 py-3 font-['DM_Sans'] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                        style={inputStyle}
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldLabel label="Company">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        maxLength={100}
                        className="w-full px-4 py-3 font-['DM_Sans'] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                        style={inputStyle}
                      />
                    </FieldLabel>
                    <FieldLabel label="Role">
                      <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        maxLength={100}
                        className="w-full px-4 py-3 font-['DM_Sans'] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                        style={inputStyle}
                      />
                    </FieldLabel>
                  </div>

                  <FieldLabel label="Rating *">
                    <div className="flex items-center gap-2 pt-1">
                      {Array.from({ length: 5 }, (_, i) => {
                        const value = i + 1;
                        const active = (hoverRating || rating) >= value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            onMouseEnter={() => setHoverRating(value)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`${value} star${value > 1 ? 's' : ''}`}
                            className="p-1 transition-transform hover:scale-110"
                            data-hover
                          >
                            <Star
                              size={22}
                              className={active ? 'fill-accent text-accent' : 'text-foreground/20'}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </FieldLabel>

                  <FieldLabel label="Your review *">
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      required
                      minLength={10}
                      maxLength={1000}
                      rows={5}
                      className="w-full px-4 py-3 font-['DM_Sans'] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                      style={inputStyle}
                      placeholder="What was it like working with us?"
                    />
                    <div
                      className="mt-1.5 font-['DM_Mono'] text-[9px] tracking-[0.2em] uppercase text-right"
                      style={{ color: 'rgba(242,237,228,0.35)' }}
                    >
                      {review.length}/1000
                    </div>
                  </FieldLabel>

                  {error && (
                    <div
                      className="p-3 font-['DM_Sans'] text-sm"
                      style={{
                        background: 'rgba(220,80,80,0.06)',
                        border: '1px solid rgba(220,80,80,0.3)',
                        color: 'rgba(255,180,180,0.95)',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative inline-flex items-center gap-3 px-7 py-3.5 font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)',
                      }}
                      data-hover
                    >
                      <span
                        className="absolute inset-0 bg-[var(--accent)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                        aria-hidden
                      />
                      <span className="relative z-10 transition-colors duration-500 group-hover:text-[#0A0A0B]">
                        {submitting ? 'Submitting…' : 'Submit feedback'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase px-4 py-3.5 transition-colors hover:text-foreground"
                      style={{ color: 'rgba(242,237,228,0.5)' }}
                      data-hover
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="font-['DM_Mono'] text-[9px] tracking-[0.25em] uppercase mb-2 block"
        style={{ color: 'rgba(242,237,228,0.5)' }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
