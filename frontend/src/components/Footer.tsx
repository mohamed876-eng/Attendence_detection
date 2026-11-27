import React from 'react';
import Logo from '../assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="hadir-footer">
      <div className="hadir-footer-container">
        <div className="hadir-footer-brand">
          <div className="hadir-logo-wrap">
            <img src={Logo} alt="Hadir" style={{ height: 36, width: 'auto' }} />
          </div>
          <p className="hadir-footer-tagline">
            Attendance in a glance. Reconnaissance faciale intelligente pour les campus modernes.
          </p>
        </div>

        <div className="hadir-footer-links">
          <div className="hadir-footer-col">
            <h4 className="hadir-footer-heading">Produit</h4>
            <a href="#about" className="hadir-footer-link">À propos</a>
            <a href="#testimonials" className="hadir-footer-link">Témoignages</a>
            <a href="#team-heading" className="hadir-footer-link">Équipe</a>
          </div>
          <div className="hadir-footer-col">
            <h4 className="hadir-footer-heading">Contact</h4>
            <a href="mailto:contact@hadir.app" className="hadir-footer-link">contact@hadir.app</a>
            <span className="hadir-footer-link">Campus Innovation</span>
          </div>
        </div>
      </div>

      <div className="hadir-footer-bottom">
        <span>© {new Date().getFullYear()} Hadir. Tous droits réservés.</span>
        <span className="hadir-footer-bottom-note">Built with care for smarter attendance.</span>
      </div>
    </footer>
  );
};
