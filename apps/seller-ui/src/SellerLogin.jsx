import React, { useState } from 'react';

const DEMO_EMAIL = 'seller@zepto.com';
const DEMO_PASSWORD = 'zepto123';

export default function SellerLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Invalid credentials. Use the demo credentials below.');
      return;
    }

    setLoading(true);
    // Simulate a brief auth delay for premium feel
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: 'Demo Seller', email: DEMO_EMAIL, role: 'seller' });
    }, 600);
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  return (
    <div className="sauth-page">
      <div className="sauth-card">
        {/* Logo Area */}
        <div className="sauth-logo-area">
          <span className="sauth-logo-text">zepto</span>
          <span className="sauth-logo-subtitle">Seller Portal</span>
        </div>

        {/* Heading */}
        <h2 className="sauth-heading">Sign in to your Store</h2>
        <p className="sauth-subheading">Manage your inventory, orders & analytics</p>

        {/* Form */}
        <form className="sauth-form" onSubmit={handleSubmit} noValidate>
          <div className="sauth-field">
            <label htmlFor="sauth-email" className="sauth-label">Email address</label>
            <input
              id="sauth-email"
              type="email"
              className="sauth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="sauth-field">
            <label htmlFor="sauth-password" className="sauth-label">Password</label>
            <input
              id="sauth-password"
              type="password"
              className="sauth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="sauth-error" role="alert">
              <span className="sauth-error-icon">⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="sauth-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="sauth-spinner" aria-label="Signing in…" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="sauth-demo-box" onClick={fillDemo} role="button" tabIndex={0} title="Click to auto-fill credentials">
          <span className="sauth-demo-label">Demo credentials — click to fill</span>
          <div className="sauth-demo-row">
            <span className="sauth-demo-key">Email</span>
            <code className="sauth-demo-val">{DEMO_EMAIL}</code>
          </div>
          <div className="sauth-demo-row">
            <span className="sauth-demo-key">Password</span>
            <code className="sauth-demo-val">{DEMO_PASSWORD}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
