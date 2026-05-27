const { pool } = require('./src/db/pool');
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products'").then(res => { console.log(res.rows); process.exit(0); });
