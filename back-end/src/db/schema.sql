CREATE TABLE IF NOT EXISTS tenants (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR(150) NOT NULL,
  owner_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  profile_image_url TEXT,
  business_type VARCHAR(80) DEFAULT 'Retail',
  status VARCHAR(30) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('superadmin', 'useradmin')),
  status VARCHAR(30) DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price NUMERIC(12, 2) DEFAULT 0,
  current_stock INTEGER DEFAULT 0,
  minimum_stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_transactions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('in', 'out')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS import_batches (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(20) NOT NULL,
  total_rows INTEGER DEFAULT 0,
  valid_rows INTEGER DEFAULT 0,
  invalid_rows INTEGER DEFAULT 0,
  status VARCHAR(30) DEFAULT 'pending',
  validation_summary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  forecast_period VARCHAR(30) NOT NULL,
  predicted_demand INTEGER NOT NULL,
  current_stock INTEGER NOT NULL,
  recommended_restock INTEGER NOT NULL,
  risk_level VARCHAR(30) NOT NULL,
  ai_raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
  generated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  report_period VARCHAR(50) NOT NULL,
  summary TEXT,
  metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_settings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
  setting_key VARCHAR(80) NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, setting_key)
);

CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(80) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_services (
  id SERIAL PRIMARY KEY,
  service_name VARCHAR(100) UNIQUE NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  endpoint VARCHAR(255),
  status VARCHAR(30) DEFAULT 'online',
  latency_ms INTEGER DEFAULT 0,
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON stock_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_predictions_product_id ON predictions(product_id);
CREATE INDEX IF NOT EXISTS idx_reports_tenant_id ON reports(tenant_id);

INSERT INTO tenants (business_name, owner_name, email, business_type, status)
VALUES
  ('Kedai Kopi Sari', 'Dina Putri', 'dina@kopisari.id', 'F&B', 'active'),
  ('Warung Berkah', 'Rafi Ahmad', 'rafi@berkah.id', 'Retail', 'active'),
  ('Toko Sembako Maju', 'Yulia R', 'yulia@sembakomaju.id', 'Sembako', 'review')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (tenant_id, full_name, email, password, role, status)
VALUES
  (NULL, 'Super Admin', 'superadmin@gmail.com', 'admin', 'superadmin', 'active'),
  (1, 'Dina Putri', 'dina@kopisari.id', 'demo123', 'useradmin', 'active'),
  (2, 'Rafi Ahmad', 'rafi@berkah.id', 'demo123', 'useradmin', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO product_categories (tenant_id, name, description)
VALUES
  (1, 'Minuman', 'Produk minuman siap jual'),
  (1, 'Snack', 'Makanan ringan'),
  (1, 'Bumbu', 'Bumbu dan bahan masakan')
ON CONFLICT (tenant_id, name) DO NOTHING;

INSERT INTO products (tenant_id, sku, name, category, price, current_stock, minimum_stock)
VALUES
  (1, 'SKU-014', 'Kopi Susu Botol', 'Minuman', 12000, 12, 20),
  (1, 'SKU-021', 'Keripik Singkong', 'Snack', 9500, 64, 25),
  (1, 'SKU-038', 'Teh Melati 500ml', 'Minuman', 6000, 0, 16),
  (1, 'SKU-044', 'Bumbu Nasi Goreng', 'Bumbu', 4500, 31, 18)
ON CONFLICT (sku) DO NOTHING;

UPDATE products p
SET category_id = pc.id
FROM product_categories pc
WHERE p.tenant_id = pc.tenant_id
  AND p.category = pc.name
  AND p.category_id IS NULL;

INSERT INTO stock_transactions (product_id, transaction_type, quantity, transaction_date, note)
SELECT id, 'out', 24, CURRENT_DATE, 'Penjualan harian'
FROM products
WHERE sku = 'SKU-014'
  AND NOT EXISTS (SELECT 1 FROM stock_transactions WHERE note = 'Penjualan harian' AND product_id = products.id);

INSERT INTO import_batches
  (tenant_id, uploaded_by, file_name, file_type, total_rows, valid_rows, invalid_rows, status, validation_summary)
VALUES
  (1, 2, 'retail_feature_engineered.csv', 'csv', 1248, 1246, 2, 'validated', '{"duplicate_products": 2, "missing_dates": 0}'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO reports (tenant_id, generated_by, title, report_period, summary, metrics)
VALUES
  (1, 2, 'Insight Penjualan Mingguan', '7 hari terakhir', 'Produk minuman menyumbang 42% penjualan minggu ini.', '{"top_category": "Minuman", "revenue_share": 42}'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO store_settings (tenant_id, setting_key, setting_value)
VALUES
  (1, 'prediction_mode', 'prioritize_understock'),
  (1, 'default_forecast_period', '7_days'),
  (1, 'low_stock_alert', 'enabled')
ON CONFLICT (tenant_id, setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, description)
VALUES
  ('default_forecast_period', '7_days', 'Periode prediksi default platform'),
  ('understock_threshold', 'stock_less_than_3_days_prediction', 'Ambang risiko understock'),
  ('allowed_import_formats', 'csv,xlsx', 'Format file import yang diterima')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_services (service_name, service_type, endpoint, status, latency_ms)
VALUES
  ('RESTful API', 'backend', '/api/health', 'online', 92),
  ('Service AI', 'ai', '/predict', 'online', 180),
  ('Dashboard Data', 'data-science', 'https://stockcerdas.streamlit.app/', 'online', 120),
  ('Import Worker', 'worker', '/api/import/health', 'online', 120)
ON CONFLICT (service_name) DO NOTHING;
