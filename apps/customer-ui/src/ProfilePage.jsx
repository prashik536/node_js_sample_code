import React, { useState } from 'react';

const ProfilePage = ({ user, onLogout, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+91 9876543210',
    address: user?.address || '123 Main St, Bangalore',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>My Profile</h2>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="profile-content">
        {/* Avatar */}
        <div className="profile-avatar-section">
          <div className="avatar-circle">
            {user?.name?.charAt(0) || 'J'}
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="profile-info-card">
          {!isEditing ? (
            <div className="profile-view">
              <div className="profile-row">
                <div className="label">Full Name</div>
                <div className="value">{formData.name}</div>
              </div>
              <div className="profile-row">
                <div className="label">Email</div>
                <div className="value">{formData.email}</div>
              </div>
              <div className="profile-row">
                <div className="label">Phone</div>
                <div className="value">{formData.phone}</div>
              </div>
              <div className="profile-row">
                <div className="label">Address</div>
                <div className="value">{formData.address}</div>
              </div>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <form className="profile-edit-form">
              <div className="profile-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              </div>
              <div className="profile-field">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              </div>
              <div className="profile-field">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              </div>
              <div className="profile-button-group">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-save"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sections */}
        <div className="profile-sections">
          {/* Addresses */}
          <div className="section-group">
            <h3>🏠 Saved Addresses</h3>
            <div className="section-item">
              <span>Home</span>
              <span>123 Main St, Bangalore</span>
            </div>
            <div className="section-item">
              <span>Work</span>
              <span>456 Business Park, Bangalore</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="section-group">
            <h3>💳 Payment Methods</h3>
            <div className="section-item">
              <span>Debit Card</span>
              <span>•••• 4242</span>
            </div>
            <div className="section-item">
              <span>Google Pay</span>
              <span>Connected</span>
            </div>
          </div>

          {/* Preferences */}
          <div className="section-group">
            <h3>⚙️ Preferences</h3>
            <div className="section-item">
              <span>Notifications</span>
              <span>Enabled</span>
            </div>
            <div className="section-item">
              <span>Language</span>
              <span>English</span>
            </div>
            <div className="section-item">
              <span>Theme</span>
              <span>Light</span>
            </div>
          </div>

          {/* Help */}
          <div className="section-group">
            <h3>❓ Support</h3>
            <div className="section-item">
              <span>Help Center</span>
            </div>
            <div className="section-item">
              <span>Contact Us</span>
            </div>
            <div className="section-item">
              <span>Terms & Conditions</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button className="btn-logout" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
