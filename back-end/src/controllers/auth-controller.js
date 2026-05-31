const { pool } = require("../db/pool");
const { recordAuditLog } = require("../services/audit-log-service");

async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    res.status(400).json({ status: "fail", message: "Email dan password wajib diisi" });
    return;
  }

  const result = await pool.query(
    `SELECT u.id, u.tenant_id, u.full_name, u.email, u.role, u.status, t.business_name, t.plan, t.profile_image_url
     FROM users u
     LEFT JOIN tenants t ON t.id = u.tenant_id
     WHERE LOWER(u.email) = $1 AND u.password = $2
     LIMIT 1`,
    [email, password]
  );

  if (!result.rowCount) {
    res.status(401).json({ status: "fail", message: "Email atau password tidak sesuai" });
    return;
  }

  const user = result.rows[0];

  if (user.status !== "active") {
    res.status(403).json({ status: "fail", message: "Akun tidak aktif" });
    return;
  }

  await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);
  await recordAuditLog(pool, {
    actorUserId: user.id,
    action: "login",
    entityType: "user",
    entityId: user.id,
    metadata: { email: user.email, role: user.role },
  });

  res.json({
    status: "success",
    data: {
      id: user.id,
      tenant_id: user.tenant_id,
      name: user.full_name,
      email: user.email,
      role: user.role,
      business_name: user.business_name,
      profile_image_url: user.profile_image_url,
      plan: user.plan || "free",
    },
  });
}

async function register(req, res) {
  const fullName = String(req.body.fullName || req.body.full_name || "").trim();
  const businessName = String(req.body.businessName || req.body.business_name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const businessType = String(req.body.businessType || req.body.business_type || "Retail").trim();

  if (!fullName || !businessName || !email || !password) {
    res.status(400).json({ status: "fail", message: "Data register belum lengkap" });
    return;
  }

  if (email === "superadmin@gmail.com") {
    res.status(409).json({ status: "fail", message: "Email ini khusus Super Admin" });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tenantResult = await client.query(
      `INSERT INTO tenants (business_name, owner_name, email, business_type, status)
       VALUES ($1, $2, $3, $4, 'active')
       RETURNING *`,
      [businessName, fullName, email, businessType]
    );

    const userResult = await client.query(
      `INSERT INTO users (tenant_id, full_name, email, password, role, status)
       VALUES ($1, $2, $3, $4, 'useradmin', 'active')
       RETURNING id, tenant_id, full_name, email, role`,
      [tenantResult.rows[0].id, fullName, email, password]
    );

    // Create default store using business name
    await client.query(
      `INSERT INTO stores (tenant_id, store_name, location, status)
       VALUES ($1, $2, 'Pusat', 'active')`,
      [tenantResult.rows[0].id, businessName]
    );

    await client.query("COMMIT");

    const user = userResult.rows[0];
    await recordAuditLog(pool, {
      actorUserId: user.id,
      action: "tenant_registered",
      entityType: "tenant",
      entityId: tenantResult.rows[0].id,
      metadata: { business_name: tenantResult.rows[0].business_name, email: user.email },
    });

    res.status(201).json({
      status: "success",
      data: {
        id: user.id,
        tenant_id: user.tenant_id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        business_name: tenantResult.rows[0].business_name,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      res.status(409).json({ status: "fail", message: "Email sudah terdaftar" });
      return;
    }

    throw error;
  } finally {
    client.release();
  }
}

module.exports = { login, register };
