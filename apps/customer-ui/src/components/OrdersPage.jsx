import React from 'react';

export default function OrdersPage({ orders, onBack, onReorder }) {
  return (
    <div className="orders-page">
      <div className="orders-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>My Orders</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="orders-content">
        {orders && orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <div>
                    <h4>{order.orderId}</h4>
                    <p className="order-date">{order.orderDate || 'Today'}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.status || 'delivered'}`}>
                      {order.status === 'delivered' ? '✓ Delivered' : order.status || 'Completed'}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <p className="items-count">{order.items.length} item(s)</p>
                  <div className="items-preview">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="item-preview">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="more-items">+{order.items.length - 3} more</p>
                    )}
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span className="label">Total Paid</span>
                    <span className="amount">₹{order.totalPaid}</span>
                  </div>
                  <button className="btn-reorder" onClick={() => onReorder(order)}>
                    🔄 Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No Orders Yet</h3>
            <p>Start shopping to see your orders here</p>
            <button className="btn-shop" onClick={onBack}>
              🛒 Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
