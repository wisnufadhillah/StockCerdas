const { pool } = require("../db/pool");

async function getTransactions(req, res) {
  const { store_id, tenant_id } = req.query;
  const params = [];
  const filters = [];

  if (store_id && store_id !== "undefined") {
    params.push(store_id);
    filters.push(`st.store_id = $${params.length}`);
  }

  if (tenant_id && tenant_id !== "undefined") {
    params.push(tenant_id);
    filters.push(`p.tenant_id = $${params.length}`);
  }

  const filter = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await pool.query(
    `SELECT st.id, st.store_id, st.product_id, p.sku, p.name AS product_name, st.transaction_type,
            st.quantity, st.transaction_date, st.note, st.created_at
     FROM stock_transactions st
     JOIN products p ON p.id = st.product_id
     ${filter}
     ORDER BY st.transaction_date DESC, st.id DESC`,
    params
  );

  res.json({ status: "success", data: result.rows });
}

async function createTransaction(req, res) {
  const { product_id, store_id, transaction_type, quantity, transaction_date, note } = req.body;

  if (!product_id || !store_id || !["in", "out"].includes(transaction_type) || !quantity) {
    res.status(400).json({
      status: "fail",
      message: "product_id, store_id, transaction_type ('in' atau 'out'), dan quantity wajib diisi",
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const transaction = await client.query(
      `INSERT INTO stock_transactions (product_id, store_id, transaction_type, quantity, transaction_date, note)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6)
       RETURNING *`,
      [product_id, store_id, transaction_type, quantity, transaction_date, note]
    );

    const stockDelta = transaction_type === "in" ? quantity : -quantity;
    const product = await client.query(
      `UPDATE products
       SET current_stock = GREATEST(current_stock + $1, 0),
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [stockDelta, product_id]
    );

    await client.query("COMMIT");
    res.status(201).json({
      status: "success",
      data: { transaction: transaction.rows[0], product: product.rows[0] },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function deleteTransaction(req, res) {
  const result = await pool.query("DELETE FROM stock_transactions WHERE id = $1 RETURNING id", [req.params.id]);

  if (!result.rowCount) {
    res.status(404).json({ status: "fail", message: "Transaksi tidak ditemukan" });
    return;
  }

  res.json({ status: "success", message: "Transaksi berhasil dihapus" });
}

module.exports = { getTransactions, createTransaction, deleteTransaction };
