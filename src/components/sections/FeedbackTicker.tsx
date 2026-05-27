'use client'

import { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
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

export function FeedbackTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<number | null>(null);
  
  // Load feedbacks from API
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

  const hasEnoughForAnimation = feedbacks.length >= 3;

  // Triple the data only if we have 3+ feedbacks
  const items = hasEnoughForAnimation 
    ? [...feedbacks, ...feedbacks, ...feedbacks] 
    : feedbacks;

  // Auto-scroll effect - only for 3+ feedbacks
  useEffect(() => {
    if (!hasEnoughForAnimation) return;

    if (!isPaused) {
      autoScrollInterval.current = window.setInterval(() => {
        setCurrentIndex(prev => prev + 1);
      }, 3000);
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isPaused, hasEnoughForAnimation]);

  // Reset to middle section for infinite loop - only for 3+ feedbacks
  useEffect(() => {
    if (!hasEnoughForAnimation) return;

    if (currentIndex >= feedbacks.length * 2) {
      const container = scrollContainerRef.current;
      if (container) {
        container.style.transition = 'none';
        setCurrentIndex(feedbacks.length);
        setTimeout(() => {
          if (container) {
            container.style.transition = 'transform 500ms ease-out';
          }
        }, 50);
      }
    } else if (currentIndex < 0) {
      const container = scrollContainerRef.current;
      if (container) {
        container.style.transition = 'none';
        setCurrentIndex(feedbacks.length - 1);
        setTimeout(() => {
          if (container) {
            container.style.transition = 'transform 500ms ease-out';
          }
        }, 50);
      }
    }
  }, [currentIndex, feedbacks.length, hasEnoughForAnimation]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}
      />
    ));
  };

  const handleScroll = (direction: 'left' | 'right') => {
    setCurrentIndex(prev => {
      if (direction === 'right') {
        return prev + 1;
      } else {
        return prev - 1;
      }
    });
  };

  // Calculate transform based on current index
  const getTransform = () => {
    if (!hasEnoughForAnimation) return 'translateX(0)';
    const cardWidth = 400 + 24;
    return `translateX(calc(-${currentIndex * cardWidth}px))`;
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-background border-t border-border">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </section>
    );
  }

  // Don't show section if no feedbacks
  if (feedbacks.length === 0) {
    return null;
  }

  // Simple static display for less than 3 feedbacks
  if (!hasEnoughForAnimation) {
    return (
      <section className="py-12 md:py-16 bg-background border-t border-border">
        <div className="mb-8 md:mb-12 text-center px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            What Our Clients Say
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Real feedback from real people who trusted us with their vision
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-6 flex-wrap">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="feedback-card w-[280px] sm:w-[340px] md:w-[380px] lg:w-[400px] bg-card border border-border rounded-xl p-4 md:p-6 transition-all duration-300 flex flex-col hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:scale-105 hover:-translate-y-2"
                style={{ height: '280px' }}
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                  {renderStars(feedback.rating)}
                </div>

                {/* Review */}
                <div className="flex-1 mb-4 overflow-hidden">
                  <p className="text-foreground text-xs md:text-sm leading-relaxed h-full overflow-y-auto pr-2 custom-scrollbar">
                    "{feedback.review}"
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-border flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-semibold text-sm">
                      {feedback.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {feedback.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {feedback.position} {feedback.company && `at ${feedback.company}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom scrollbar styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--accent);
            border-radius: 2px;
            opacity: 0.5;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            opacity: 1;
          }
        `}</style>
      </section>
    );
  }

  // Full animated carousel for 3+ feedbacks
  return (
    <section className="py-12 md:py-16 bg-background border-t border-border">
      <div className="mb-8 md:mb-12 text-center px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          What Our Clients Say
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Real feedback from real people who trusted us with their vision
        </p>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-accent hover:text-background hover:border-accent transition-all shadow-lg hover:scale-110"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-accent hover:text-background hover:border-accent transition-all shadow-lg hover:scale-110"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>

        <div className="overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex transition-transform duration-500 ease-out pt-4 pb-4"
            style={{ transform: getTransform() }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {items.map((feedback, index) => (
              <div
                key={`${feedback._id}-${index}`}
                className="feedback-card flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px] lg:w-[400px] bg-card border border-border rounded-xl p-4 md:p-6 transition-all duration-300 mx-3 flex flex-col hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:scale-105 hover:-translate-y-2"
                style={{ height: '280px' }}
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                  {renderStars(feedback.rating)}
                </div>

                {/* Review */}
                <div className="flex-1 mb-4 overflow-hidden">
                  <p className="text-foreground text-xs md:text-sm leading-relaxed h-full overflow-y-auto pr-2 custom-scrollbar">
                    "{feedback.review}"
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-border flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-semibold text-sm">
                      {feedback.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {feedback.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {feedback.position} {feedback.company && `at ${feedback.company}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 2px;
          opacity: 0.5;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
