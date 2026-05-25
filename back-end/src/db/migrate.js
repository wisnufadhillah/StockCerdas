const fs = require("fs/promises");
const path = require("path");
const { pool } = require("./pool");

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function getExecutedMigrations(client) {
  const result = await client.query("SELECT filename FROM schema_migrations ORDER BY filename ASC");
  return new Set(result.rows.map((row) => row.filename));
}

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const client = await pool.connect();

  try {
    await ensureMigrationsTable(client);
    const executed = await getExecutedMigrations(client);

    for (const file of files) {
      if (executed.has(file)) {
        console.log(`Lewati migrasi ${file}, sudah pernah dijalankan.`);
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`Migrasi ${file} berhasil.`);
    }
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
  console.error("Migrasi database gagal:", error.message);
  process.exit(1);
});
