import React from 'react';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { TestimonialsSection } from './TestimonialsSection';
import { TeamSection } from './TeamSection';

export const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <TestimonialsSection />
      <TeamSection />
    </>
  );
};
