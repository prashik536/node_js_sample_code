import React, { useState } from 'react';

const DEMO_EMAIL = 'admin@zepto.com';
const DEMO_PASSWORD = 'zepto123';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFa, setTwoFa] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate a brief auth delay for realism
    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        onLogin({ name: 'Admin User', email: email.trim().toLowerCase(), role: 'admin' });
      } else {
        setError('Invalid credentials. Please check your email and password.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="aauth-page">
      <div className="aauth-card">
        {/* Warning Banner */}
        <div className="aauth-warning-banner">
          <span className="aauth-warning-icon">⚠</span>
          <span>Restricted Access — Authorised Personnel Only</span>
        </div>

        {/* Logo & Branding */}
        <div className="aauth-brand">
          <div className="aauth-logo">zepto</div>
          <div className="aauth-subtitle">Admin Console</div>
          <div className="aauth-divider" />
        </div>

        {/* Login Form */}
        <form className="aauth-form" onSubmit={handleSubmit} noValidate>
          <div className="aauth-field-group">
            <label className="aauth-label" htmlFor="aauth-email">Email Address</label>
            <input
              id="aauth-email"
              className="aauth-input"
              type="email"
              autoComplete="username"
              placeholder="admin@zepto.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="aauth-field-group">
            <label className="aauth-label" htmlFor="aauth-password">Password</label>
            <input
              id="aauth-password"
              className="aauth-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="aauth-field-group">
            <label className="aauth-label" htmlFor="aauth-2fa">
              Two-Factor Code
              <span className="aauth-optional-tag">Optional</span>
            </label>
            <input
              id="aauth-2fa"
              className="aauth-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              value={twoFa}
              onChange={(e) => setTwoFa(e.target.value.replace(/\D/g, ''))}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="aauth-error" role="alert">
              <span className="aauth-error-icon">✕</span>
              {error}
            </div>
          )}

          <button
            id="aauth-submit-btn"
            className={`aauth-submit-btn${isLoading ? ' aauth-loading' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="aauth-spinner" />
            ) : (
              <>
                <span className="aauth-lock-icon">🔒</span>
                Secure Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="aauth-demo-box">
          <div className="aauth-demo-label">Demo Credentials</div>
          <div className="aauth-demo-row">
            <span className="aauth-demo-key">Email</span>
            <span className="aauth-demo-value">{DEMO_EMAIL}</span>
          </div>
          <div className="aauth-demo-row">
            <span className="aauth-demo-key">Password</span>
            <span className="aauth-demo-value">{DEMO_PASSWORD}</span>
          </div>
        </div>

        <p className="aauth-footer-note">
          Unauthorised access is strictly prohibited and may be subject to legal action.
        </p>
      </div>
    </div>
  );
}
