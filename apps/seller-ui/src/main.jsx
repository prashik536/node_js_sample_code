import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import SellerLogin from './SellerLogin';

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Alphonso Mango (Ratnagiri)', category: 'Seasonal Fruits', inventory: 44, unit: 'kg', price: 249, status: 'Active' },
  { id: 2, name: 'Robusta Bananas', category: 'Daily Fruits', inventory: 80, unit: 'dozen', price: 48, status: 'Active' },
  { id: 3, name: 'Washington Green Apples', category: 'Fresh Fruits', inventory: 15, unit: 'kg', price: 139, status: 'Low stock' },
  { id: 4, name: 'Amul Taaza Toned Milk', category: 'Dairy & Bakery', inventory: 120, unit: 'Pouches', price: 54, status: 'Active' },
  { id: 5, name: 'Coca-Cola Soft Drink Can', category: 'Drinks & Juices', inventory: 0, unit: 'Can', price: 40, status: 'Out of stock' }
];

function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Fresh Fruits');
  const [newProdInventory, setNewProdInventory] = useState(50);
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdPrice, setNewProdPrice] = useState(99);
  const [newProdStatus, setNewProdStatus] = useState('Active');

  // Compute status helper
  const getProductStatus = (stock) => {
    if (stock <= 0) return 'Out of stock';
    if (stock <= 20) return 'Low stock';
    return 'Active';
  };

  // Stock editor helpers
  const handleUpdateStock = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStock = Math.max(0, p.inventory + delta);
          return {
            ...p,
            inventory: nextStock,
            status: getProductStatus(nextStock)
          };
        }
        return p;
      })
    );
  };

  // Delete product helper
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Add Product form submission
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProduct = {
      id: Date.now(),
      name: newProdName,
      category: newProdCategory,
      inventory: Number(newProdInventory),
      unit: newProdUnit,
      price: Number(newProdPrice),
      status: getProductStatus(Number(newProdInventory))
    };

    setProducts((prev) => [newProduct, ...prev]);
    setIsModalOpen(false);

    // Reset Form
    setNewProdName('');
    setNewProdCategory('Fresh Fruits');
    setNewProdInventory(50);
    setNewProdUnit('kg');
    setNewProdPrice(99);
  };

  // Derive dynamic metrics
  const totalProducts = products.length;
  const outOfStockCount = useMemo(() => products.filter((p) => p.inventory === 0).length, [products]);
  const lowStockCount = useMemo(() => products.filter((p) => p.inventory > 0 && p.inventory <= 20).length, [products]);

  // Dynamic sum stats
  const activeOrdersCount = 28;
  const estimatedRevenue = products.reduce((sum, p) => sum + (p.price * 10), 4580); // mock dynamic base

  return (
    <div className="page">
      <h1>Seller Dashboard</h1>

      {/* KPI stats section */}
      <section className="summary-grid">
        <div className="panel">
          <span>Active Orders</span>
          <strong>{activeOrdersCount}</strong>
        </div>
        <div className="panel">
          <span>Estimated Sales</span>
          <strong>₹{estimatedRevenue.toLocaleString('en-IN')}</strong>
        </div>
        <div className="panel">
          <span>Out of Stock</span>
          <strong style={{ color: outOfStockCount > 0 ? 'var(--danger)' : 'var(--dark)' }}>
            {outOfStockCount}
          </strong>
        </div>
      </section>

      {/* Section Title */}
      <div className="section-title">
        <h2>Active Inventory ({totalProducts} Products)</h2>
        <button className="primary" onClick={() => setIsModalOpen(true)}>
          Add Fruit / Product +
        </button>
      </div>

      {/* Inventory Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fruit / Product Name</th>
              <th>Category</th>
              <th>Stock Inventory</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => {
              let statusClass = 'success';
              if (item.status === 'Low stock') statusClass = 'warning';
              if (item.status === 'Out of stock') statusClass = 'danger';

              return (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700 }}>{item.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{item.category}</td>
                  <td>
                    <div className="stock-cell">
                      <button className="qty-btn" onClick={() => handleUpdateStock(item.id, -5)} title="Decrease by 5">-</button>
                      <strong style={{ minWidth: '34px', display: 'inline-block', textAlign: 'center' }}>
                        {item.inventory} {item.unit}
                      </strong>
                      <button className="qty-btn" onClick={() => handleUpdateStock(item.id, 5)} title="Increase by 5">+</button>
                    </div>
                  </td>
                  <td style={{ fontWeight: 800 }}>₹{item.price}</td>
                  <td>
                    <span className={statusClass}>{item.status}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="delete-btn" onClick={() => handleDeleteProduct(item.id)} title="Delete product">
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                  No products in inventory. Click "Add Fruit / Product" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD FRUIT / PRODUCT DIALOG */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Add New Product</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="modal-body">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nagpur Seedless Oranges"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)}>
                  <option value="Seasonal Fruits">Seasonal Fruits</option>
                  <option value="Fresh Fruits">Fresh Fruits</option>
                  <option value="Daily Fruits">Daily Fruits</option>
                  <option value="Fruits & Veggies">Fruits & Veggies</option>
                  <option value="Dairy & Bakery">Dairy & Bakery</option>
                  <option value="Snacks & Munchies">Snacks & Munchies</option>
                  <option value="Drinks & Juices">Drinks & Juices</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Initial Stock *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProdInventory}
                    onChange={(e) => setNewProdInventory(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. kg, dozen, pcs"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Selling price in ₹"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthGate() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <SellerLogin onLogin={handleLogin} />;
  }

  return (
    <>
      {/* Sticky seller top bar */}
      <header className="sauth-topbar">
        <span className="sauth-topbar-brand">zepto</span>
        <div className="sauth-topbar-right">
          <span className="sauth-topbar-name">{currentUser.name}</span>
          <span className="sauth-topbar-role">{currentUser.role}</span>
          <button className="sauth-logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>
      {/* Existing App — completely unchanged */}
      <App />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthGate />
  </React.StrictMode>
);
