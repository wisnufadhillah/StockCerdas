const { pool } = require('./src/db/pool');

async function run() {
  try {
    // Add store_id to products
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE`);
    // Add store_id to stock_transactions
    await pool.query(`ALTER TABLE stock_transactions ADD COLUMN IF NOT EXISTS store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE`);
    // Add store_id to predictions
    await pool.query(`ALTER TABLE predictions ADD COLUMN IF NOT EXISTS store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE`);

    // Assign existing products to the first store of the tenant (Cabang Utama)
    await pool.query(`
      UPDATE products 
      SET store_id = (SELECT id FROM stores WHERE stores.tenant_id = products.tenant_id ORDER BY id ASC LIMIT 1)
      WHERE store_id IS NULL
    `);

    // Assign existing transactions to the first store
    await pool.query(`
      UPDATE stock_transactions 
      SET store_id = (
        SELECT store_id FROM products WHERE products.id = stock_transactions.product_id
      )
      WHERE store_id IS NULL
    `);

    // Assign existing predictions to the first store
    await pool.query(`
      UPDATE predictions 
      SET store_id = (
        SELECT store_id FROM products WHERE products.id = predictions.product_id
      )
      WHERE store_id IS NULL
    `);

    console.log('Database migrated successfully for multi-store support.');
  } catch(err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
