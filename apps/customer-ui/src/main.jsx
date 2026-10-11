import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import './profile-orders-styles.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';
import OrdersPage from './components/OrdersPage';
import SettingsPage from './components/SettingsPage';

import { PRODUCTS, SAVED_ADDRESSES } from './data/mockData';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import AddressModal from './components/AddressModal';
import CheckoutRedirectModal from './components/CheckoutRedirectModal';
import PostCheckoutHub from './components/PostCheckoutHub';
import NotificationToast from './components/NotificationToast';

function ZeptoApp({ user, onLogout, onOrderPlaced }) {
  // Navigation & Screen View State
  const [viewState, setViewState] = useState('store'); // 'store', 'post_checkout', 'profile', 'orders', 'settings'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Order Options State
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [activeAddress, setActiveAddress] = useState(SAVED_ADDRESSES[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Cart Customization
  const [tip, setTip] = useState(20);
  const [deliveryInstruction, setDeliveryInstruction] = useState('door');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [hasZeptoPass, setHasZeptoPass] = useState(false);

  // Active Order State
  const [activeOrder, setActiveOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const handleUpdateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const itemTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  let deliveryFee = itemTotal >= 199 || hasZeptoPass ? 0 : 35;
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountAmount) couponDiscount = appliedCoupon.discountAmount;
    else if (appliedCoupon.discountPercent) {
      couponDiscount = Math.min(
        Math.round((itemTotal * appliedCoupon.discountPercent) / 100),
        appliedCoupon.maxDiscount
      );
    }
  }

  const handlingFee = itemTotal > 0 ? 5 : 0;
  const grandTotal = Math.max(0, itemTotal + deliveryFee + handlingFee + tip - couponDiscount);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Checkout Handlers
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    const newOrderObj = {
      orderId: 'ORD_' + Date.now(),
      transactionId: paymentDetails.transactionId,
      items: [...cart],
      totalPaid: paymentDetails.totalPaid,
      address: activeAddress,
      paymentMethod: paymentDetails.paymentMethod,
      orderTime: new Date().toLocaleTimeString(),
      orderDate: new Date().toLocaleDateString(),
      timeLeftFormatted: '09:59',
      status: 'delivered'
    };

    setOrders((prev) => [newOrderObj, ...prev]);
    setActiveOrder(newOrderObj);
    setIsCheckoutModalOpen(false);
    setCart([]); // Clear cart
    setViewState('post_checkout'); // Redirect to Post Checkout Hub!
    showToast('🎉 Order Placed! Dark Store is packing your order.');
    if (onOrderPlaced) onOrderPlaced(newOrderObj);
  };

  const handleAddImpulseItem = (item) => {
    if (activeOrder) {
      setActiveOrder((prev) => ({
        ...prev,
        items: [...prev.items, { ...item, quantity: 1 }],
        totalPaid: prev.totalPaid + item.price
      }));
    }
    showToast(`⚡ Added ${item.name} to ongoing 10-min delivery!`);
  };

  const handleJoinZeptoPass = () => {
    setHasZeptoPass(true);
    showToast('⚡ Welcome to Zepto Pass! Free Delivery Unlocked for 30 Days.');
  };

  return (
    <div className="zepto-app-shell">
      {/* Toast Popup Notification */}
      <NotificationToast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Top Main Navigation Header */}
      <Header
        onHomeClick={() => setViewState('store')}
        activeAddress={activeAddress}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        cartTotal={grandTotal}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        activeOrder={activeOrder}
        onViewActiveOrder={() => setViewState('post_checkout')}
        user={user}
        onProfileClick={(page) => setViewState(page || 'profile')}
        onLogout={onLogout}
      />

      {/* Main View Switcher */}
      {viewState === 'store' ? (
        <main className="zepto-main-content">
          {/* Hero Promo Banner Carousel */}
          <section className="hero-banner-card">
            <div className="hero-left">
              <span className="hero-badge">⚡ KIRANAWALA 10-MIN EXPRESS</span>
              <h2>Groceries, Fresh Fruits & Snacks Delivered in 10 Mins</h2>
              <p>Direct from neighborhood dark store #402. Guaranteed 100% fresh or instant refund.</p>
              <div className="hero-perks font-bold">
                <span>✓ Zero Surge Fee</span>
                <span>✓ 5000+ Fresh Products</span>
                <span>✓ Cold-Chain Drinks</span>
              </div>
            </div>
            <div className="hero-right-graphic">
              <div className="hero-speed-circle">
                <span className="speed-num">10</span>
                <span className="speed-unit">MINS</span>
              </div>
            </div>
          </section>

          {/* Category Navigation Pills */}
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Product Grid */}
          <section className="products-section-wrap">
            <div className="section-header-title">
              <h3>
                {selectedCategory === 'all'
                  ? 'Trending Daily Essentials'
                  : selectedCategory}
              </h3>
              <span className="count-tag">{filteredProducts.length} items</span>
            </div>

            <ProductGrid
              products={filteredProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </section>
        </main>
      ) : viewState === 'post_checkout' ? (
        /* POST CHECKOUT HUB VIEW */
        <PostCheckoutHub
          activeOrder={activeOrder}
          onAddImpulseItem={handleAddImpulseItem}
          onToggleWhatsApp={(enabled) =>
            showToast(enabled ? '💬 WhatsApp Updates Enabled' : 'WhatsApp Updates Disabled')
          }
          onJoinZeptoPass={handleJoinZeptoPass}
          hasZeptoPass={hasZeptoPass}
          onRateOrder={(stars) => showToast(`⭐ Thank you for rating ${stars} Stars!`)}
          onBackToShopping={() => setViewState('store')}
        />
      ) : viewState === 'profile' ? (
        <ProfilePage 
          user={user}
          onLogout={onLogout}
          onBack={() => setViewState('store')}
          onSettingsClick={() => setViewState('settings')}
        />
      ) : viewState === 'orders' ? (
        <OrdersPage 
          orders={orders}
          onBack={() => setViewState('store')}
          onReorder={(order) => {
            // Add all items from the order back to cart
            order.items.forEach(item => {
              for (let i = 0; i < item.quantity; i++) {
                handleAddToCart(item);
              }
            });
            setViewState('store');
            showToast(`Reordered ${order.items.length} item(s)`);
          }}
        />
      ) : viewState === 'settings' ? (
        <SettingsPage onBack={() => setViewState('profile')} />
      ) : null}

      {/* Sticky Bottom Mini Cart Bar (When Cart Has Items & User is in Store View) */}
      {viewState === 'store' && cartCount > 0 && (
        <div className="floating-bottom-cart-bar">
          <div className="bar-left-info">
            <div className="cart-items-count font-bold">{cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'}</div>
            <div className="cart-bar-total">₹{grandTotal} <small>+ Taxes & Charges</small></div>
          </div>
          <button className="bar-view-cart-btn" onClick={() => setIsCartOpen(true)}>
            <span>View Cart</span>
            <span className="bar-arrow">➔</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        activeAddress={activeAddress}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        tip={tip}
        onSelectTip={setTip}
        deliveryInstruction={deliveryInstruction}
        onSelectInstruction={setDeliveryInstruction}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(c) => {
          setAppliedCoupon(c);
          showToast(`Coupon ${c.code} Applied Successfully!`);
        }}
        onRemoveCoupon={() => {
          setAppliedCoupon(null);
          showToast('Coupon Removed');
        }}
        hasZeptoPass={hasZeptoPass}
        onToggleZeptoPass={() => setHasZeptoPass(!hasZeptoPass)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <AddressModal
          activeAddress={activeAddress}
          userLocation={user.location}
          onSelectAddress={(addr) => {
            setActiveAddress(addr);
            showToast(`Delivery location updated to ${addr.label}`);
          }}
          onClose={() => setIsAddressModalOpen(false)}
        />
      )}

      {/* Dedicated Checkout Redirect Modal / Payment Gateway */}
      <CheckoutRedirectModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        grandTotal={grandTotal}
        activeAddress={activeAddress}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [userLocation, setUserLocation] = useState(null);

  // Get device location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          console.log('Location detected:', { latitude, longitude });
          // Optionally fetch address from coordinates using reverse geocoding
        },
        (error) => {
          console.log('Location access denied or unavailable:', error);
        }
      );
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser({ ...user, location: userLocation });
    setAuthMode('login');
  };

  const handleSignup = (user) => {
    setCurrentUser({ ...user, location: userLocation });
    setAuthMode('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
    setAuthMode('login');
  };

  if (!currentUser) {
    return authMode === 'login' ? (
      <LoginPage
        onLogin={handleLogin}
        onGuestLogin={() => setCurrentUser({ name: 'Guest', email: '', role: 'customer', location: userLocation })}
        onSignupClick={() => setAuthMode('signup')}
      />
    ) : (
      <SignupPage
        onSignup={handleSignup}
        onBackToLogin={() => setAuthMode('login')}
      />
    );
  }

  return <ZeptoApp user={currentUser} onLogout={handleLogout} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
