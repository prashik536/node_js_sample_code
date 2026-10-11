import React, { useState } from 'react';

export default function CheckoutRedirectModal({
  isOpen,
  onClose,
  cart,
  grandTotal,
  activeAddress,
  onPaymentSuccess
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'wallet', 'cod'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [vpaInput, setVpaInput] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectStep, setRedirectStep] = useState(1);

  if (!isOpen) return null;

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsRedirecting(true);
    setRedirectStep(1);

    // Simulate 3-step payment gateway redirection sequence
    setTimeout(() => {
      setRedirectStep(2); // Authenticating Bank
    }, 1200);

    setTimeout(() => {
      setRedirectStep(3); // Payment Confirmed & Redirecting
    }, 2600);

    setTimeout(() => {
      setIsRedirecting(false);
      onPaymentSuccess({
        paymentMethod: selectedMethod,
        totalPaid: grandTotal,
        transactionId: 'ZPT_' + Math.floor(100000000 + Math.random() * 900000000)
      });
    }, 3800);
  };

  const formatCardNumberInput = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    return parts ? parts.join(' ') : '';
  };

  return (
    <div className="modal-backdrop checkout-modal-backdrop">
      <div className="checkout-redirect-container">
        {/* Top Header */}
        <div className="checkout-top-header">
          <div className="checkout-brand">
            <span className="zepto-mini-logo">Z</span>
            <div>
              <h3>Kiranawala Express Checkout</h3>
              <small className="secure-badge">🔒 256-bit Encrypted Payment Gateway</small>
            </div>
          </div>
          <button className="close-checkout-btn" onClick={onClose} disabled={isRedirecting}>✕</button>
        </div>

        {/* Content Body */}
        <div className="checkout-content-grid">
          {/* Left Column: Payment Options */}
          <div className="payment-options-col">
            <h4 className="options-title">Select Payment Method</h4>

            <div className="payment-method-nav">
              <button
                className={`nav-tab ${selectedMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('upi')}
              >
                <span className="tab-icon">📱</span>
                <span>UPI (GPay / PhonePe)</span>
                <span className="fast-tag">Instant</span>
              </button>

              <button
                className={`nav-tab ${selectedMethod === 'card' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('card')}
              >
                <span className="tab-icon">💳</span>
                <span>Credit / Debit Card</span>
              </button>

              <button
                className={`nav-tab ${selectedMethod === 'netbanking' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('netbanking')}
              >
                <span className="tab-icon">🏛️</span>
                <span>Net Banking</span>
              </button>

              <button
                className={`nav-tab ${selectedMethod === 'wallet' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('wallet')}
              >
                <span className="tab-icon">👛</span>
                <span>Wallets & Pay Later</span>
              </button>

              <button
                className={`nav-tab ${selectedMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('cod')}
              >
                <span className="tab-icon">💵</span>
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* Selected Method Details Form */}
            <div className="payment-details-box">
              {/* UPI METHOD */}
              {selectedMethod === 'upi' && (
                <div className="upi-payment-panel">
                  <p className="panel-subtitle">Choose your preferred UPI application or enter VPA ID</p>

                  <div className="upi-apps-grid">
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🔵', bg: '#e8f0fe' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣', bg: '#f3e5f5' },
                      { id: 'paytm', name: 'Paytm UPI', icon: '🔷', bg: '#e1f5fe' },
                      { id: 'cred', name: 'CRED UPI', icon: '⚫', bg: '#eeeeee' }
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        className={`upi-app-card ${selectedUpiApp === app.id ? 'active' : ''}`}
                        onClick={() => setSelectedUpiApp(app.id)}
                      >
                        <span className="app-icon">{app.icon}</span>
                        <span className="app-name">{app.name}</span>
                        {selectedUpiApp === app.id && <span className="check-mark">✓</span>}
                      </button>
                    ))}
                  </div>

                  <div className="vpa-divider"><span>OR ENTER UPI ID</span></div>

                  <div className="vpa-input-group">
                    <input
                      type="text"
                      placeholder="e.g. username@upi or mobile@paytm"
                      value={vpaInput}
                      onChange={(e) => setVpaInput(e.target.value)}
                    />
                    <span className="vpa-verified-tag">VERIFIED</span>
                  </div>

                  {/* QR Code Scan Simulator */}
                  <div className="qr-scan-box">
                    <div className="qr-placeholder">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=zepto@icici&pn=ZeptoDelivery&am=${grandTotal}`}
                        alt="UPI QR Code"
                      />
                    </div>
                    <div className="qr-info">
                      <strong>Scan & Pay with Any UPI App</strong>
                      <p>Open GPay, PhonePe, Paytm or BHIM to scan this QR code directly.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD METHOD */}
              {selectedMethod === 'card' && (
                <div className="card-payment-panel">
                  {/* Virtual Card Preview */}
                  <div className="virtual-card-preview">
                    <div className="card-chip">💳</div>
                    <div className="card-num-display">{cardNumber || '•••• •••• •••• ••••'}</div>
                    <div className="card-bottom-row">
                      <div>
                        <small>CARD HOLDER</small>
                        <span>{cardName.toUpperCase() || 'YOUR NAME'}</span>
                      </div>
                      <div>
                        <small>EXPIRES</small>
                        <span>{cardExp || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8912"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumberInput(e.target.value))}
                      maxLength={19}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV / CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name on Credit / Debit card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* NET BANKING */}
              {selectedMethod === 'netbanking' && (
                <div className="netbanking-panel">
                  <p className="panel-subtitle">Select your Bank for Net Banking Authentication</p>
                  <div className="banks-grid">
                    {[
                      { id: 'HDFC', name: 'HDFC Bank', logo: '🏦' },
                      { id: 'ICICI', name: 'ICICI Bank', logo: '🏦' },
                      { id: 'SBI', name: 'State Bank of India', logo: '🏦' },
                      { id: 'AXIS', name: 'Axis Bank', logo: '🏦' },
                      { id: 'KOTAK', name: 'Kotak Mahindra', logo: '🏦' }
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        className={`bank-card ${selectedBank === b.id ? 'active' : ''}`}
                        onClick={() => setSelectedBank(b.id)}
                      >
                        <span className="bank-logo">{b.logo}</span>
                        <span className="bank-name">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* WALLET / PAY LATER */}
              {selectedMethod === 'wallet' && (
                <div className="wallet-panel">
                  <div className="wallet-options-list">
                    <label className="wallet-option-item">
                      <input type="radio" name="wallet" defaultChecked />
                      <div className="wallet-info">
                        <strong>Simpl Pay Later</strong>
                        <p>1-Click Payment. Pay next month in 1 bill.</p>
                      </div>
                    </label>
                    <label className="wallet-option-item">
                      <input type="radio" name="wallet" />
                      <div className="wallet-info">
                        <strong>Paytm Wallet</strong>
                        <p>Instant checkout using your Paytm balance.</p>
                      </div>
                    </label>
                    <label className="wallet-option-item">
                      <input type="radio" name="wallet" />
                      <div className="wallet-info">
                        <strong>LazyPay</strong>
                        <p>Buy now, pay in 15 days.</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* CASH ON DELIVERY */}
              {selectedMethod === 'cod' && (
                <div className="cod-panel">
                  <div className="cod-notice">
                    <span className="cod-icon">💵</span>
                    <div>
                      <strong>Pay Cash or UPI to Rider on Arrival</strong>
                      <p>Riders carry QR code scanners for easy UPI payment at doorstep.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="order-summary-col">
            <div className="summary-card">
              <h4>Order Summary</h4>
              <div className="delivery-loc-snippet">
                <span>📍 Delivering to:</span>
                <strong>{activeAddress.label} - {activeAddress.line1}</strong>
              </div>

              <div className="items-mini-preview">
                {cart.map((item) => (
                  <div key={item.id} className="item-mini-row">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="total-pay-row">
                <span>Total Amount Payable</span>
                <strong className="payable-amt">₹{grandTotal}</strong>
              </div>

              <button
                className="pay-now-submit-btn"
                onClick={handleProcessPayment}
                disabled={isRedirecting}
              >
                {isRedirecting ? (
                  <span className="spinner-text">Processing Payment...</span>
                ) : (
                  <>
                    <span>Pay ₹{grandTotal} & Place Order</span>
                    <span className="btn-arrow">➔</span>
                  </>
                )}
              </button>

              <div className="money-guarantee-note">
                ⚡ 100% Refund Guarantee if delivery is delayed beyond 15 mins.
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Payment Redirection Screen Overlay */}
        {isRedirecting && (
          <div className="payment-redirect-overlay">
            <div className="redirect-card">
              <div className="bank-spinner-ring">
                <div className="spin-inner"></div>
                <span className="zepto-icon-inside">Z</span>
              </div>

              {redirectStep === 1 && (
                <>
                  <h3>Redirecting to Payment Gateway...</h3>
                  <p>Connecting securely to payment server. Please do not refresh or close.</p>
                </>
              )}

              {redirectStep === 2 && (
                <>
                  <h3>Authenticating Transaction...</h3>
                  <p>Verifying payment with Bank / UPI network...</p>
                </>
              )}

              {redirectStep === 3 && (
                <>
                  <div className="payment-success-checkmark">✓</div>
                  <h3 className="success-txt">Payment Successful!</h3>
                  <p>Order placed successfully at Dark Store #402. Redirecting to live delivery tracking...</p>
                </>
              )}

              <div className="redirect-step-dots">
                <span className={`dot ${redirectStep >= 1 ? 'active' : ''}`}></span>
                <span className={`dot ${redirectStep >= 2 ? 'active' : ''}`}></span>
                <span className={`dot ${redirectStep >= 3 ? 'active' : ''}`}></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
