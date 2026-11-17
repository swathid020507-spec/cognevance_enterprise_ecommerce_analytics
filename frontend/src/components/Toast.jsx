import React from 'react';
import './Toast.css';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  return (
    <div className={`toast-container toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
