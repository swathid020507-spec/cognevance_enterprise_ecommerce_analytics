import React from 'react';
import './HeroBanner.css';

export default function HeroBanner({ onExplore }) {
  return (
    <section className="hero-banner">
      <div className="hero-content">
        <div className="hero-badge-pill">
          <span className="live-dot" /> Cognevance Enterprise Hardware & Software
        </div>
        <h1 className="hero-main-title">
          Next-Generation Infrastructure for Enterprise Scale
        </h1>
        <p className="hero-description">
          Equip your organization with high-density server clusters, precision developer workstations, advanced cloud telemetry, and certified enterprise hardware.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={onExplore}>
            Browse Enterprise Catalog &darr;
          </button>
        </div>

        <div className="hero-perks">
          <div className="perk-item">
            <span className="perk-icon">⚡</span>
            <div>
              <strong>Instant Procurement</strong>
              <p>Direct PO & corporate card approval</p>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon">🛡️</span>
            <div>
              <strong>Enterprise SLAs</strong>
              <p>5-year hardware replacement</p>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon">📈</span>
            <div>
              <strong>Built-in Analytics</strong>
              <p>Real-time order tracking & metrics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
