import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p className="footer-title">Enterprise E-Commerce & Analytics Platform</p>
          <p className="footer-sub">Cognevance Technologies &bull; Level 3 Internship Project</p>
        </div>
        <div className="footer-right">
          <span className="badge-tag">React + Vite</span>
          <span className="badge-tag">Express.js</span>
          <span className="badge-tag">MongoDB</span>
        </div>
      </div>
    </footer>
  );
}
