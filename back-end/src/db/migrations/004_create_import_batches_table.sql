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
