const { pool } = require('./src/db/pool');

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
        store_name VARCHAR(150) NOT NULL,
        location VARCHAR(255),
        status VARCHAR(30) DEFAULT 'Aktif',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    // Insert Cabang Utama if not exist
    await pool.query(`
      INSERT INTO stores (tenant_id, store_name, location)
      SELECT id, 'Cabang Utama', 'Pusat' FROM tenants
      WHERE NOT EXISTS (SELECT 1 FROM stores WHERE tenant_id = tenants.id)
    `);

    console.log('Stores table created and populated');
  } catch(err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
