import React from 'react';
import { Testimonial } from '../types';
import { StarRating } from './StarRating';

export interface TestimonialCardProps {
  testimonial: Testimonial;
  isDuplicate?: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, isDuplicate }) => {
  return (
    <article
      className="hadir-testimonial-card"
      aria-hidden={isDuplicate ? true : undefined}
      tabIndex={isDuplicate ? -1 : 0}
    >
      <div className="hadir-testimonial-card-header">
        <div className="hadir-testimonial-author">
          <img
            src={testimonial.avatar}
            alt={isDuplicate ? '' : `${testimonial.name} portrait`}
            className="hadir-testimonial-avatar"
            loading="lazy"
          />
          <div className="hadir-testimonial-meta">
            <h3 className="hadir-testimonial-name">{testimonial.name}</h3>
            <span className="hadir-testimonial-dept">{testimonial.department}</span>
          </div>
        </div>

      </div>

      <blockquote className="hadir-testimonial-quote">
        “{testimonial.quote}”
      </blockquote>

      {testimonial.isDemo && (
        <StarRating rating={testimonial.rating} />
      )}
    </article>
  );
};
