const { pool } = require("../db/pool");

async function getStores(req, res) {
  try {
    let result;
    // Since we don't have req.user, we should expect a query param or body.
    // For getStores we can't reliably get the user without a proper token middleware.
    // Let's just return all stores for demo purposes, or filter if tenant_id query is passed.
    const tenantId = req.query.tenant_id;
    if (tenantId) {
      result = await pool.query(`SELECT * FROM stores WHERE tenant_id = $1 ORDER BY id ASC`, [tenantId]);
    } else {
      result = await pool.query(`SELECT * FROM stores ORDER BY id ASC`);
    }
    res.json({ status: "success", data: result.rows });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function createStore(req, res) {
  try {
    const { tenant_id, store_name, location } = req.body;
    const targetTenant = tenant_id;
    
    if (!targetTenant || !store_name) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    // Check limit
    const tenantRes = await pool.query(`SELECT plan FROM tenants WHERE id = $1`, [targetTenant]);
    const plan = tenantRes.rows[0]?.plan || "free";
    
    const countRes = await pool.query(`SELECT COUNT(*) FROM stores WHERE tenant_id = $1`, [targetTenant]);
    const currentStores = parseInt(countRes.rows[0].count, 10);
    
    const limit = plan === "pro" ? 3 : 1;
    if (currentStores >= limit) {
      return res.status(403).json({ status: "error", message: `Limit paket ${plan} Anda adalah ${limit} toko.` });
    }

    const result = await pool.query(
      `INSERT INTO stores (tenant_id, store_name, location) VALUES ($1, $2, $3) RETURNING *`,
      [targetTenant, store_name, location || ""]
    );

    res.status(201).json({ status: "success", data: result.rows[0], message: "Store created successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function deleteStore(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM stores WHERE id = $1 RETURNING *`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ status: "error", message: "Store not found or unauthorized" });
    }

    res.json({ status: "success", message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

module.exports = {
  getStores,
  createStore,
  deleteStore,
};
