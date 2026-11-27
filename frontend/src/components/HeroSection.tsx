import React from 'react';
import { HeroScene } from './HeroScene';
import { HeroText } from './HeroText';

export const HeroSection: React.FC = () => {
  return (
    <section className="hadir-hero-section" id="hero">
      <div className="hadir-hero-container">
        <div className="hadir-hero-scene-column">
          <HeroScene />
        </div>

        <div className="hadir-hero-content-column">
          <HeroText />
        </div>
      </div>
    </section>
  );
};
