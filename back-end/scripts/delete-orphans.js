const { pool } = require('./src/db/pool');
async function run() {
  const res = await pool.query("DELETE FROM users WHERE tenant_id IS NULL AND role = 'useradmin'");
  console.log('Deleted orphaned users:', res.rowCount);
  process.exit(0);
}
run();
