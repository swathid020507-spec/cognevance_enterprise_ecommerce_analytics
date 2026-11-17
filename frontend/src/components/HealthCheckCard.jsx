import React, { useState, useEffect } from 'react';
import { checkHealth, API_BASE_URL } from '../services/api';
import './HealthCheckCard.css';

export default function HealthCheckCard() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);

    const result = await checkHealth();
    setLastChecked(new Date().toLocaleTimeString());

    if (result.success) {
      setHealth(result.data);
      setError(null);
    } else {
      setError(result.error);
      setHealth(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const isConnected = health && health.status === 'OK';
  const isDbConnected = health?.database?.status === 'Connected';

  return (
    <div className="health-card">
      <div className="health-card-header">
        <div className="header-title-group">
          <div className={`status-dot ${loading ? 'loading' : isConnected ? 'online' : 'offline'}`} />
          <div>
            <h3 className="card-title">System Health & API Diagnostics</h3>
            <p className="card-subtitle">
              Live communication test with Express backend via <code className="endpoint-tag">/api/health</code>
            </p>
          </div>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchHealth}
          disabled={loading}
          title="Refresh health check"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      <div className="health-card-body">
        {/* Environment configuration pill */}
        <div className="config-banner">
          <span className="config-label">VITE_API_BASE_URL:</span>
          <code className="config-value">{API_BASE_URL}</code>
        </div>

        {error && (
          <div className="alert-box alert-error">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Backend Not Reachable:</strong> {error}
              <p className="alert-hint">
                Ensure the backend server is running on port 5000 (<code>cd backend && npm run dev</code>).
              </p>
            </div>
          </div>
        )}

        {health && (
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">API Status</span>
              <span className="metric-badge status-ok">
                ● {health.status}
              </span>
            </div>

            <div className="metric-item">
              <span className="metric-label">MongoDB Connection</span>
              <span className={`metric-badge ${isDbConnected ? 'status-ok' : 'status-warning'}`}>
                ● {health.database?.status || 'Unknown'}
              </span>
            </div>

            <div className="metric-item">
              <span className="metric-label">Environment</span>
              <span className="metric-value">{health.environment}</span>
            </div>

            <div className="metric-item">
              <span className="metric-label">Server Uptime</span>
              <span className="metric-value">{health.uptime}</span>
            </div>

            <div className="metric-item full-width">
              <span className="metric-label">Server Timestamp</span>
              <span className="metric-value timestamp">{health.timestamp}</span>
            </div>
          </div>
        )}

        {health && !isDbConnected && (
          <div className="alert-box alert-warning">
            <div className="alert-icon">ℹ️</div>
            <div className="alert-content">
              <strong>MongoDB is currently {health.database?.status}:</strong>
              <p className="alert-hint">
                The Express server is operational. To connect MongoDB, start a local MongoDB instance or configure <code>MONGODB_URI</code> in <code>backend/.env</code>.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="health-card-footer">
        <span className="footer-timestamp">
          Last tested: {lastChecked || 'Pending...'}
        </span>
        <span className="footer-route">Endpoint: GET /api/health</span>
      </div>
    </div>
  );
}
