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

UPDATE products p
SET category_id = pc.id
FROM product_categories pc
WHERE p.tenant_id = pc.tenant_id
  AND p.category = pc.name
  AND p.category_id IS NULL;

INSERT INTO import_batches
  (tenant_id, uploaded_by, file_name, file_type, total_rows, valid_rows, invalid_rows, status, validation_summary)
SELECT
  1,
  2,
  'retail_feature_engineered.csv',
  'csv',
  1248,
  1246,
  2,
  'validated',
  '{"duplicate_products": 2, "missing_dates": 0}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM import_batches WHERE tenant_id = 1 AND file_name = 'retail_feature_engineered.csv'
);

INSERT INTO reports (tenant_id, generated_by, title, report_period, summary, metrics)
SELECT
  1,
  2,
  'Insight Penjualan Mingguan',
  '7 hari terakhir',
  'Produk minuman menyumbang 42% penjualan minggu ini.',
  '{"top_category": "Minuman", "revenue_share": 42}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM reports WHERE tenant_id = 1 AND title = 'Insight Penjualan Mingguan'
);

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
  ('Dashboard Data', 'data-science', 'streamlit', 'online', 120),
  ('Import Worker', 'worker', '/api/imports', 'warning', 310)
ON CONFLICT (service_name) DO NOTHING;

INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
SELECT
  1,
  'schema_migrated',
  'database',
  NULL,
  '{"migration": "011_seed_dashboard_reference_data"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1
  FROM audit_logs
  WHERE action = 'schema_migrated'
    AND metadata = '{"migration": "011_seed_dashboard_reference_data"}'::jsonb
);
