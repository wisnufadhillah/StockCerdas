const fs = require("fs/promises");
const path = require("path");
const { pool } = require("./pool");

async function initDatabase() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = await fs.readFile(schemaPath, "utf8");
  await pool.query(schema);
  await pool.end();
  console.log("Database stockcerdas_db siap digunakan.");
}

initDatabase().catch(async (error) => {
  console.error("Gagal inisialisasi database:", error.message);
  await pool.end();
  process.exit(1);
});
