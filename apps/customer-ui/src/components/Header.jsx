import React, { useState } from 'react';

export default function Header({
  activeAddress,
  onHomeClick,
  onOpenAddressModal,
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onToggleCart,
  activeOrder,
  onViewActiveOrder,
  user,
  onProfileClick,
  onLogout
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <header className="zepto-header">
      <div className="header-inner">
        {/* Brand & ETA logo */}
        <div className="brand-section">
          <button className="zepto-logo-badge" onClick={onHomeClick} title="Go to home" aria-label="Go to home">
            <span className="z-letter">Z</span>
            <span className="fast-flash">⚡</span>
          </button>
          <div className="brand-titles">
            <div className="eta-tag">
              <span className="pulse-dot"></span>
              <strong>10 MINS</strong>
              <small>Delivery Darkstore #402</small>
            </div>
            <h1 className="zepto-brand-text">kiranawala</h1>
          </div>
        </div>

        {/* Address Selector Pill */}
        <button className="address-pill-button" onClick={onOpenAddressModal} title="Change delivery location">
          <span className="loc-icon">📍</span>
          <div className="loc-text">
            <div className="loc-label">
              <strong>{activeAddress.label}</strong>
              <span className="chevron-down">▾</span>
            </div>
            <p className="loc-sub">{activeAddress.line1}, {activeAddress.line2}</p>
          </div>
        </button>

        {/* Search Bar */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder='Search "mangoes", "milk", "chips", "cold drinks"...'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => onSearchChange('')}>
              ✕
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="header-right-actions">
          {/* Active Order Pill if an order is in progress */}
          {activeOrder && (
            <button className="active-order-pill" onClick={onViewActiveOrder}>
              <span className="pulse-icon">🛵</span>
              <div className="active-order-text">
                <span className="order-head">Live Order</span>
                <span className="order-timer">{activeOrder.timeLeftFormatted || '9:45 remaining'}</span>
              </div>
            </button>
          )}

          {/* Cart Button */}
          <button className="zepto-cart-button" onClick={onToggleCart}>
            <div className="cart-icon-wrap">
              🛒
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </div>
            <div className="cart-button-label">
              <span className="cart-txt">{cartCount > 0 ? 'MY CART' : 'CART'}</span>
              {cartCount > 0 && <strong className="cart-amt">₹{cartTotal}</strong>}
            </div>
          </button>

          {/* User Profile Menu */}
          {user && (
            <div className="user-menu-container">
              <button 
                className="user-profile-btn" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={user.name}
              >
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="menu-header">
                    <div className="menu-user-info">
                      <div className="menu-avatar">{user.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="menu-name">{user.name}</p>
                        <p className="menu-email">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="menu-items">
                    <button 
                      className="menu-item"
                      onClick={() => {
                        onProfileClick();
                        setShowUserMenu(false);
                      }}
                    >
                      👤 My Profile
                    </button>
                    <button 
                      className="menu-item"
                      onClick={() => {
                        onProfileClick('orders');
                        setShowUserMenu(false);
                      }}
                    >
                      📦 My Orders
                    </button>
                    <button 
                      className="menu-item"
                      onClick={() => {
                        onProfileClick('settings');
                        setShowUserMenu(false);
                      }}
                    >
                      ⚙️ Settings
                    </button>
                    <button 
                      className="menu-item"
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
