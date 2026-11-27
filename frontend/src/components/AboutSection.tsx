import React, { useState, useEffect, useRef } from 'react';
import scrollGif from '../assets/about/scroll.gif';
import scrollStill from '../assets/about/scroll-still.png';

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [gifSrc, setGifSrc] = useState<string>('');

  // Check for prefers-reduced-motion
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Trigger GIF playback only when section enters viewport
  useEffect(() => {
    if (isReducedMotion) return;

    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasEnteredView) {
            setHasEnteredView(true);
            // Append timestamp key to ensure GIF timeline plays from frame 0
            setGifSrc(`${scrollGif}?t=${Date.now()}`);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasEnteredView, isReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="hadir-about-section"
      id="about"
      aria-labelledby="about-heading"
    >
      <div className="hadir-about-container">
        {/* Left Column: Headline and Subheadline */}
        <div className="hadir-about-text">
          <div className="hadir-about-badge">
            <span className="hadir-badge-dot" aria-hidden="true" />
            <span>Attendance Redefined</span>
          </div>

          <h2 id="about-heading" className="hadir-about-title">
            Start Class{' '} <br /> With
            <span className="hadir-highlight-orange"> No Names Call</span>
          </h2>

          <p className="hadir-about-description">
            Every class begins with the same routine: teachers read the list, students answer,
            and the lesson waits. With Hadir, enrolled students check in by looking at the camera.
            Hadir recognizes each student and logs their name, date, and arrival time in Excel,
            so the teacher can start teaching.
          </p>

          <div className="hadir-about-highlights">
            <div className="hadir-about-highlight-item">
              <span className="hadir-about-check-icon" aria-hidden="true">✓</span>
              <span>Direct Excel spreadsheet export</span>
            </div>
            <div className="hadir-about-highlight-item">
              <span className="hadir-about-check-icon" aria-hidden="true">✓</span>
              <span>Zero roll-call delay at class start</span>
            </div>
            <div className="hadir-about-highlight-item">
              <span className="hadir-about-check-icon" aria-hidden="true">✓</span>
              <span>Accurate facial recognition timestamps</span>
            </div>
          </div>
        </div>

        {/* Right Column: Scroll Animation or Still Frame */}
        <div className="hadir-about-media" aria-live="polite">
          {isReducedMotion ? (
            /* Static frame for visitors who prefer reduced motion */
            <img
              src={scrollStill}
              alt="Fully open attendance scroll held by a wooden clamp"
              className="hadir-about-scroll-img"
              loading="lazy"
            />
          ) : (
            /* Animated unrolling GIF triggered on first view */
            <img
              src={gifSrc || scrollStill}
              alt="Hadir attendance scroll unfurling from the wooden clamp"
              className="hadir-about-scroll-img"
              key={hasEnteredView ? 'active-gif' : 'pending-gif'}
            />
          )}
        </div>
      </div>
    </section>
  );
};
