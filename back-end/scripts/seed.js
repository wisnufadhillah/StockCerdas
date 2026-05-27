const { pool } = require('./src/db/pool');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Truncating tables...');
    await client.query('TRUNCATE tenants, users, products, stock_transactions, predictions, reports, store_settings RESTART IDENTITY CASCADE');

    console.log('Inserting superadmin...');
    await client.query(
      `INSERT INTO users (full_name, email, password, role, status) 
       VALUES ('Super Admin', 'superadmin@gmail.com', 'admin', 'superadmin', 'active')`
    );

    console.log('Inserting tenants and useradmins...');
    const tenants = [
      { name: 'Kopi Kenangan', email: 'admin@kenangan.id', plan: 'pro' },
      { name: 'Warung Bu Tejo', email: 'butejo@warung.id', plan: 'free' },
      { name: 'Toko Elektronik Makmur', email: 'admin@makmur.id', plan: 'free' }
    ];

    for (let i = 0; i < tenants.length; i++) {
      const t = tenants[i];
      const res = await client.query(
        `INSERT INTO tenants (business_name, owner_name, email, plan) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [t.name, 'Owner ' + (i + 1), t.email, t.plan]
      );
      const tenantId = res.rows[0].id;

      await client.query(
        `INSERT INTO users (tenant_id, full_name, email, password, role, status) 
         VALUES ($1, $2, $3, 'password123', 'useradmin', 'active')`,
        [tenantId, 'Admin ' + t.name, t.email]
      );
      
      // insert one store per tenant
      await client.query(
        `INSERT INTO stores (tenant_id, store_name, location) VALUES ($1, $2, $3)`,
        [tenantId, 'Cabang Utama ' + t.name, 'Jakarta']
      );
    }

    await client.query('COMMIT');
    console.log('Seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed();
