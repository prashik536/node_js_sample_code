import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import AdminLogin from './AdminLogin';

const INITIAL_ORDERS = [
  {
    id: 'ZPT_98472918',
    customer: 'Prashanth Kumar',
    phone: '+91 98765 43210',
    address: 'Flat 402, Signature Heights, Banjara Hills, Hyderabad',
    time: '12:35 AM',
    items: [
      { name: 'Alphonso Mango (Ratnagiri)', qty: 1, price: 249 },
      { name: 'Coca-Cola Can 300ml', qty: 2, price: 40 }
    ],
    total: 329,
    status: 'pending' // 'pending', 'packing', 'out_for_delivery', 'delivered', 'cancelled'
  },
  {
    id: 'ZPT_12894738',
    customer: 'Amit Sharma',
    phone: '+91 99887 76655',
    address: 'Apt 6B, Cyber Tech Towers, HITEC City, Hyderabad',
    time: '12:20 AM',
    items: [
      { name: 'Modern Wheat Bread 400g', qty: 1, price: 45 },
      { name: 'Amul Pasteurised Butter 100g', qty: 1, price: 58 },
      { name: 'Amul Milk 1L', qty: 3, price: 54 }
    ],
    total: 265,
    status: 'packing'
  },
  {
    id: 'ZPT_65893049',
    customer: 'Divya Reddy',
    phone: '+91 91234 56789',
    address: 'Plot 48, Road No 5, Jubilee Hills, Hyderabad',
    time: '12:02 AM',
    items: [
      { name: "Lay's India Magic Masala", qty: 4, price: 50 },
      { name: 'Real Mango Juice 1L', qty: 1, price: 110 }
    ],
    total: 310,
    status: 'out_for_delivery'
  },
  {
    id: 'ZPT_88493021',
    customer: 'Siddharth Rao',
    phone: '+91 94401 23456',
    address: 'Flat 101, Oakwood Residency, Gachibowli, Hyderabad',
    time: '11:45 PM',
    items: [
      { name: 'Maggi Noodles Pack of 4', qty: 2, price: 56 },
      { name: 'Doritos Cheese Chips 82.5g', qty: 1, price: 50 }
    ],
    total: 162,
    status: 'delivered'
  }
];

