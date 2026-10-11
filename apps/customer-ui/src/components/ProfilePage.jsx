import React, { useState } from 'react';

export default function ProfilePage({ user, onLogout, onBack, onSettingsClick }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save profile changes (in real app, call API)
    setIsEditing(false);
    // showToast('Profile updated successfully');
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>My Profile</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="profile-content">
        {/* Profile Avatar */}
        <div className="profile-avatar-section">
          <div className="avatar-circle">
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="profile-info-card">
          {isEditing ? (
            <div className="profile-edit-form">
              <div className="profile-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="profile-input"
                />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-input"
                  disabled
                />
              </div>
              <div className="profile-field">
                <label>Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="profile-input"
                />
              </div>
              <div className="profile-button-group">
                <button className="btn-save" onClick={handleSave}>
                  💾 Save Changes
                </button>
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-view">
              <div className="profile-row">
                <span className="label">Name</span>
                <span className="value">{user.name}</span>
              </div>
              <div className="profile-row">
                <span className="label">Email</span>
                <span className="value">{user.email}</span>
              </div>
              {user.mobile && (
                <div className="profile-row">
                  <span className="label">Mobile</span>
                  <span className="value">{user.mobile}</span>
                </div>
              )}
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Account Sections */}
        <div className="profile-sections">
          <div className="section-group">
            <h3>Settings</h3>
            <button className="section-item" onClick={onSettingsClick}>
              <span>🔐 Change Password</span>
              <span>›</span>
            </button>
            <button className="section-item" onClick={onSettingsClick}>
              <span>🔔 Notifications</span>
              <span>›</span>
            </button>
            <button className="section-item" onClick={onSettingsClick}>
              <span>❤️ Saved Addresses</span>
              <span>›</span>
            </button>
          </div>

          <div className="section-group">
            <h3>Membership</h3>
            <button className="section-item">
              <span>⭐ Zepto Pass Membership</span>
              <span>›</span>
            </button>
            <button className="section-item">
              <span>🎁 Referral Program</span>
              <span>›</span>
            </button>
          </div>

          <div className="section-group">
            <h3>Support</h3>
            <button className="section-item">
              <span>💬 Contact Us</span>
              <span>›</span>
            </button>
            <button className="section-item">
              <span>❓ FAQs</span>
              <span>›</span>
            </button>
            <button className="section-item">
              <span>📋 Terms & Privacy</span>
              <span>›</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button className="btn-logout" onClick={onLogout}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}
