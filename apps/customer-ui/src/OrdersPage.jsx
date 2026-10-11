import React, { useState } from 'react';

const OrdersPage = ({ onBack }) => {
  const [orders] = useState([
    {
      id: '#ORD-001',
      date: '2024-01-15',
      items: [
        { name: 'Organic Tomatoes 500g', qty: 1 },
        { name: 'Basmati Rice 1kg', qty: 2 },
      ],
      total: 299,
      status: 'Delivered',
    },
    {
      id: '#ORD-002',
      date: '2024-01-10',
      items: [
        { name: 'Fresh Milk 1L', qty: 2 },
        { name: 'Bread Loaf', qty: 1 },
        { name: 'Butter 200g', qty: 1 },
      ],
      total: 189,
      status: 'Delivered',
    },
    {
      id: '#ORD-003',
      date: '2024-01-05',
      items: [
        { name: 'Apple Juice 1L', qty: 1 },
      ],
      total: 120,
      status: 'Delivered',
    },
  ]);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>My Orders</h2>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="orders-content">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders. Start shopping now!</p>
            <button className="btn-shop" onClick={onBack}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Header */}
                <div className="order-header">
                  <div>
                    <h4>{order.id}</h4>
                    <div className="order-date">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="order-status">
                    <span className="status-badge">{order.status}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="order-items">
                  <div className="items-count">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                  <div className="items-preview">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="item-preview">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.qty}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="more-items">
                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="order-footer">
                  <div className="order-total">
                    <div className="label">Order Total</div>
                    <div className="amount">₹{order.total}</div>
                  </div>
                  <button className="btn-reorder">
                    🔄 Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
