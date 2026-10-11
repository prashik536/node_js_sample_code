import React, { useState } from 'react';

export default function LoginPage({ onLogin, onGuestLogin, onSignupClick }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Mobile number or email is required.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);

    fetch(`http://localhost:3001/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid email/mobile or password');
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        // Save token to localStorage
        if (data.token) localStorage.setItem('auth_token', data.token);
        onLogin({
          name: data.user.name || formData.email.split('@')[0] || 'Customer',
          email: data.user.email,
          role: 'customer',
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setErrors({ form: err.message || 'Authentication failed. Please try again.' });
      });
  };

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div className="auth-bg-blob auth-blob-1" />
      <div className="auth-bg-blob auth-blob-2" />

      <div className="auth-card">
        {/* Branding */}
        <div className="auth-brand">
          <div className="auth-logo-badge">
            <span className="auth-z-letter">Z</span>
            <span className="auth-flash-dot">⚡</span>
          </div>
          <div className="auth-brand-text-wrap">
            <span className="auth-brand-name">kiranawala</span>
            <span className="auth-tagline">⚡ 10 MINS delivery</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">Enter your mobile number or email to continue</p>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="auth-email">
              Mobile Number or Email
            </label>
            <div className={`auth-input-wrap${errors.email ? ' auth-input-error' : ''}`}>
              <span className="auth-input-icon">📱</span>
              <span className="auth-country-code">+91</span>
              <input
                id="auth-email"
                className="auth-input"
                type="text"
                name="email"
                placeholder="9999999999 or you@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="auth-error-msg">{errors.email}</p>}
          </div>

          <div className="auth-field-group">
            <label className="auth-label" htmlFor="auth-password">Password</label>
            <div className={`auth-input-wrap${errors.password ? ' auth-input-error' : ''}`}>
              <span className="auth-input-icon">🔒</span>
              <input
                id="auth-password"
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className={`password-eye-icon${showPassword ? ' is-visible' : ''}`} aria-hidden="true" />
              </button>
            </div>
            {errors.password && <p className="auth-error-msg">{errors.password}</p>}
          </div>

          {/* Form Errors */}
          {errors.form && <p className="auth-error-msg auth-form-error">{errors.form}</p>}

          <button
            className={`auth-submit-btn${isLoading ? ' auth-btn-loading' : ''}`}
            type="submit"
            disabled={isLoading}
            id="btn-sign-in"
          >
            {isLoading ? (
              <span className="auth-spinner" />
            ) : (
              <>
                <span>🔑 Sign In</span>
                <span className="auth-btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="auth-demo-hint">
          <span className="auth-demo-icon">💡</span>
          Demo: <strong>customer@zepto.com</strong> / <strong>zepto123</strong>
        </div>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <span className="auth-divider-line" />
        </div>

        {/* Signup link */}
        <button
          className="auth-guest-link"
          type="button"
          id="btn-signup-link"
          onClick={onSignupClick}
        >
          Don't have an account? Sign Up →
        </button>

        {/* Guest link */}
        <button
          className="auth-guest-link auth-guest-secondary"
          type="button"
          id="btn-guest-login"
          onClick={onGuestLogin}
        >
          Browse as Guest →
        </button>
      </div>
    </div>
  );
}
