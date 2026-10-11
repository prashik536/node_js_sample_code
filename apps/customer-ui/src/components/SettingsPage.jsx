import React, { useState } from 'react';

export default function SettingsPage({ onBack }) {
  const [settings, setSettings] = useState({
    push: true,
    sms: true,
    location: true,
    darkMode: false,
    voiceUpdates: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Settings</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="settings-content">
        <div className="settings-section-card">
          <h3>Notifications</h3>

          <div className="setting-row">
            <div>
              <p className="setting-title">Push notifications</p>
              <p className="setting-subtitle">Order updates and promotions</p>
            </div>
            <button
              className={`toggle-switch ${settings.push ? 'on' : ''}`}
              onClick={() => toggleSetting('push')}
              aria-label="Toggle push notifications"
            >
              <span className="toggle-knob" />
            </button>
          </div>

          <div className="setting-row">
            <div>
              <p className="setting-title">SMS updates</p>
              <p className="setting-subtitle">Delivery status alerts</p>
            </div>
            <button
              className={`toggle-switch ${settings.sms ? 'on' : ''}`}
              onClick={() => toggleSetting('sms')}
              aria-label="Toggle SMS updates"
            >
              <span className="toggle-knob" />
            </button>
          </div>
        </div>

        <div className="settings-section-card">
          <h3>Privacy & Location</h3>

          <div className="setting-row">
            <div>
              <p className="setting-title">Device location access</p>
              <p className="setting-subtitle">For faster delivery & address detection</p>
            </div>
            <button
              className={`toggle-switch ${settings.location ? 'on' : ''}`}
              onClick={() => toggleSetting('location')}
              aria-label="Toggle location access"
            >
              <span className="toggle-knob" />
            </button>
          </div>
        </div>

        <div className="settings-section-card">
          <h3>Preferences</h3>

          <div className="setting-row">
            <div>
              <p className="setting-title">Dark mode</p>
              <p className="setting-subtitle">For night shopping</p>
            </div>
            <button
              className={`toggle-switch ${settings.darkMode ? 'on' : ''}`}
              onClick={() => toggleSetting('darkMode')}
              aria-label="Toggle dark mode"
            >
              <span className="toggle-knob" />
            </button>
          </div>

          <div className="setting-row">
            <div>
              <p className="setting-title">Voice updates</p>
              <p className="setting-subtitle">Narrated order tracking</p>
            </div>
            <button
              className={`toggle-switch ${settings.voiceUpdates ? 'on' : ''}`}
              onClick={() => toggleSetting('voiceUpdates')}
              aria-label="Toggle voice updates"
            >
              <span className="toggle-knob" />
            </button>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-save settings-save-btn">💾 Save Preferences</button>
          <button className="btn-cancel settings-reset-btn">Reset</button>
        </div>
      </div>
    </div>
  );
}
