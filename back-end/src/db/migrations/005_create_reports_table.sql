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
