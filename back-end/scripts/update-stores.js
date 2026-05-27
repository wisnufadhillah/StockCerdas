const { pool } = require('./src/db/pool');

async function updateStores() {
  try {
    const res = await pool.query(`
      UPDATE stores s
      SET store_name = t.business_name
      FROM tenants t
      WHERE s.tenant_id = t.id AND s.store_name = 'Cabang Utama'
    `);
    console.log(`Successfully updated ${res.rowCount} stores.`);
  } catch (error) {
    console.error('Error updating stores:', error);
  } finally {
    process.exit(0);
  }
}

updateStores();
