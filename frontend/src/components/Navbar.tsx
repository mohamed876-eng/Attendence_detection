import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png';

export const Navbar: React.FC = () => {
  return (
    <header className="hadir-navbar">
      <div className="hadir-nav-container">
        <Link to="/" className="hadir-logo-wrap" aria-label="Hadir home">
          <img src={Logo} alt="Hadir" style={{ height: 40, width: 'auto' }} />
        </Link>

        <nav className="hadir-nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>Home</NavLink>
          <NavLink to="/scan" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>Scan</NavLink>
        </nav>

        <div className="hadir-nav-actions">
          <Link to="/scan" className="hadir-nav-btn-minimal">Lancer Scan</Link>
        </div>
      </div>
    </header>
  );
};

