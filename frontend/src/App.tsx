import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ScanPage } from './components/ScanPage';
import { Footer } from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="hadir-app-root">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
