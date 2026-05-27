const { pool } = require("../db/pool");

async function getProducts(req, res) {
  const { category, status, search, tenant_id } = req.query;
  const params = [];
  const filters = [];

  if (tenant_id && tenant_id !== "undefined") {
    params.push(tenant_id);
    filters.push(`tenant_id = $${params.length}`);
  }

  if (category) {
    params.push(category);
    filters.push(`category ILIKE $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    filters.push(`(name ILIKE $${params.length} OR sku ILIKE $${params.length})`);
  }

  if (status === "low") {
    filters.push("current_stock > 0 AND current_stock <= minimum_stock");
  }

  if (status === "empty") {
    filters.push("current_stock = 0");
  }

  if (status === "safe") {
    filters.push("current_stock > minimum_stock");
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await pool.query(
    `SELECT id, tenant_id, store_id, sku, name, category, price, current_stock, minimum_stock, created_at, updated_at
     FROM products
     ${where}
     ORDER BY id DESC`,
    params
  );

  res.json({ status: "success", data: result.rows });
}

async function getProductById(req, res) {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);

  if (!result.rowCount) {
    res.status(404).json({ status: "fail", message: "Produk tidak ditemukan" });
    return;
  }

  res.json({ status: "success", data: result.rows[0] });
}

async function createProduct(req, res) {
  const { tenant_id, store_id, sku, name, category, price = 0, current_stock = 0, minimum_stock = 0 } = req.body;

  if (!tenant_id || !store_id || !sku || !name || !category) {
    res.status(400).json({ status: "fail", message: "tenant_id, store_id, sku, name, dan category wajib diisi" });
    return;
  }

  const result = await pool.query(
    `INSERT INTO products (tenant_id, store_id, sku, name, category, price, current_stock, minimum_stock)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [tenant_id, store_id, sku, name, category, price, current_stock, minimum_stock]
  );

  res.status(201).json({ status: "success", data: result.rows[0] });
}

async function updateProduct(req, res) {
  const { sku, name, category, price, current_stock, minimum_stock } = req.body;
  const result = await pool.query(
    `UPDATE products
     SET sku = COALESCE($1, sku),
         name = COALESCE($2, name),
         category = COALESCE($3, category),
         price = COALESCE($4, price),
         current_stock = COALESCE($5, current_stock),
         minimum_stock = COALESCE($6, minimum_stock),
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [sku, name, category, price, current_stock, minimum_stock, req.params.id]
  );

  if (!result.rowCount) {
    res.status(404).json({ status: "fail", message: "Produk tidak ditemukan" });
    return;
  }

  res.json({ status: "success", data: result.rows[0] });
}

async function deleteProduct(req, res) {
  const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [req.params.id]);

  if (!result.rowCount) {
    res.status(404).json({ status: "fail", message: "Produk tidak ditemukan" });
    return;
  }

  res.json({ status: "success", message: "Produk berhasil dihapus" });
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