function App() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Status transitions
  const handleUpdateStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );

    // If order is expanded, update its preview too
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: nextStatus }));
    }

    const readableStatus = nextStatus.replace(/_/g, ' ').toUpperCase();
    showToast(`Order #${orderId} marked as ${readableStatus}`);
  };

  // Derive operations metrics
  const stats = useMemo(() => {
    const liveOrdersCount = orders.filter((o) => ['pending', 'packing', 'out_for_delivery'].includes(o.status)).length;
    const completedOrders = orders.filter((o) => o.status === 'delivered');
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

    // Total sales
    const totalSales = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    // average order total
    const avgOrderVal = orders.length > 0 ? Math.round(totalSales / (orders.length - cancelledOrders.length || 1)) : 0;

    return {
      live: liveOrdersCount,
      totalSales,
      avg: avgOrderVal,
      completed: completedOrders.length,
      cancelled: cancelledOrders.length
    };
  }, [orders]);

  const handleDownloadReport = () => {
    showToast('📈 Operations CSV Report downloaded successfully!');
    setIsReportOpen(false);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending payment';
      case 'packing': return 'Preparing / Packing';
      case 'out_for_delivery': return 'Out for delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="page">
      {/* Top Header */}
      <header className="header">
        <div>
          <span className="eyebrow">Operations Control</span>
          <h1>Admin Console</h1>
        </div>
        <button className="primary" onClick={() => setIsReportOpen(true)}>
          Generate Report
        </button>
      </header>

      {/* Stats indicators grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Sales</span>
          <strong>₹{stats.totalSales}</strong>
        </div>
        <div className="stat-card">
          <span>Avg. Order Val</span>
          <strong>₹{stats.avg}</strong>
        </div>
        <div className="stat-card">
          <span>Delivery SLA</span>
          <strong>96%</strong>
        </div>
        <div className="stat-card">
          <span>Live Orders</span>
          <strong style={{ color: stats.live > 0 ? 'var(--primary)' : 'var(--dark)' }}>
            {stats.live}
          </strong>
        </div>
      </section>

      {/* Orders Queue section */}
      <section className="panel">
        <h2>Live Orders Queue ({orders.length} Orders)</h2>
        <ul style={{ display: 'flex', flexDirection: 'column' }}>
          {orders.map((order) => (
            <li key={order.id} onClick={() => setSelectedOrder(order)} title="Click to view details">
              <div>
                <span style={{ fontSize: '0.98rem', fontWeight: 800 }}>Order #{order.id}</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>
                  Ordered by <strong>{order.customer}</strong> • {order.items.length} items • ₹{order.total} • {order.time}
                </div>
              </div>
              <strong className={`status-${order.status}`}>
                {getStatusLabel(order.status)}
              </strong>
            </li>
          ))}
        </ul>
      </section>

      {/* Dynamic Toast feedback banner */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--dark)',
            color: 'white',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            boxShadow: 'var(--shadow)',
            zIndex: 1000
          }}
        >
          ⚡ {toastMsg}
        </div>
      )}

      {/* ORDER DETAILS PANEL MODAL */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 Order #{selectedOrder.id}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body order-details-layout">
              <div className="detail-section">
                <h4>Customer Info</h4>
                <p><strong>{selectedOrder.customer}</strong> ({selectedOrder.phone})</p>
                <p style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--muted)' }}>{selectedOrder.address}</p>
              </div>

              <div className="detail-section">
                <h4>Order Details ({selectedOrder.time})</h4>
                <div className="items-summary-list">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="item-summary-row">
                      <span>{item.qty}x {item.name}</span>
                      <span>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="detail-total-row">
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{selectedOrder.total}</span>
                </div>
              </div>

              {/* Status control buttons panel */}
              <div className="detail-section status-actions-container">
                <h4>Operational Status Controls</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '8px' }}>
                  Current status: <strong className={`status-${selectedOrder.status}`} style={{ padding: '2px 8px', borderRadius: '10px' }}>{getStatusLabel(selectedOrder.status)}</strong>
                </div>
                <div className="status-action-btns-row">
                  <button
                    className="status-pending"
                    disabled={selectedOrder.status === 'pending'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                  >
                    Pending
                  </button>
                  <button
                    className="status-packing"
                    disabled={selectedOrder.status === 'packing'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'packing')}
                  >
                    Pack Order
                  </button>
                  <button
                    className="status-out_for_delivery"
                    disabled={selectedOrder.status === 'out_for_delivery'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'out_for_delivery')}
                  >
                    Send Courier
                  </button>
                  <button
                    className="status-delivered"
                    style={{ backgroundColor: 'var(--success)', color: 'white' }}
                    disabled={selectedOrder.status === 'delivered'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                  >
                    Mark Delivered
                  </button>
                  <button
                    className="status-cancelled"
                    style={{ backgroundColor: 'var(--danger)', color: 'white' }}
                    disabled={selectedOrder.status === 'cancelled'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OPERATIONS REPORT GENERATOR MODAL */}
      {isReportOpen && (
        <div className="modal-backdrop" onClick={() => setIsReportOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📈 Operation Analytics Report</h3>
              <button className="modal-close-btn" onClick={() => setIsReportOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="report-summary-stats">
                <div className="mini-stat-box">
                  <span>Gross Sales</span>
                  <strong>₹{stats.totalSales}</strong>
                </div>
                <div className="mini-stat-box">
                  <span>Fulfilled</span>
                  <strong>{stats.completed} Orders</strong>
                </div>
                <div className="mini-stat-box">
                  <span>Cancelled</span>
                  <strong>{stats.cancelled} Orders</strong>
                </div>
                <div className="mini-stat-box" style={{ backgroundColor: 'var(--success-light)' }}>
                  <span>SLA Met</span>
                  <strong style={{ color: 'var(--success)' }}>96.4%</strong>
                </div>
              </div>

              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '14px 0 8px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Category Volume Breakdown
              </h4>
              <table className="report-table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Category</th>
                    <th style={{ textAlign: 'center', padding: '6px' }}>Volume</th>
                    <th style={{ textAlign: 'right', padding: '6px' }}>Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px' }}>Seasonal Fruits</td>
                    <td style={{ textAlign: 'center', padding: '6px' }}>34%</td>
                    <td style={{ textAlign: 'right', padding: '6px' }}>₹1,450</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px' }}>Dairy & Bakery</td>
                    <td style={{ textAlign: 'center', padding: '6px' }}>28%</td>
                    <td style={{ textAlign: 'right', padding: '6px' }}>₹1,180</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px' }}>Snacks & Munchies</td>
                    <td style={{ textAlign: 'center', padding: '6px' }}>22%</td>
                    <td style={{ textAlign: 'right', padding: '6px' }}>₹920</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px' }}>Drinks & Juices</td>
                    <td style={{ textAlign: 'center', padding: '6px' }}>16%</td>
                    <td style={{ textAlign: 'right', padding: '6px' }}>₹650</td>
                  </tr>
                </tbody>
              </table>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setIsReportOpen(false)}>
                  Close
                </button>
                <button className="btn-primary" onClick={handleDownloadReport}>
                  Download CSV Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthGate() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <AdminLogin onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <>
      {/* Sticky admin top bar */}
      <div className="aauth-topbar">
        <span className="aauth-topbar-brand">zepto</span>
        <div className="aauth-topbar-center">
          <span className="aauth-topbar-user">{currentUser.name}</span>
          <span className="aauth-topbar-role">{currentUser.role}</span>
        </div>
        <button
          className="aauth-topbar-logout"
          onClick={() => setCurrentUser(null)}
        >
          Logout
        </button>
      </div>

      {/* Existing admin app — untouched */}
      <App />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthGate />
  </React.StrictMode>
);
