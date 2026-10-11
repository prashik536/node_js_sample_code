import React, { useState } from 'react';
import { COUPONS } from '../data/mockData';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  activeAddress,
  onOpenAddressModal,
  tip,
  onSelectTip,
  deliveryInstruction,
  onSelectInstruction,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  hasZeptoPass,
  onToggleZeptoPass,
  onProceedToCheckout
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let deliveryFee = itemTotal >= 199 || hasZeptoPass ? 0 : 35;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountAmount) {
      discount = appliedCoupon.discountAmount;
    } else if (appliedCoupon.discountPercent) {
      discount = Math.min(
        Math.round((itemTotal * appliedCoupon.discountPercent) / 100),
        appliedCoupon.maxDiscount
      );
    }
  }

  const handlingFee = itemTotal > 0 ? 5 : 0;
  const grandTotal = Math.max(0, itemTotal + deliveryFee + handlingFee + tip - discount);

  const handleApplyCouponCode = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === code);
    if (!found) {
      setCouponError('Invalid coupon code. Try ZEPTO100 or FREEDEL');
      return;
    }
    if (itemTotal < found.minOrder) {
      setCouponError(`Min order value for ${found.code} is ₹${found.minOrder}`);
      return;
    }
    setCouponError('');
    onApplyCoupon(found);
    setCouponInput('');
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <aside className="zepto-cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div>
            <h2>My Cart</h2>
            <p className="delivery-time-notice">⚡ Delivering in <strong>10 Mins</strong></p>
          </div>
          <button className="cart-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Address bar inside Cart */}
        <div className="cart-address-banner" onClick={onOpenAddressModal}>
          <span className="banner-icon">📍</span>
          <div className="banner-info">
            <small>Delivering to {activeAddress.label}</small>
            <strong>{activeAddress.line1}, {activeAddress.line2}</strong>
          </div>
          <span className="banner-change">Change ➔</span>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty-view">
            <div className="empty-cart-img">🛍️</div>
            <h3>Your cart is empty</h3>
            <p>Explore our fast 10-minute grocery selection & add items!</p>
            <button className="btn-continue-shopping" onClick={onClose}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-drawer-scrollable">
            {/* Cart Items List */}
            <div className="cart-items-section">
              <h4 className="section-title font-bold">Items Added ({cart.length})</h4>
              {cart.map((item) => (
                <div className="cart-item-row" key={item.id}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h5 className="cart-item-name">{item.name}</h5>
                    <small className="cart-item-unit">{item.unit}</small>
                    <div className="cart-item-price-tag">₹{item.price}</div>
                  </div>

                  <div className="mini-stepper">
                    <button onClick={() => onUpdateQuantity(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Zepto Pass Upsell Banner */}
            <div className={`zepto-pass-banner ${hasZeptoPass ? 'active' : ''}`}>
              <div className="pass-icon">⚡</div>
              <div className="pass-text">
                <strong>zepto pass</strong>
                <p>{hasZeptoPass ? 'Pass Active! Free delivery applied.' : 'Get FREE delivery on all orders above ₹99 for ₹19/mo'}</p>
              </div>
              <button
                className="pass-toggle-btn"
                onClick={onToggleZeptoPass}
              >
                {hasZeptoPass ? 'REMOVE' : 'GET PASS ₹19'}
              </button>
            </div>

            {/* Delivery Instructions */}
            <div className="cart-section-card">
              <h4 className="card-heading">Delivery Instructions</h4>
              <div className="instructions-grid">
                {[
                  { id: 'bell', icon: '🔕', title: 'Don\'t ring bell' },
                  { id: 'door', icon: '🚪', title: 'Leave at door' },
                  { id: 'call', icon: '📞', title: 'Call on arrival' },
                  { id: 'guard', icon: '👮', title: 'Leave with guard' }
                ].map((inst) => (
                  <button
                    key={inst.id}
                    className={`instruction-btn ${deliveryInstruction === inst.id ? 'selected' : ''}`}
                    onClick={() => onSelectInstruction(inst.id === deliveryInstruction ? '' : inst.id)}
                  >
                    <span className="inst-icon">{inst.icon}</span>
                    <span className="inst-title">{inst.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Partner Tip */}
            <div className="cart-section-card">
              <div className="card-heading-row">
                <h4 className="card-heading">Tip your Delivery Partner</h4>
                <small className="tip-note">100% goes to rider</small>
              </div>
              <div className="tip-buttons-row">
                {[10, 20, 30, 50].map((amount) => (
                  <button
                    key={amount}
                    className={`tip-btn ${tip === amount ? 'selected' : ''}`}
                    onClick={() => onSelectTip(tip === amount ? 0 : amount)}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon Promo Code Box */}
            <div className="cart-section-card">
              <h4 className="card-heading">Coupons & Offers</h4>
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <div className="coupon-left">
                    <span className="tag-icon">🎟️</span>
                    <div>
                      <strong>{appliedCoupon.code} Applied</strong>
                      <p>{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button className="remove-coupon-btn" onClick={onRemoveCoupon}>
                    REMOVE
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. ZEPTO100)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                    />
                    <button
                      className="apply-code-btn"
                      onClick={() => handleApplyCouponCode()}
                    >
                      APPLY
                    </button>
                  </div>
                  {couponError && <p className="coupon-error-txt">{couponError}</p>}

                  <div className="suggested-coupons">
                    {COUPONS.map((c) => (
                      <div key={c.code} className="suggested-coupon-item" onClick={() => handleApplyCouponCode(c.code)}>
                        <span className="code-badge">{c.code}</span>
                        <span className="code-desc">{c.description}</span>
                        <span className="code-apply-link">APPLY</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bill-summary-card">
              <h4 className="card-heading">Bill Details</h4>
              <div className="bill-row">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="free-tag">FREE <s className="strike">₹35</s></span>
                ) : (
                  <span>₹{deliveryFee}</span>
                )}
              </div>
              <div className="bill-row">
                <span>Handling Charge</span>
                <span>₹{handlingFee}</span>
              </div>
              {tip > 0 && (
                <div className="bill-row">
                  <span>Delivery Tip</span>
                  <span>₹{tip}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="bill-row discount-row">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="bill-divider"></div>

              <div className="bill-row grand-total-row">
                <div>
                  <strong>To Pay</strong>
                  <small className="savings-highlight">
                    You saved ₹{(itemTotal >= 199 ? 35 : 0) + discount} on this order!
                  </small>
                </div>
                <span className="grand-total-amount">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Footer with Checkout Trigger */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="footer-price">
              <span>PAYING</span>
              <strong>₹{grandTotal}</strong>
            </div>
            <button
              className="proceed-checkout-btn"
              onClick={onProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <span className="arrow-icon">➔</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
