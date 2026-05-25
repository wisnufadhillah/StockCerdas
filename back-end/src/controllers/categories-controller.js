const { pool } = require("../db/pool");

async function getCategories(req, res) {
  const tenantId = req.query.tenant_id;
  if (!tenantId) {
    return res.status(400).json({ status: "fail", message: "tenant_id diperlukan" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM product_categories WHERE tenant_id = $1 ORDER BY name ASC`,
      [tenantId]
    );
    res.json({ status: "success", data: result.rows });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function createCategory(req, res) {
  const { tenant_id, name, description } = req.body;
  if (!tenant_id || !name) {
    return res.status(400).json({ status: "fail", message: "tenant_id dan name wajib diisi" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO product_categories (tenant_id, name, description)
       VALUES ($1, $2, $3) RETURNING *`,
      [tenant_id, name, description || ""]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ status: "fail", message: "name wajib diisi" });
  }

  try {
    const result = await pool.query(
      `UPDATE product_categories SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description || "", id]
    );
    if (!result.rowCount) return res.status(404).json({ status: "fail", message: "Kategori tidak ditemukan" });
    res.json({ status: "success", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM product_categories WHERE id = $1 RETURNING id`, [id]);
    if (!result.rowCount) return res.status(404).json({ status: "fail", message: "Kategori tidak ditemukan" });
    res.json({ status: "success", message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
