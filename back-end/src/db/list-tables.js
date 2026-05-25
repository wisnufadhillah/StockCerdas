const { pool } = require("./pool");

async function listTables() {
  const result = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

  console.log(result.rows.map((row) => row.table_name).join("\n"));
  await pool.end();
}

listTables().catch(async (error) => {
  console.error("Gagal membaca tabel:", error.message);
  await pool.end();
  process.exit(1);
});
