import React, { useState, useEffect } from 'react';
import { POST_CHECKOUT_ADDONS } from '../data/mockData';

export default function PostCheckoutHub({
  activeOrder,
  onAddImpulseItem,
  onToggleWhatsApp,
  onJoinZeptoPass,
  hasZeptoPass,
  onRateOrder,
  onBackToShopping
}) {
  // Countdown timer state
  const [secondsRemaining, setSecondsRemaining] = useState(599); // 9 mins 59 secs
  const [scratchProgress, setScratchProgress] = useState(0); // 0 to 100
  const [isScratched, setIsScratched] = useState(false);
  const [addedAddons, setAddedAddons] = useState([]);
  const [whatsAppOptIn, setWhatsAppOptIn] = useState(true);
  const [userRating, setUserRating] = useState(5);
  const [rated, setRated] = useState(false);

  // Live timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine order stage based on timer
  // 599-480: Stage 1 (Packing)
  // 479-300: Stage 2 (Rider Picked Up)
  // 299-1: Stage 3 (On the way)
  // 0: Stage 4 (Delivered)
  let orderStage = 1;
  if (secondsRemaining < 480 && secondsRemaining >= 300) orderStage = 2;
  else if (secondsRemaining < 300 && secondsRemaining > 0) orderStage = 3;
  else if (secondsRemaining === 0) orderStage = 4;

  const handleScratch = () => {
    setIsScratched(true);
  };

  const handleAddImpulse = (item) => {
    if (addedAddons.includes(item.id)) return;
    setAddedAddons([...addedAddons, item.id]);
    onAddImpulseItem(item);
  };

  const handleWhatsAppToggle = () => {
    const nextVal = !whatsAppOptIn;
    setWhatsAppOptIn(nextVal);
    onToggleWhatsApp(nextVal);
  };

  return (
    <div className="post-checkout-page">
      {/* Top Banner Header */}
      <div className="tracker-hero-card">
        <div className="tracker-hero-top">
          <div className="delivery-time-big font-bold">
            <span className="live-pulse-dot"></span>
            {secondsRemaining > 0 ? (
              <>
                <span className="timer-title">Arriving in</span>
                <span className="timer-clock">{formatTimer(secondsRemaining)}</span>
                <span className="mins-label">MINS</span>
              </>
            ) : (
              <span className="delivered-title">🎉 ORDER DELIVERED!</span>
            )}
          </div>
          <div className="order-id-badge">
            Order #{activeOrder?.transactionId || 'ZPT_98472918'}
          </div>
        </div>

        {/* Live Stepper */}
        <div className="order-stepper">
          <div className={`step-item ${orderStage >= 1 ? 'completed' : ''} ${orderStage === 1 ? 'active' : ''}`}>
            <div className="step-circle">{orderStage > 1 ? '✓' : '1'}</div>
            <span>Confirmed</span>
          </div>
          <div className="step-line font-bold"></div>

          <div className={`step-item ${orderStage >= 2 ? 'completed' : ''} ${orderStage === 2 ? 'active' : ''}`}>
            <div className="step-circle">{orderStage > 2 ? '✓' : '2'}</div>
            <span>Packing</span>
          </div>
          <div className="step-line"></div>

          <div className={`step-item ${orderStage >= 3 ? 'completed' : ''} ${orderStage === 3 ? 'active' : ''}`}>
            <div className="step-circle">{orderStage > 3 ? '✓' : '3'}</div>
            <span>On the Way</span>
          </div>
          <div className="step-line"></div>

          <div className={`step-item ${orderStage >= 4 ? 'completed' : ''} ${orderStage === 4 ? 'active' : ''}`}>
            <div className="step-circle">4</div>
            <span>Delivered</span>
          </div>
        </div>

        {/* Interactive Live Map Tracker Canvas / Animated Route */}
        <div className="live-map-wrapper">
          <div className="map-grid-bg"></div>

          <div className="map-route-line">
            {/* Animated Rider Vehicle Icon along route */}
            <div
              className="map-rider-pin"
              style={{
                left: orderStage === 1 ? '15%' : orderStage === 2 ? '40%' : orderStage === 3 ? '75%' : '94%'
              }}
            >
              <div className="rider-avatar">🛵</div>
              <div className="rider-pulse"></div>
            </div>
          </div>

          <div className="map-nodes">
            <div className="map-node darkstore-node">
              <span className="node-icon">🏭</span>
              <span className="node-label">Dark Store #402</span>
            </div>
            <div className="map-node customer-node">
              <span className="node-icon">🏡</span>
              <span className="node-label">{activeOrder?.address?.label || 'Home'}</span>
            </div>
          </div>
        </div>

        {/* Rider Info Box */}
        <div className="rider-info-card">
          <div className="rider-profile">
            <div className="rider-img-wrap">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Rider" />
              <span className="electric-badge">⚡ TVS iQube</span>
            </div>
            <div className="rider-text">
              <strong>Ramesh Kumar</strong>
              <div className="rider-rating">★ 4.9 <small>(1,420 deliveries)</small></div>
              <p className="rider-status-str">
                {orderStage === 1 && 'Assigned to your order at Darkstore.'}
                {orderStage === 2 && 'Packing fresh items into thermal bag.'}
                {orderStage === 3 && 'On electric scooter. Speeding to your home!'}
                {orderStage === 4 && 'Handed over order at doorstep.'}
              </p>
            </div>
          </div>
          <div className="rider-actions">
            <button className="rider-btn call-btn" onClick={() => alert('Dialing Rider: Ramesh Kumar (+91 98765 01234)')}>
              📞 Call Rider
            </button>
            <button className="rider-btn msg-btn" onClick={() => alert('Sending chat message to Rider...')}>
              💬 Message
            </button>
          </div>
        </div>
      </div>

      {/* POST OPT-INS SECTION GRID */}
      <div className="post-optins-grid">
        {/* POST OPT-IN 1: INTERACTIVE SCRATCH CARD / CASHBACK */}
        <div className="optin-card scratch-card-optin">
          <div className="card-badge-top">🎁 POST-CHECKOUT REWARD</div>
          <h3>Scratch & Win Cashback</h3>
          <p>You unlocked a mystery reward for placing this order!</p>

          <div className="scratch-canvas-container">
            {!isScratched ? (
              <div className="scratch-cover" onClick={handleScratch}>
                <div className="scratch-pattern"></div>
                <div className="scratch-prompt font-bold">
                  <span>✨ TAP TO SCRATCH CARD ✨</span>
                  <small>Reveal your secret reward</small>
                </div>
              </div>
            ) : null}

            <div className="scratch-reward-content">
              <div className="confe-stars">🎉 🌟 ✨</div>
              <strong className="reward-heading">YOU WON ₹50 ZEPTO CASH!</strong>
              <p>Credited to your Zepto Pay balance for your next 10-minute order.</p>
              <div className="reward-coupon-code">CODE: <strong>WIN50CASH</strong></div>
            </div>
          </div>
        </div>

        {/* POST OPT-IN 2: IMPULSE FAST ADD-ONS (Add within 60s) */}
        <div className="optin-card impulse-addons-optin">
          <div className="card-badge-top fast-add-tag">⚡ 60s FAST ADD</div>
          <h3>Forgot Something? Add Now!</h3>
          <p>Rider is still at dark store! Add these in 1-click for <strong>FREE delivery</strong> in same bag.</p>

          <div className="impulse-items-list">
            {POST_CHECKOUT_ADDONS.map((addon) => {
              const isAdded = addedAddons.includes(addon.id);
              return (
                <div key={addon.id} className="impulse-item-card">
                  <img src={addon.image} alt={addon.name} />
                  <div className="impulse-info">
                    <strong>{addon.name}</strong>
                    <small>{addon.unit}</small>
                    <div className="addon-price">₹{addon.price}</div>
                  </div>
                  <button
                    className={`add-impulse-btn ${isAdded ? 'added' : ''}`}
                    onClick={() => handleAddImpulse(addon)}
                  >
                    {isAdded ? '✓ ADDED TO BAG' : '+ ADD ₹' + addon.price}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* POST OPT-IN 3: ZEPTO PASS SUBSCRIPTION */}
        <div className="optin-card zepto-pass-optin">
          <div className="pass-banner-header">
            <span className="pass-logo-bold">zepto pass</span>
            <span className="pass-save-badge">SAVE ₹500/MO</span>
          </div>
          <h3>Join Zepto Pass VIP</h3>
          <p>Get Unlimited FREE Delivery on all orders above ₹99 + 10% Extra Discount!</p>
          <div className="pass-pricing-row">
            <div className="strike-price"><s>₹99/mo</s></div>
            <div className="active-pass-price">₹19 <span>/ 1st Month</span></div>
          </div>

          <button
            className={`join-pass-btn ${hasZeptoPass ? 'joined' : ''}`}
            onClick={() => onJoinZeptoPass()}
          >
            {hasZeptoPass ? '✓ ZEPTO PASS VIP ACTIVE' : '⚡ JOIN ZEPTO PASS FOR ₹19'}
          </button>
        </div>

        {/* POST OPT-IN 4: WHATSAPP & SMS LIVE UPDATES */}
        <div className="optin-card whatsapp-optin">
          <div className="optin-icon-head">💬</div>
          <h3>Live WhatsApp Updates</h3>
          <p>Receive real-time rider tracking links and delivery photo proof on WhatsApp.</p>

          <div className="toggle-optin-row">
            <div className="phone-preview">
              <span>📱 +91 98765 43210</span>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={whatsAppOptIn}
                onChange={handleWhatsAppToggle}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <small className="optin-footer-note">You can opt out anytime from profile settings.</small>
        </div>

        {/* POST OPT-IN 5: RATING & FEEDBACK */}
        <div className="optin-card rating-optin">
          <h3>Rate Delivery Experience</h3>
          <p>How was the dark store packing and speed?</p>

          <div className="star-rating-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${star <= userRating ? 'active' : ''}`}
                onClick={() => setUserRating(star)}
              >
                ★
              </button>
            ))}
          </div>

          {rated ? (
            <div className="rating-submitted-msg">✓ Thank you for rating Ramesh 5 Stars!</div>
          ) : (
            <button
              className="submit-rating-btn"
              onClick={() => {
                setRated(true);
                onRateOrder(userRating);
              }}
            >
              Submit Rating & Tip Rider
            </button>
          )}
        </div>
      </div>

      {/* Return to Home / Shopping Action */}
      <div className="post-checkout-footer-action">
        <button className="back-home-btn" onClick={onBackToShopping}>
          🛒 Return to Kiranawala Store
        </button>
      </div>
    </div>
  );
}
