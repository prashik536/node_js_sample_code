CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  unit VARCHAR(30) DEFAULT 'kg',
  image_url VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  payment_status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier_name VARCHAR(120),
  status VARCHAR(30) DEFAULT 'queued',
  eta_minutes INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, price, stock, unit, image_url, description, is_active)
VALUES
  ('Mango Alphonso', 'Seasonal Fruits', 3.99, 70, 'kg', 'https://images.unsplash.com/photo-1553279768-865429fa0078', 'Sweet and aromatic mangoes from premium farms.', TRUE),
  ('Banana Robusta', 'Daily Fruits', 1.49, 120, 'dozen', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e', 'Freshly harvested bananas for daily nutrition.', TRUE),
  ('Green Apple', 'Fresh Fruits', 2.29, 90, 'kg', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce', 'Crisp fruit ideal for smoothies and healthy snacks.', TRUE),
  ('Watermelon', 'Seasonal Fruits', 2.75, 55, 'kg', 'https://images.unsplash.com/photo-1629084092232-1d1d5a09c9d7', 'Juicy and hydrating fruit for summer meals.', TRUE),
  ('Pineapple', 'Exotics', 2.99, 60, 'kg', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba', 'Bright tropical flavor with fresh acidity.', TRUE)
ON CONFLICT DO NOTHING;
