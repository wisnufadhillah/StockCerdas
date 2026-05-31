const { pool } = require("../db/pool");
const { env } = require("../config/env");
const { recordAuditLog } = require("../services/audit-log-service");
const { buildServiceCheckResult, getServiceTimeoutMs, normalizeAuditLogRow, resolveServiceUrl } = require("../services/system-monitoring-service");

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

async function checkService(service) {
  const targetUrl = resolveServiceUrl(service, env);
  const startedAt = Date.now();

  if (!targetUrl) {
    return buildServiceCheckResult(service, { ok: false, latencyMs: 0 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getServiceTimeoutMs(service));

  try {
    const response = await fetch(targetUrl, { method: "GET", signal: controller.signal });
    return buildServiceCheckResult(service, { ok: response.ok, latencyMs: Date.now() - startedAt });
  } catch (error) {
    return buildServiceCheckResult(service, { ok: false, latencyMs: Date.now() - startedAt });
  } finally {
    clearTimeout(timeout);
  }
}

async function refreshSystemServices(req, res) {
  const services = await pool.query(
    `SELECT id, service_name, service_type, endpoint, status, latency_ms, last_checked_at
     FROM system_services
     ORDER BY id ASC`
  );

  const checkedServices = [];

  for (const service of services.rows) {
    const check = await checkService(service);
    const updated = await pool.query(
      `UPDATE system_services
       SET status = $1, latency_ms = $2, last_checked_at = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, service_name, service_type, endpoint, status, latency_ms, last_checked_at`,
      [check.status, check.latency_ms, check.last_checked_at, service.id]
    );
    checkedServices.push(updated.rows[0]);
  }

  await recordAuditLog(pool, {
    action: "system_services_refreshed",
    entityType: "system_service",
    metadata: { total_services: checkedServices.length },
  });

  res.json({ status: "success", data: checkedServices, message: "Status service berhasil diperbarui" });
}

async function getAuditLogs(req, res) {
  const result = await pool.query(
    `SELECT al.id, al.action, al.entity_type, al.entity_id, al.metadata, al.created_at,
            u.full_name AS actor_name, u.email AS actor_email
     FROM audit_logs al
     LEFT JOIN users u ON u.id = al.actor_user_id
     ORDER BY al.created_at DESC
     LIMIT 25`
  );

  res.json({ status: "success", data: result.rows.map(normalizeAuditLogRow) });
}

module.exports = {
  getUsers,
  getCategories,
  getImports,
  getReports,
  getStoreSettings,
  getSystemSettings,
  getSystemServices,
  refreshSystemServices,
  getAuditLogs,
};
