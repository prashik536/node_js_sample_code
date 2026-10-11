import React, { useState } from 'react';
import { SAVED_ADDRESSES } from '../data/mockData';

export default function AddressModal({ activeAddress, userLocation, onSelectAddress, onClose }) {
  const [showAddNew, setShowAddNew] = useState(false);
  const [newLabel, setNewLabel] = useState('Other');
  const [newLine1, setNewLine1] = useState('');
  const [newLine2, setNewLine2] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    if (!newLine1 || !newLine2) return;

    const newAddrObj = {
      id: 'addr_' + Date.now(),
      label: newLabel,
      tag: 'NEW',
      line1: newLine1,
      line2: newLine2,
      landmark: newLandmark,
      pincode: '500081'
    };

    onSelectAddress(newAddrObj);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3>📍 Select Delivery Location</h3>
            <p className="modal-subtitle">Fastest 10-min delivery available for your area</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {!showAddNew ? (
          <div className="modal-body">
            {/* Live GPS Map Simulation Card */}
            <div className="gps-location-card">
              <div className="gps-map-preview">
                <div className="radar-pulse"></div>
                <div className="map-pin">📍</div>
              </div>
              <div className="gps-details">
                <div className="gps-head">
                  <span className="gps-badge">GPS DETECTED</span>
                  <strong>Banjara Hills Sector 4</strong>
                </div>
                <p>
                  Road No 12, Banjara Hills, Hyderabad, Telangana
                  {userLocation && (
                    <span className="gps-coordinates">
                      Coordinates: {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}
                    </span>
                  )}
                </p>
                <button
                  className="deliver-here-btn"
                  onClick={() => {
                    onSelectAddress({
                      id: 'gps_' + Date.now(),
                      label: 'Current Location (GPS)',
                      tag: 'GPS',
                      line1: 'Banjara Hills Sector 4',
                      line2: 'Road No 12, Banjara Hills, Hyderabad',
                      pincode: '500034'
                    });
                    onClose();
                  }}
                >
                  Deliver to this current location ➔
                </button>
              </div>
            </div>

            <div className="section-divider-label">
              <span>OR CHOOSE SAVED ADDRESS</span>
            </div>

            <div className="saved-addresses-list">
              {SAVED_ADDRESSES.map((addr) => {
                const isSelected = activeAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    className={`address-item-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onSelectAddress(addr);
                      onClose();
                    }}
                  >
                    <div className="addr-icon">
                      {addr.label === 'Home' ? '🏠' : addr.label.includes('Work') ? '🏢' : '📍'}
                    </div>
                    <div className="addr-content">
                      <div className="addr-top font-bold">
                        <span className="addr-label-text">{addr.label}</span>
                        {isSelected && <span className="selected-badge">✓ ACTIVE</span>}
                      </div>
                      <p className="addr-str">{addr.line1}, {addr.line2}</p>
                      {addr.landmark && <span className="addr-landmark">Near: {addr.landmark}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="add-new-addr-trigger" onClick={() => setShowAddNew(true)}>
              ➕ Add New Flat / Office Address
            </button>
          </div>
        ) : (
          <form className="modal-body new-addr-form" onSubmit={handleAddNewSubmit}>
            <div className="form-group">
              <label>Address Type / Label</label>
              <div className="label-pills">
                {['Home 🏠', 'Office 🏢', 'Friends 👥', 'Other 📍'].map((lbl) => {
                  const rawName = lbl.split(' ')[0];
                  return (
                    <button
                      type="button"
                      key={rawName}
                      className={`pill-btn ${newLabel === rawName ? 'active' : ''}`}
                      onClick={() => setNewLabel(rawName)}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Flat / House No / Building Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Flat 301, Royal Residency"
                value={newLine1}
                onChange={(e) => setNewLine1(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Street / Area / Sector *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jubilee Hills Road No 36"
                value={newLine2}
                onChange={(e) => setNewLine2(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Nearby Landmark (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Behind Metro Station"
                value={newLandmark}
                onChange={(e) => setNewLandmark(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddNew(false)}>
                Back
              </button>
              <button type="submit" className="btn-primary">
                Save & Deliver Here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
