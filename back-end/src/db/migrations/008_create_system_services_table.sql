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
