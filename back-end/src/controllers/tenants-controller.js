const { pool } = require("../db/pool");
const { recordAuditLog } = require("../services/audit-log-service");

async function getTenants(req, res) {
  const result = await pool.query(
    `SELECT t.id, t.business_name, t.owner_name, t.email, t.profile_image_url, t.business_type, t.status,
            COUNT(p.id)::int AS product_count, t.created_at
     FROM tenants t
     LEFT JOIN products p ON p.tenant_id = t.id
     GROUP BY t.id
     ORDER BY t.id DESC`
  );

  res.json({ status: "success", data: result.rows });
}

async function createTenant(req, res) {
  const { business_name, owner_name, email, profile_image_url, business_type = "Retail", status = "active" } = req.body;

  if (!business_name || !owner_name || !email) {
    res.status(400).json({ status: "fail", message: "business_name, owner_name, dan email wajib diisi" });
    return;
  }

  const result = await pool.query(
    `INSERT INTO tenants (business_name, owner_name, email, profile_image_url, business_type, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [business_name, owner_name, email, profile_image_url, business_type, status]
  );

  await recordAuditLog(pool, {
    action: "tenant_created",
    entityType: "tenant",
    entityId: result.rows[0].id,
    metadata: { business_name, email },
  });

  res.status(201).json({ status: "success", data: result.rows[0] });
}

async function updateTenant(req, res) {
  const { business_name, owner_name, email, profile_image_url, business_type, status } = req.body;
  const client = await pool.connect();
  let result;

  try {
    await client.query("BEGIN");
    result = await client.query(
      `UPDATE tenants
       SET business_name = COALESCE($1, business_name),
           owner_name = COALESCE($2, owner_name),
           email = COALESCE($3, email),
           profile_image_url = COALESCE($4, profile_image_url),
           business_type = COALESCE($5, business_type),
           status = COALESCE($6, status),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [business_name, owner_name, email, profile_image_url, business_type, status, req.params.id]
    );

    if (result.rowCount) {
      await client.query(
        `UPDATE users
         SET full_name = COALESCE($1, full_name),
             email = COALESCE($2, email),
             updated_at = NOW()
         WHERE tenant_id = $3 AND role = 'useradmin'`,
        [owner_name, email, req.params.id]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  if (!result.rowCount) {
    res.status(404).json({ status: "fail", message: "Akun UMKM tidak ditemukan" });
    return;
  }

  await recordAuditLog(pool, {
    action: "tenant_updated",
    entityType: "tenant",
    entityId: Number(req.params.id),
    metadata: { business_name: result.rows[0].business_name, email: result.rows[0].email, status: result.rows[0].status },
  });

  res.json({ status: "success", data: result.rows[0] });
}

async function deleteTenant(req, res) {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // Hapus users yang terhubung dengan tenant ini terlebih dahulu
    await client.query("DELETE FROM users WHERE tenant_id = $1", [req.params.id]);
    
    const result = await client.query("DELETE FROM tenants WHERE id = $1 RETURNING id", [req.params.id]);

    if (!result.rowCount) {
      await client.query("ROLLBACK");
      res.status(404).json({ status: "fail", message: "Akun UMKM tidak ditemukan" });
      return;
    }

    await client.query("COMMIT");
    await recordAuditLog(pool, {
      action: "tenant_deleted",
      entityType: "tenant",
      entityId: Number(req.params.id),
    });
    res.json({ status: "success", message: "Akun UMKM dan seluruh user terkait berhasil dihapus" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ status: "error", message: error.message });
  } finally {
    client.release();
  }
}

module.exports = { getTenants, createTenant, updateTenant, deleteTenant };
