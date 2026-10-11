import React, { useState } from 'react';

export default function SignupPage({ onSignup, onBackToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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

    fetch(`http://localhost:3001/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        mobile: `+91${formData.mobile.replace(/\D/g, '')}`,
        password: formData.password,
        role: 'customer'
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Email already exists or invalid data');
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        if (data.token) localStorage.setItem('auth_token', data.token);
        onSignup({
          name: data.user.name,
          email: data.user.email,
          role: 'customer',
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setErrors({ form: err.message || 'Signup failed. Please try again.' });
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-blob auth-blob-1" />
      <div className="auth-bg-blob auth-blob-2" />

      <div className="auth-card">
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

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join kiranawala for fast deliveries</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="auth-name">Full Name</label>
            <div className={`auth-input-wrap${errors.name ? ' auth-input-error' : ''}`}>
              <span className="auth-input-icon">👤</span>
              <input
                id="auth-name"
                className="auth-input"
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="auth-error-msg">{errors.name}</p>}
          </div>

          <div className="auth-field-group">
            <label className="auth-label" htmlFor="auth-email">Email Address</label>
            <div className={`auth-input-wrap${errors.email ? ' auth-input-error' : ''}`}>
              <span className="auth-input-icon">✉️</span>
              <input
                id="auth-email"
                className="auth-input"
                type="email"
                name="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="auth-error-msg">{errors.email}</p>}
          </div>

          <div className="auth-field-group">
            <label className="auth-label" htmlFor="auth-mobile">Mobile Number</label>
            <div className={`auth-input-wrap${errors.mobile ? ' auth-input-error' : ''}`}>
              <span className="auth-input-icon">📱</span>
              <span className="auth-country-code">+91</span>
              <input
                id="auth-mobile"
                className="auth-input"
                type="tel"
                name="mobile"
                placeholder="9999999999"
                value={formData.mobile}
                onChange={(e) => {
                  const mobile = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData((prev) => ({ ...prev, mobile }));
                  if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }));
                }}
                autoComplete="tel"
              />
            </div>
            {errors.mobile && <p className="auth-error-msg">{errors.mobile}</p>}
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
                autoComplete="new-password"
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

          <div className="auth-field-group">
            <label className="auth-label" htmlFor="auth-confirm-password">Confirm Password</label>
            <div className={`auth-input-wrap${errors.confirmPassword ? ' auth-input-error' : ''}`}>
              <span className="auth-input-icon">🔒</span>
              <input
                id="auth-confirm-password"
                className="auth-input"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <span className={`password-eye-icon${showConfirmPassword ? ' is-visible' : ''}`} aria-hidden="true" />
              </button>
            </div>
            {errors.confirmPassword && <p className="auth-error-msg">{errors.confirmPassword}</p>}
          </div>

          {errors.form && <p className="auth-error-msg auth-form-error">{errors.form}</p>}

          <button
            className={`auth-submit-btn${isLoading ? ' auth-btn-loading' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-spinner" />
            ) : (
              <>
                <span>🚀 Create Account</span>
                <span className="auth-btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <span className="auth-divider-line" />
        </div>

        <button
          className="auth-guest-link"
          type="button"
          onClick={onBackToLogin}
        >
          Already have an account? Sign In →
        </button>
      </div>
    </div>
  );
}
