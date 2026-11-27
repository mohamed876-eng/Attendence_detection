import React, { useState, useEffect, useMemo } from 'react';
import { DEMO_TESTIMONIALS, buildColumnSequence } from '../data/testimonialsData';
import { TestimonialCard } from './TestimonialCard';

export const TestimonialsSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Watch for prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Pre-compute 3 sequences with different starting offsets
  // so adjacent columns showcase different students and different card heights.
  // Each sequence is repeated to exceed the visible container height before duplication.
  const column1Sequence = useMemo(() => buildColumnSequence(DEMO_TESTIMONIALS, 0, 6), []);
  const column2Sequence = useMemo(() => buildColumnSequence(DEMO_TESTIMONIALS, 3, 6), []);
  const column3Sequence = useMemo(() => buildColumnSequence(DEMO_TESTIMONIALS, 5, 6), []);

  return (
    <section
      className="hadir-testimonials-section"
      id="testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="hadir-testimonials-container">
        {/* Stationary Section Header */}
        <div className="hadir-testimonials-header">
          <div className="hadir-testimonials-header-content">
            <div className="hadir-testimonials-badge">
              <span className="hadir-badge-dot" aria-hidden="true" />
              <span>Faculty Verified</span>
            </div>
            <h2 id="testimonials-heading" className="hadir-testimonials-title">
              TESTIMONIALS
            </h2>
            <p className="hadir-testimonials-subtitle">
              Hear from educators and department heads streamlining lecture attendance with automatic face recognition.
            </p>
          </div>

          {/* Pause / Play Animation Control (hidden in reduced-motion mode) */}
          {!isReducedMotion && (
            <div className="hadir-testimonials-actions">
              <button
                type="button"
                className="hadir-motion-toggle-btn"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? 'Resume testimonials scroll' : 'Pause testimonials scroll'}
                aria-pressed={isPaused}
              >
                {isPaused ? (
                  <>
                    <svg className="hadir-toggle-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Play</span>
                  </>
                ) : (
                  <>
                    <svg className="hadir-toggle-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                    <span>Pause</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Moving Area with subtle fade at top and bottom */}
        {isReducedMotion ? (
          /* Static masonry grid for users with prefers-reduced-motion */
          <div className="hadir-testimonials-static-grid">
            {DEMO_TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          /* Infinite animated columns */
          <div
            className={`hadir-testimonials-viewport ${isPaused ? 'is-paused' : ''}`}
            aria-live="polite"
          >
            {/* Top Fade Mask */}
            <div className="hadir-testimonials-fade-top" aria-hidden="true" />

            <div className="hadir-testimonials-grid">
              {/* Column 1: Outer Left (Drifts UP) */}
              <div className="hadir-testimonials-col hadir-testimonials-col-1">
                <div className="hadir-testimonial-track drift-up">
                  {/* Primary Sequence (Accessible) */}
                  <div className="hadir-testimonial-sequence">
                    {column1Sequence.map((item, idx) => (
                      <TestimonialCard key={`c1-s1-${item.id}-${idx}`} testimonial={item} />
                    ))}
                  </div>
                  {/* Duplicate Sequence for seamless loop (Hidden from screen readers) */}
                  <div className="hadir-testimonial-sequence" aria-hidden="true">
                    {column1Sequence.map((item, idx) => (
                      <TestimonialCard key={`c1-s2-${item.id}-${idx}`} testimonial={item} isDuplicate />
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Middle (Drifts DOWN) */}
              <div className="hadir-testimonials-col hadir-testimonials-col-2">
                <div className="hadir-testimonial-track drift-down">
                  {/* Primary Sequence */}
                  <div className="hadir-testimonial-sequence">
                    {column2Sequence.map((item, idx) => (
                      <TestimonialCard key={`c2-s1-${item.id}-${idx}`} testimonial={item} />
                    ))}
                  </div>
                  {/* Duplicate Sequence */}
                  <div className="hadir-testimonial-sequence" aria-hidden="true">
                    {column2Sequence.map((item, idx) => (
                      <TestimonialCard key={`c2-s2-${item.id}-${idx}`} testimonial={item} isDuplicate />
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 3: Outer Right (Drifts UP) */}
              <div className="hadir-testimonials-col hadir-testimonials-col-3">
                <div className="hadir-testimonial-track drift-up drift-up-staggered">
                  {/* Primary Sequence */}
                  <div className="hadir-testimonial-sequence">
                    {column3Sequence.map((item, idx) => (
                      <TestimonialCard key={`c3-s1-${item.id}-${idx}`} testimonial={item} />
                    ))}
                  </div>
                  {/* Duplicate Sequence */}
                  <div className="hadir-testimonial-sequence" aria-hidden="true">
                    {column3Sequence.map((item, idx) => (
                      <TestimonialCard key={`c3-s2-${item.id}-${idx}`} testimonial={item} isDuplicate />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Fade Mask */}
            <div className="hadir-testimonials-fade-bottom" aria-hidden="true" />
          </div>
        )}
      </div>
    </section>
  );
};
