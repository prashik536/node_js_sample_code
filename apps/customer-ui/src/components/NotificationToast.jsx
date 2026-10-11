import React from 'react';

export default function NotificationToast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast-notification-banner">
      <div className="toast-content">
        <span className="toast-icon">⚡</span>
        <span className="toast-text">{message}</span>
      </div>
      <button className="toast-close-btn" onClick={onClose}>✕</button>
    </div>
  );
}
