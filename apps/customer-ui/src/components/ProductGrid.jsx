import React from 'react';

export default function ProductGrid({ products, cart, onAddToCart, onUpdateQuantity }) {
  if (products.length === 0) {
    return (
      <div className="empty-search-state">
        <div className="search-empty-icon">🔍</div>
        <h3>No matching items found</h3>
        <p>Try searching for mangoes, milk, chips or cold drinks.</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      {products.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        const qty = cartItem ? cartItem.quantity : 0;

        return (
          <div className="zepto-product-card" key={product.id}>
            {/* Top Badge */}
            <div className="product-card-top">
              <span className="delivery-speed-tag">{product.tag}</span>
              {product.discount && (
                <span className="discount-badge">{product.discount}</span>
              )}
            </div>

            {/* Product Image */}
            <div className="product-img-wrapper">
              <img src={product.image} alt={product.name} loading="lazy" />
            </div>

            {/* Info */}
            <div className="product-card-content">
              <div className="rating-row">
                <span className="star-icon">★</span>
                <span className="rating-val">{product.rating}</span>
                <span className="reviews-cnt">({product.reviews})</span>
              </div>

              <h3 className="product-title">{product.name}</h3>
              <p className="product-unit">{product.unit}</p>

              <div className="product-bottom-row">
                <div className="price-block">
                  <span className="selling-price">₹{product.price}</span>
                  {product.mrp > product.price && (
                    <span className="mrp-price">₹{product.mrp}</span>
                  )}
                </div>

                {qty > 0 ? (
                  <div className="quantity-stepper">
                    <button
                      className="step-btn minus"
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      title="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-value">{qty}</span>
                    <button
                      className="step-btn plus"
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="add-to-cart-btn"
                    onClick={() => onAddToCart(product)}
                  >
                    ADD <span className="plus-symbol">+</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
