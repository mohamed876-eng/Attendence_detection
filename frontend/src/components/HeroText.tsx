import React from 'react';

export const HeroText: React.FC = () => {
  return (
    <div className="hadir-hero-text-column">
      {/* Eyebrow Badge */}
      <div className="hadir-eyebrow-badge">
        <span className="hadir-pulse-dot" />
        <span className="hadir-eyebrow-text">Biometric Face Recognition</span>
      </div>

      {/* Main Headline with key word highlighted in #FF9845 */}
      <h1 className="hadir-hero-headline">
        Attendance in a <span className="hadir-highlight-orange">Glance</span>.
      </h1>

      {/* Subtitle in light gray */}
      <p className="hadir-hero-subtitle">
        Hadir recognizes students as they check in and records their attendance automatically.
      </p>

      {/* Minimalist Action Buttons */}
      <div className="hadir-hero-cta-group">
        <button className="hadir-btn-minimal-primary">
          <span>Schedule Demo</span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>

        <button className="hadir-btn-minimal-secondary">
          <span>Documentation</span>
        </button>
      </div>

      {/* Key Metrics / Proof Points with minimalist charcoal border */}
      <div className="hadir-hero-metrics">
        <div className="hadir-metric-item">
          <div className="hadir-metric-value">0.3s</div>
          <div className="hadir-metric-label">Scan speed</div>
        </div>

        <div className="hadir-metric-divider" />

        <div className="hadir-metric-item">
          <div className="hadir-metric-value">99.8%</div>
          <div className="hadir-metric-label">Facial accuracy</div>
        </div>

        <div className="hadir-metric-divider" />

        <div className="hadir-metric-item">
          <div className="hadir-metric-value">100%</div>
          <div className="hadir-metric-label">Contactless</div>
        </div>
      </div>

      {/* Live Check-in Trust Strip */}
      <div className="hadir-trust-strip">
        <div className="hadir-trust-avatars">
          <span className="hadir-avatar-dot dot-1" />
          <span className="hadir-avatar-dot dot-2" />
          <span className="hadir-avatar-dot dot-3" />
        </div>
        <div className="hadir-trust-text">
          Syncs with SIS, Canvas LMS, and campus systems in real time
        </div>
      </div>
    </div>
  );
};

