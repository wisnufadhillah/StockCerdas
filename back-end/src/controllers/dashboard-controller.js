const { pool } = require("../db/pool");

async function getUsers(req, res) {
  const result = await pool.query(
    `SELECT u.id, u.tenant_id, t.business_name, u.full_name, u.email, u.role, u.status, u.last_login_at, u.created_at
     FROM users u
     LEFT JOIN tenants t ON t.id = u.tenant_id
     ORDER BY u.id DESC`
  );

  res.json({ status: "success", data: result.rows });
}

async function getCategories(req, res) {
  const result = await pool.query(
    `SELECT id, tenant_id, name, description, created_at
     FROM product_categories
     ORDER BY name ASC`
  );

  res.json({ status: "success", data: result.rows });
}

async function getImports(req, res) {
  const result = await pool.query(
    `SELECT ib.*, t.business_name, u.full_name AS uploaded_by_name
     FROM import_batches ib
     LEFT JOIN tenants t ON t.id = ib.tenant_id
     LEFT JOIN users u ON u.id = ib.uploaded_by
     ORDER BY ib.created_at DESC`
  );

  res.json({ status: "success", data: result.rows });
}

async function getReports(req, res) {
  const result = await pool.query(
    `SELECT r.*, t.business_name, u.full_name AS generated_by_name
     FROM reports r
     LEFT JOIN tenants t ON t.id = r.tenant_id
     LEFT JOIN users u ON u.id = r.generated_by
     ORDER BY r.created_at DESC`
  );

  res.json({ status: "success", data: result.rows });
}

async function getStoreSettings(req, res) {
  const result = await pool.query(
    `SELECT ss.*, t.business_name
     FROM store_settings ss
     JOIN tenants t ON t.id = ss.tenant_id
     ORDER BY ss.tenant_id ASC, ss.setting_key ASC`
  );

  res.json({ status: "success", data: result.rows });
}

async function getSystemSettings(req, res) {
  const result = await pool.query(
    `SELECT id, setting_key, setting_value, description, created_at, updated_at
     FROM system_settings
     ORDER BY setting_key ASC`
  );

  res.json({ status: "success", data: result.rows });
}

async function getSystemServices(req, res) {
  const result = await pool.query(
    `SELECT id, service_name, service_type, endpoint, status, latency_ms, last_checked_at
     FROM system_services
     ORDER BY id ASC`
  );

  res.json({ status: "success", data: result.rows });
}

module.exports = {
  getUsers,
  getCategories,
  getImports,
  getReports,
  getStoreSettings,
  getSystemSettings,
  getSystemServices,
};
